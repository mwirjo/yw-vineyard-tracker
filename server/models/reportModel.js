// models/reportModel.js
const { getDb } = require('../config/db'); // Adjust path to match your db connection setup
const { ObjectId } = require('mongodb');

const REPORTS_COLLECTION = 'reports';
const STATUS_COLLECTION = 'member_status';

class ReportModel {
  // Helper to build query for reportId OR ObjectId string
  static getReportQuery(identifier) {
    if (ObjectId.isValid(identifier)) {
      return {
        $or: [{ _id: new ObjectId(identifier) }, { reportId: String(identifier) }]
      };
    }
    return { reportId: String(identifier) };
  }

  // Fetch reports with optional filters
  static async getReports({ memberId, status }) {
    const db = getDb();
    const query = {};
    if (memberId) query.memberId = String(memberId);
    if (status) query.status = status;

    return await db.collection(REPORTS_COLLECTION).find(query).toArray();
  }

  // Create new progress report
  static async create(data) {
    const db = getDb();
    const newReport = {
      reportId: `report-${Date.now()}`,
      memberId: String(data.memberId),
      estimatedDroplets: Number(data.estimatedDroplets) || 0,
      summary: data.summary || '',
      status: 'pending',
      createdAt: new Date()
    };

    const result = await db.collection(REPORTS_COLLECTION).insertOne(newReport);
    return { _id: result.insertedId, ...newReport };
  }

  // Process leader review (Pending Reward Model + Safe Oil Check)
static async processReview(identifier, approved) {
  const db = getDb();
  const query = this.getReportQuery(identifier);

  // 1. Locate the report
  const report = await db.collection(REPORTS_COLLECTION).findOne(query);
  if (!report) {
    return { success: false, reason: 'Report not found' };
  }

  // Guard Clause: Only pending reports can be reviewed
  if (report.status !== 'pending') {
    return { 
      success: false, 
      reason: `Cannot process review: Report is already '${report.status}'. Only 'pending' reports can be reviewed.` 
    };
  }

  // 2. If rejected, update status without altering member oil
  if (!approved) {
    await db.collection(REPORTS_COLLECTION).updateOne(query, {
      $set: { status: 'rejected', updatedAt: new Date() }
    });
    return { success: true, status: 'rejected' };
  }

  // 3. Locate member status record
  const memberStatus = await db.collection(STATUS_COLLECTION).findOne({
    memberId: String(report.memberId)
  });

  if (!memberStatus) {
    const error = new Error(`Cannot approve report: Member status record for memberId '${report.memberId}' does not exist.`);
    error.statusCode = 404;
    throw error;
  }

  // 4. Safely handle current oilInLamp value
  const currentOil = typeof memberStatus.oilInLamp === 'number' ? memberStatus.oilInLamp : 0;
  const dropletsToAdd = Number(report.estimatedDroplets) || 0;

  // 5. Update member oil balance
  await db.collection(STATUS_COLLECTION).updateOne(
    { memberId: String(report.memberId) },
    { $set: { oilInLamp: currentOil + dropletsToAdd, updatedAt: new Date() } }
  );

  // 6. Update report status to approved
  await db.collection(REPORTS_COLLECTION).updateOne(query, {
    $set: { status: 'approved', updatedAt: new Date() }
  });

  return { success: true, status: 'approved' };
}

  // Edit and resubmit a report (resets status to pending)
static async updateAndResubmit(identifier, updateData) {
  const db = getDb();
  const query = this.getReportQuery(identifier);

  const fieldsToUpdate = { 
    status: 'pending', // Explicitly resets status back to pending for review!
    updatedAt: new Date() 
  };
  
  if (updateData.summary !== undefined) fieldsToUpdate.summary = updateData.summary;
  if (updateData.estimatedDroplets !== undefined) {
    fieldsToUpdate.estimatedDroplets = Number(updateData.estimatedDroplets);
  }

  const result = await db.collection(REPORTS_COLLECTION).updateOne(query, { $set: fieldsToUpdate });
  return result.matchedCount > 0;
}

  // Delete a report
  static async deleteById(identifier) {
    const db = getDb();
    const query = this.getReportQuery(identifier);
    const result = await db.collection(REPORTS_COLLECTION).deleteOne(query);
    return result.deletedCount > 0;
  }
}

module.exports = ReportModel;
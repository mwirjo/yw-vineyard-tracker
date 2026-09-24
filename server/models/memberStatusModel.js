const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Target exact database collection name
const COLLECTION = 'member_status';

class MemberStatusModel {
  static async getAll(memberId) {
    const db = getDB();
    const query = memberId ? { memberId: String(memberId) } : {};
    return await db.collection(COLLECTION).find(query).toArray();
  }

  static async create(data) {
    const db = getDB();
    const existing = await db.collection(COLLECTION).findOne({ memberId: String(data.memberId) });

    if (existing) {
      const error = new Error(`Member status already exists for memberId '${data.memberId}'. Use PUT to update.`);
      error.statusCode = 400;
      throw error;
    }

    const newRecord = {
      memberId: String(data.memberId),
      oilInLamp: Number(data.oilInLamp) || 0,
      oilReserve: Number(data.oilReserve) || 0,
      activityPasses: Number(data.activityPasses) || 0,
      talentDroplets: data.talentDroplets || { red: 0, blue: 0, gold: 0 },
      talents: data.talents || { red: 0, blue: 0, gold: 0 },
      updatedAt: new Date()
    };

    const result = await db.collection(COLLECTION).insertOne(newRecord);
    return { _id: result.insertedId, ...newRecord };
  }

  static async updateById(identifier, updateData) {
    const db = getDB();
    let query = { memberId: String(identifier) };

    if (ObjectId.isValid(identifier)) {
      query = {
        $or: [{ _id: new ObjectId(identifier) }, { memberId: String(identifier) }]
      };
    }

    const fieldsToUpdate = {};
    if (updateData.oilInLamp !== undefined) fieldsToUpdate.oilInLamp = Number(updateData.oilInLamp);
    if (updateData.oilReserve !== undefined) fieldsToUpdate.oilReserve = Number(updateData.oilReserve);
    if (updateData.activityPasses !== undefined) fieldsToUpdate.activityPasses = Number(updateData.activityPasses);
    if (updateData.talentDroplets) fieldsToUpdate.talentDroplets = updateData.talentDroplets;
    if (updateData.talents) fieldsToUpdate.talents = updateData.talents;
    fieldsToUpdate.updatedAt = new Date();

    const result = await db.collection(COLLECTION).updateOne(query, { $set: fieldsToUpdate });
    return result.matchedCount > 0;
  }

  static async deleteById(identifier) {
    const db = getDB();
    let query = { memberId: String(identifier) };

    if (ObjectId.isValid(identifier)) {
      query = {
        $or: [{ _id: new ObjectId(identifier) }, { memberId: String(identifier) }]
      };
    }

    const result = await db.collection(COLLECTION).deleteOne(query);
    return result.deletedCount > 0;
  }
}

module.exports = MemberStatusModel;
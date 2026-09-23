const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// GET /api/status - Returns status info
const getMemberStatus = async (req, res) => {
  try {
    const db = getDB();
    const { memberId } = req.query;
    const clientVersion = req.headers['x-client-version'];

    const query = memberId ? { memberId } : {};
    const status = await db.collection('member_status').find(query).toArray();

    res.status(200).json({
      success: true,
      clientVersionReceived: clientVersion || 'none',
      data: status
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/status/:id - Update member status details (PUT)
const updateMemberStatus = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { oilInLamp, oilReserve, activityPasses } = req.body;

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { memberId: id };
    const updateDoc = {
      $set: {
        ...(oilInLamp !== undefined && { oilInLamp }),
        ...(oilReserve !== undefined && { oilReserve }),
        ...(activityPasses !== undefined && { activityPasses }),
        updatedAt: new Date()
      }
    };

    const result = await db.collection('member_status').updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Member status record not found.' });
    }

    res.status(204).send(); // 204 No Content for successful PUT
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/status/:id - Delete member status record (DELETE)
const deleteMemberStatus = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { memberId: id };
    const result = await db.collection('member_status').deleteOne(filter);

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Member status record not found.' });
    }

    res.status(200).json({ success: true, message: 'Member status record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getMemberStatus,
  updateMemberStatus,
  deleteMemberStatus
};
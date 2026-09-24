const MemberStatusModel = require('../models/memberStatusModel');

// GET /api/status - Retrieve all member statuses or filter by memberId
exports.getMemberStatus = async (req, res) => {
  try {
    const { memberId } = req.query;
    const records = await MemberStatusModel.getAll(memberId);

    if (memberId && records.length === 0) {
      return res.status(404).json({ success: false, error: 'Member status record not found.' });
    }

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/status - Create a new member status document
exports.createMemberStatus = async (req, res) => {
  try {
    const { memberId, oilInLamp, oilReserve, activityPasses, talentDroplets, talents } = req.body;

    if (!memberId) {
      return res.status(400).json({ success: false, error: 'Missing required field: memberId' });
    }

    const newRecord = await MemberStatusModel.create({
      memberId,
      oilInLamp,
      oilReserve,
      activityPasses,
      talentDroplets,
      talents
    });

    res.status(201).json({ success: true, insertedId: newRecord._id, data: newRecord });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

// PUT /api/status/:id - Update member status by ID or memberId
exports.updateMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await MemberStatusModel.updateById(id, updateData);

    if (!updated) {
      return res.status(404).json({ success: false, error: `Record with ID/memberId '${id}' not found.` });
    }

    res.status(200).json({ success: true, message: 'Member status updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/status/:id - Delete a member status document
exports.deleteMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MemberStatusModel.deleteById(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: `Record with ID/memberId '${id}' not found.` });
    }

    res.status(200).json({ success: true, message: 'Record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
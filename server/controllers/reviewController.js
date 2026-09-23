const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const createApprovalReward = () => {
  const reward = {
    category: 'oil',
    rarity: 'common',
    amount: 0
  };

  if (Math.random() >= 0.3) {
    reward.amount = Math.floor(Math.random() * 16) + 10;
    return reward;
  }

  const rarityRoll = Math.random();
  reward.rarity = rarityRoll < 0.05
    ? 'rare'
    : rarityRoll < 0.3
      ? 'uncommon'
      : 'common';

  if (Math.random() < 0.1) {
    reward.category = 'talent';
  } else {
    reward.category = 'droplet';
  }

  return reward;
};

const reviewReport = async (req, res) => {
  try {
    const { reportId, approved } = req.body || {};

    if (!reportId || typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'reportId and approved are required.'
      });
    }

    const db = getDB();
    const reports = db.collection('reports');
    const members = db.collection('member_status');
    const report = await reports.findOne({ reportId, status: 'pending' });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Pending report not found.'
      });
    }

    const member = await members.findOne({ memberId: report.memberId });
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found.'
      });
    }

    const claimedDroplets = report.estimatedDroplets ?? report.reward ?? 0;
    const status = approved ? 'approved' : 'rejected';
    const rewardUpdate = approved
      ? applyApprovalReward(createApprovalReward())
      : {
          update: {
          $set: {
            oilInLamp: Math.max(0, (member.oilInLamp || 0) - claimedDroplets)
          }
          },
          penalty: claimedDroplets
        };

    await members.updateOne({ _id: member._id }, rewardUpdate.update);
    await reports.updateOne(
      { _id: report._id },
      {
        $set: {
          status,
          ...(approved ? { droppedTalent: rewardUpdate.reward } : {})
        }
      }
    );

    res.status(200).json({
      success: true,
      reportId,
      status,
      ...(approved ? { reward: rewardUpdate.reward } : { penalty: rewardUpdate.penalty })
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const applyApprovalReward = (reward) => {
  const update = { $inc: {}, reward };

  if (reward.category === 'oil') {
    update.$inc.oilReserve = reward.amount;
  } else if (reward.category === 'droplet') {
    const color = reward.rarity === 'rare'
      ? 'gold'
      : reward.rarity === 'uncommon'
        ? 'blue'
        : 'red';
    update.$inc[`talentDroplets.${color}`] = 1;
  } else {
    const color = reward.rarity === 'rare'
      ? 'gold'
      : reward.rarity === 'uncommon'
        ? 'blue'
        : 'red';
    update.$inc[`talents.${color}`] = 1;
    if (color === 'gold') update.$inc.activityPasses = 1;
  }

  return { update: { $inc: update.$inc }, reward: update.reward };
};
const deleteReport = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { reportId: id };
    const result = await db.collection('reports').deleteOne(filter);

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Report not found.' });
    }

    res.status(200).json({ success: true, message: 'Report deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  reviewReport,
  deleteReport
};


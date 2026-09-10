const { getDB } = require('../config/db');

// GET /api/status - Returns oil, reserve, drops, and keys
const getMemberStatus = async (req, res) => {
  try {
    const db = getDB();
    
    // Access Query Parameters (e.g., /api/status?memberId=123)
    const { memberId } = req.query;
    
    // Access HTTP Headers
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

module.exports = { getMemberStatus };
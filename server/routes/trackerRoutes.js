const express = require('express');
const router = express.Router();
const {
  getMemberStatus,
  updateMemberStatus,
  deleteMemberStatus
} = require('../controllers/trackerController');
const {
  reviewReport,
  deleteReport
} = require('../controllers/reviewController');

// Member Status endpoints
router.get('/status', getMemberStatus);
router.put('/status/:id', updateMemberStatus);
router.delete('/status/:id', deleteMemberStatus);

// Report Review endpoints
router.post('/reports/review', reviewReport);
router.delete('/reports/:id', deleteReport);

module.exports = router;
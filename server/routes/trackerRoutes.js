const express = require('express');
const router = express.Router();

// Member Status Controller Methods
const {
  getMemberStatus,
  createMemberStatus,
  updateMemberStatus,
  deleteMemberStatus
} = require('../controllers/trackerController');

// Report Controller Methods
const {
  getReports,
  submitReport,
  updateReport,
  reviewReport,
  deleteReport
} = require('../controllers/reportController');

// ==========================================
// Member Status Routes
// ==========================================
router.get('/status', getMemberStatus);
router.post('/status', createMemberStatus);
router.put('/status/:id', updateMemberStatus);
router.delete('/status/:id', deleteMemberStatus);

// ==========================================
// Progress Report Routes
// ==========================================
router.get('/reports', getReports);
router.post('/reports', submitReport);
router.put('/reports/:id', updateReport);
router.post('/reports/review', reviewReport);
router.delete('/reports/:id', deleteReport);

module.exports = router;
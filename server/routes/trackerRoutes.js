const express = require('express');
const router = express.Router();
const { getMemberStatus } = require('../controllers/trackerController');
const { reviewReport } = require('../controllers/reviewController');

router.get('/status', getMemberStatus);
router.post('/reports/review', reviewReport);

module.exports = router;
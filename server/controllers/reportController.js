const ReportModel = require('../models/reportModel');

// GET /api/reports - Fetch reports with optional filters (memberId, status)
exports.getReports = async (req, res) => {
  try {
    const { memberId, status } = req.query;
    const reports = await ReportModel.getReports({ memberId, status });
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/reports - Submit a new daily progress report
exports.submitReport = async (req, res) => {
  try {
    const { memberId, estimatedDroplets, summary } = req.body;

    if (!memberId) {
      return res.status(400).json({ success: false, error: 'Missing required field: memberId' });
    }

    const newReport = await ReportModel.create({ memberId, estimatedDroplets, summary });
    res.status(201).json({ success: true, insertedId: newReport._id, data: newReport });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/reports/:id - Edit and resubmit a report (resets status to pending)
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary, estimatedDroplets } = req.body;

    const updated = await ReportModel.updateAndResubmit(id, { summary, estimatedDroplets });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Report not found.' });
    }

    res.status(200).json({ success: true, message: 'Report updated and resubmitted as pending.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/reports/review - Leader review endpoint (Pending Reward Model)
exports.reviewReport = async (req, res) => {
  try {
    const { reportId, approved } = req.body;

    if (!reportId || typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: reportId (string) and approved (boolean).'
      });
    }

    const result = await ReportModel.processReview(reportId, approved);

    if (!result.success) {
      // 404 if report wasn't found, 400 if report exists but isn't in 'pending' status
      const statusCode = result.reason === 'Report not found' ? 404 : 400;
      return res.status(statusCode).json({ success: false, error: result.reason || 'Report review failed.' });
    }

    res.status(200).json({
      success: true,
      message: `Report ${result.status}.${approved ? ' Oil reward added to member balance.' : ' No oil awarded.'}`
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

// DELETE /api/reports/:id - Delete a report by ID or reportId
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ReportModel.deleteById(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Report not found.' });
    }

    res.status(200).json({ success: true, message: 'Report deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
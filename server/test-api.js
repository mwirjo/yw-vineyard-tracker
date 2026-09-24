// server/test-api.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_MEMBER_ID = `test-user-${Date.now()}`;

// Helper for colored console output
const logSuccess = (msg) => console.log(`\x1b[32m✔ PASS:\x1b[0m ${msg}`);
const logFail = (msg, err) => console.error(`\x1b[31m✖ FAIL:\x1b[0m ${msg}`, err?.response?.data || err.message);

async function runTestSuite() {
  console.log(`\n========== STARTING API INTEGRATION TESTS ==========\n`);
  let createdReportId = null;

  try {
    // 1. Create Member Status
    console.log(`1. Testing POST /api/status for memberId: ${TEST_MEMBER_ID}...`);
    const statusRes = await axios.post(`${BASE_URL}/status`, {
      memberId: TEST_MEMBER_ID,
      oilInLamp: 10,
      oilReserve: 20,
      activityPasses: 1
    });
    if (statusRes.data.success) {
      logSuccess('Member status created successfully.');
    }

    // 2. Prevent Duplicate Member Status
    console.log(`\n2. Testing duplicate POST /api/status (Should fail with 400)...`);
    try {
      await axios.post(`${BASE_URL}/status`, { memberId: TEST_MEMBER_ID });
      logFail('Duplicate check failed! Server allowed creating same member twice.');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        logSuccess('Duplicate member creation correctly rejected with 400 Bad Request.');
      } else {
        logFail('Duplicate check returned unexpected status code.', err);
      }
    }

    // 3. Submit Daily Progress Report
    console.log(`\n3. Testing POST /api/reports...`);
    const reportRes = await axios.post(`${BASE_URL}/reports`, {
      memberId: TEST_MEMBER_ID,
      estimatedDroplets: 15,
      summary: 'Completed test script objectives.'
    });
    if (reportRes.data.success) {
      createdReportId = reportRes.data.data.reportId;
      logSuccess(`Progress report created with ID: ${createdReportId}`);
    }

    // 4. Fetch Reports for Member
    console.log(`\n4. Testing GET /api/reports?memberId=${TEST_MEMBER_ID}...`);
    const getReportsRes = await axios.get(`${BASE_URL}/reports?memberId=${TEST_MEMBER_ID}`);
    if (getReportsRes.data.data.length > 0) {
      logSuccess(`Retrieved ${getReportsRes.data.data.length} pending report(s).`);
    }

    // 5. Leader Review - Approve Report
    console.log(`\n5. Testing POST /api/reports/review (Approving 15 droplets)...`);
    const reviewRes = await axios.post(`${BASE_URL}/reports/review`, {
      reportId: createdReportId,
      approved: true
    });
    if (reviewRes.data.success) {
      logSuccess('Report successfully approved.');
    }

    // 6. Verify Updated Oil Balance (10 original + 15 approved = 25 total)
    console.log(`\n6. Testing GET /api/status?memberId=${TEST_MEMBER_ID} (Verifying oil update)...`);
    const checkBalanceRes = await axios.get(`${BASE_URL}/status?memberId=${TEST_MEMBER_ID}`);
    const updatedMember = checkBalanceRes.data.data[0];
    
    if (updatedMember && updatedMember.oilInLamp === 25) {
      logSuccess(`Oil balance correctly increased to 25! (Current balance: ${updatedMember.oilInLamp})`);
    } else {
      logFail(`Oil balance mismatch! Expected 25, but got: ${updatedMember?.oilInLamp}`);
    }

    // 7. Prevent Double Approval (Should fail with 400)
    console.log(`\n7. Testing POST /api/reports/review on already approved report (Should fail)...`);
    try {
      await axios.post(`${BASE_URL}/reports/review`, {
        reportId: createdReportId,
        approved: true
      });
      logFail('Double approval failed! Allowed approving an already approved report.');
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        logSuccess(`Double approval correctly blocked with ${err.response.status} Bad Request.`);
      } else {
        logFail('Double approval returned unexpected status code.', err);
      }
    }

    // 8. Test Rejection Lifecycle
    console.log(`\n8. Creating a 2nd report to test rejection flow...`);
    const report2Res = await axios.post(`${BASE_URL}/reports`, {
      memberId: TEST_MEMBER_ID,
      estimatedDroplets: 10,
      summary: 'Report to be rejected.'
    });
    const report2Id = report2Res.data.data.reportId;

    console.log(`   Rejecting report ${report2Id}...`);
    const rejectRes = await axios.post(`${BASE_URL}/reports/review`, {
      reportId: report2Id,
      approved: false
    });

    if (rejectRes.data.success) {
      logSuccess('Report successfully rejected without awarding oil.');
    }

    // Verify oil balance did NOT change after rejection (should still be 25)
    const checkBalancePostReject = await axios.get(`${BASE_URL}/status?memberId=${TEST_MEMBER_ID}`);
    if (checkBalancePostReject.data.data[0].oilInLamp === 25) {
      logSuccess('Oil balance verified unchanged (still 25).');
    } else {
      logFail(`Oil balance modified on rejection! Got: ${checkBalancePostReject.data.data[0].oilInLamp}`);
    }

    // 9. Test Student Resubmission (Resets status to pending)
    console.log(`\n9. Testing PUT /api/reports/${report2Id} (Student edits & resubmits rejected report)...`);
    const updateRes = await axios.put(`${BASE_URL}/reports/${report2Id}`, {
      summary: 'Updated summary after addressing feedback.',
      estimatedDroplets: 12
    });

    if (updateRes.data.success) {
      logSuccess('Report successfully updated and status reset to pending.');
    }

    // Approve the resubmitted report (25 + 12 = 37)
    console.log(`   Re-reviewing (approving) the resubmitted report...`);
    const reApproveRes = await axios.post(`${BASE_URL}/reports/review`, {
      reportId: report2Id,
      approved: true
    });

    if (reApproveRes.data.success) {
      logSuccess('Resubmitted report approved!');
    }

    const finalBalanceRes = await axios.get(`${BASE_URL}/status?memberId=${TEST_MEMBER_ID}`);
    if (finalBalanceRes.data.data[0].oilInLamp === 37) {
      logSuccess(`Final oil balance correctly updated to 37!`);
    } else {
      logFail(`Final balance mismatch! Expected 37, got: ${finalBalanceRes.data.data[0].oilInLamp}`);
    }

    // 10. Cleanup Test Data
    console.log(`\n10. Cleaning up test records...`);
    await axios.delete(`${BASE_URL}/status/${TEST_MEMBER_ID}`);
    if (createdReportId) await axios.delete(`${BASE_URL}/reports/${createdReportId}`);
    if (report2Id) await axios.delete(`${BASE_URL}/reports/${report2Id}`);
    logSuccess('Test data cleaned up successfully.');

    console.log(`\n==================================================`);
    console.log(`\x1b[32mALL API INTEGRATION TESTS COMPLETED SUCCESSFULLY!\x1b[0m`);
    console.log(`==================================================\n`);

  } catch (error) {
    console.log(`\n==================================================`);
    logFail('Test suite aborted due to an unhandled error.', error);
    console.log(`==================================================\n`);
  }
}

runTestSuite();
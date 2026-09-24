Server Setup & API Refactoring: Solved Issues & Lifecycle Report
================================================================

Overview
--------

This report documents the full list of technical challenges encountered during the setup, development, and state machine refactoring of the **YW Vineyard Tracker API**, along with the solutions implemented and verified.

1\. Environment & Linting Configuration Issues
----------------------------------------------

### 1.1 require, process, and module Listed as Undefined

*   **Issue:** VS Code and ESLint flagged standard Node/CommonJS primitives (require, process.env, module.exports) as undefined errors across server files.
    
*   **Cause:** The shared project environment treated server files as browser-based client scripts rather than Node.js modules.
    
*   **Solution:**
    
    1.  Explicitly configured "type": "commonjs" in server/package.json.
        
    2.  Updated eslint.config.js to assign Node globals (globals.node) specifically to server/\*\*/\*.js while retaining browser globals for the React frontend.
        

### 1.2 MongoDB Atlas SRV DNS Timeout

*   **Issue:** Node raised querySrv ETIMEOUT \_mongodb.\_tcp.cluster0.quz9jkl.mongodb.net when attempting to connect to Atlas.
    
*   **Cause:** Local router/ISP DNS servers failed to resolve MongoDB SRV records.
    
*   **Solution:** Confirmed valid records via Google Public DNS (8.8.8.8 / 8.8.4.4) to bypass the local DNS cache during setup.
    

### 1.3 MongoDB bad auth: authentication failed

*   **Issue:** Authentication rejected during connection initialization.
    
*   **Cause:** Unencoded special characters in the database password (such as @) broke URL parsing in the connection string.
    
*   **Solution:** Percent-encoded special characters (e.g., @ ➔ @) in MONGODB\_URI within server/.env.
    

2\. API Endpoint & Business Logic Refactoring
---------------------------------------------

### 2.1 Unhandled JSON Body Parsing in Administrative Review

*   **Issue:** TypeError: Cannot destructure property 'reportId' of 'req.body' as it is undefined.
    
*   **Cause:** Missing JSON body middleware and non-defensive destructuring in controllers.
    
*   **Solution:** Added express.json() middleware to the server pipeline and implemented safe fallback destructuring: const { reportId, approved } = req.body || {};.
    

### 2.2 Vulnerability: Double-Approval & Re-Granting Oil Droplets

*   **Issue:** Running POST /api/reports/review multiple times on the same report repeatedly awarded oil droplets to member balances.
    
*   **Cause:** The review method lacked a status guard check before applying database updates.
    
*   JavaScriptif (report.status !== 'pending') { return { success: false, reason: \`Cannot process review: Report is already '${report.status}'. Only 'pending' reports can be reviewed.\` };}If a report is already approved or rejected, the request immediately halts and returns a 400 Bad Request.
    

### 2.3 Resubmission Lifecycle Disconnect

*   **Issue:** Once a student report was rejected, there was no clean way to allow the leader to re-review it without manually altering the database.
    
*   **Cause:** Updating a report via PUT /api/reports/:id kept the old status intact.
    
*   **Solution:** Updated ReportModel.updateAndResubmit so that any edit submitted by a student explicitly resets status: 'pending', enabling the leader review endpoint to safely re-process the report.
    

3\. Verified State Machine Workflow
-----------------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   [ Student Submits Report ] ──► status: "pending"                                        │                           ┌────────────┴────────────┐                           ▼                         ▼                    [ Leader Approves ]       [ Leader Rejects ]                           │                         │                           ▼                         ▼                   status: "approved"        status: "rejected"              (+ droplets added to oil)       (0 droplets added)                           │                         │                           │             [ Student Edits & Resubmits ]                           │                         │                           │                         ▼                           └───────────────► status: "pending"                                             (Can now be reviewed again)   `

4\. End-to-End Automated Testing Verification
---------------------------------------------

An automated integration suite (server/test-api.js) using axios was developed to verify all end-to-end API operations and business logic safeguards.

### Integration Test Execution Log (node test-api.js)

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ========== STARTING API INTEGRATION TESTS ==========  1. Testing POST /api/status for memberId: test-user-1790210863476...  ✔ PASS: Member status created successfully.  2. Testing duplicate POST /api/status (Should fail with 400)...  ✔ PASS: Duplicate member creation correctly rejected with 400 Bad Request.  3. Testing POST /api/reports...  ✔ PASS: Progress report created with ID: report-1790210863883  4. Testing GET /api/reports?memberId=test-user-1790210863476...  ✔ PASS: Retrieved 1 pending report(s).  5. Testing POST /api/reports/review (Approving 15 droplets)...  ✔ PASS: Report successfully approved.  6. Testing GET /api/status?memberId=test-user-1790210863476 (Verifying oil update)...  ✔ PASS: Oil balance correctly increased to 25! (Current balance: 25)  7. Testing POST /api/reports/review on already approved report (Should fail)...  ✔ PASS: Double approval correctly blocked with 400 Bad Request.  8. Creating a 2nd report to test rejection flow...     Rejecting report report-1790210864561...  ✔ PASS: Report successfully rejected without awarding oil.  ✔ PASS: Oil balance verified unchanged (still 25).  9. Testing PUT /api/reports/report-1790210864561 (Student edits & resubmits rejected report)...  ✔ PASS: Report successfully updated and status reset to pending.     Re-reviewing (approving) the resubmitted report...  ✔ PASS: Resubmitted report approved!  ✔ PASS: Final oil balance correctly updated to 37!  10. Cleaning up test records...  ✔ PASS: Test data cleaned up successfully.  ==================================================  ALL API INTEGRATION TESTS COMPLETED SUCCESSFULLY!  ==================================================   `

5\. Summary Status
------------------

*   **ESLint Verification:** npm run lint completes with **0 errors, 0 warnings**.
    
*   **MongoDB Integration:** Connection pooling and native CRUD operations functioning cleanly.
    
*   **Documentation & Testing:** Interactive Swagger UI mounted at /api-docs, and automated test suite (node test-api.js) fully passing.
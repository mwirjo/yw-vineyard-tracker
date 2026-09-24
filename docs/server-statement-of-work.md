YW Vineyard Tracker Backend Statement of Work
=============================================

1\. Project Context
-------------------

The YW Vineyard Tracker is a full-stack application (React frontend, Node.js/Express backend, MongoDB database) designed to encourage Young Women to set goals, work on personal development, support one another, and participate in shared activities.

The application uses a game-inspired resource system:

*   active lamp oil (oilInLamp) and an oil reserve (oilReserve)
    
*   red, blue, and gold talent droplets (talentDroplets)
    
*   rare real talents (talents)
    
*   activity passes (activityPasses) and keys
    
*   daily progress reports
    
*   administrative review of submitted reports
    

The frontend provides the user experience. The backend provides the secure, RESTful API layer that stores member state, receives reports, processes administrative decisions, and returns structured data to the frontend.

2\. Purpose
-----------

The purpose of this work is to build a maintainable, full-featured RESTful Node.js backend for the existing YW Vineyard Tracker project while applying and fulfilling the **CSE 341 Week 02 Web Services learning objectives**.

The backend demonstrates:

*   Node.js server development & Express API architecture
    
*   Clean RESTful URI resource hierarchies
    
*   Complete HTTP Method implementation (GET, POST, PUT, DELETE)
    
*   Full MongoDB CRUD operations using native drivers
    
*   Secure MongoDB Atlas integration and environment-variable protection (dotenv)
    
*   Decoupled MVC architecture using configuration singletons, routes, controllers, and database models
    
*   Interactive API Documentation compliant with OpenAPI 3.0 via **Swagger UI** (swagger-ui-express)
    
*   Automated linting and code formatting using **ESLint** and **Prettier**
    
*   Strict state machine lifecycle validation, preventing double approvals and direct re-reviews without student resubmissions
    

3\. Project Goals
-----------------

The completed backend should:

1.  Provide a reliable, documented REST API for the React frontend.
    
2.  Store and manage member game state (member\_status) and daily progress reports (reports) in MongoDB Atlas.
    
3.  Allow full CRUD capabilities across all primary resources (GET, POST, PUT, DELETE).
    
4.  Allow leaders/teachers to review pending reports, awarding estimated oil droplets to member balances upon approval without double-granting rewards.
    
5.  Provide a student resubmission flow where updating a rejected report resets its status to pending for re-evaluation.
    
6.  Keep database credentials out of source control using .env and .gitignore.
    
7.  Maintain automated code quality standards via ESLint and Prettier.
    
8.  Expose an interactive visual documentation interface via Swagger UI (/api-docs).
    

4\. Scope of Work
-----------------

### Included in this backend phase

*   **Project Structure & Dependencies:** Configure Node.js, CommonJS, Express, MongoDB native driver, Cors, Dotenv, Axios, and Swagger UI.
    
*   **Database Architecture:** Implement a singleton connection pattern in server/config/db.js connecting securely to MongoDB Atlas.
    
*   **RESTful Resource Hierarchies & CRUD:**
    
    *   **Member Status (/api/status):**
        
        *   GET /api/status: Fetch member records with memberId query filtering.
            
        *   POST /api/status: Create brand-new member status documents with default resource allocations and duplicate prevention.
            
        *   PUT /api/status/:id: Update existing member resource counts (oilInLamp, oilReserve, activityPasses).
            
        *   DELETE /api/status/:id: Remove member status records by MongoDB ID or memberId.
            
    *   **Reports & Leader Review (/api/reports):**
        
        *   GET /api/reports: Fetch pending, approved, or rejected reports with status and memberId filtering.
            
        *   POST /api/reports: Submit new daily progress reports in pending status with estimated droplet values.
            
        *   PUT /api/reports/:id: Edit summary or estimated droplets on a report, explicitly resetting its status back to pending.
            
        *   POST /api/reports/review: Process leader decisions (approved: true/false). Enforces guard clauses to only allow reviewing pending reports and awards estimated droplets to oilInLamp upon approval.
            
        *   DELETE /api/reports/:id: Remove specific report records by ID or reportId.
            
*   **Interactive Documentation:** Create an OpenAPI 3.0 specification (server/swagger.json) mounted at /api-docs.
    
*   **Automated Integration Testing:** Comprehensive end-to-end API test script (server/test-api.js) verifying status creation, report submission, approval balance updates, double-approval prevention, rejection cycles, and resubmissions.
    

### Not included in this phase

*   User authentication (JWT/OAuth) and role-based access control (RBAC).
    
*   Production deployment to hosting platforms (e.g., Render/Railway).
    
*   Complex group/ward-level aggregated analytics.
    

5\. API Endpoints & Business Logic
----------------------------------

### 5.1 Server Health Check & Documentation

*   GET / — Health check endpoint (YW Vineyard Tracker API is running.).
    
*   GET /api-docs — Interactive OpenAPI / Swagger UI interface.
    

### 5.2 Member Status Endpoints

*   **GET /api/status**: Retrieves member status records. Accepts optional ?memberId= query parameters.
    
*   **POST /api/status**: Inserts a new member record into member\_status. Rejects duplicate memberId submissions with 400 Bad Request.
    
*   **PUT /api/status/:id**: Updates specific resource fields for a member record matching id or memberId.
    
*   **DELETE /api/status/:id**: Deletes a member record from MongoDB matching id or memberId.
    

### 5.3 Daily Report & Admin Review Endpoints

*   **GET /api/reports**: Retrieves report documents from reports. Supports ?status= and ?memberId= filtering.
    
*   **POST /api/reports**: Submits a new member progress report in pending status.
    
*   **PUT /api/reports/:id**: Student edits and resubmits a report (updates summary and/or estimated droplets). Automatically resets status to 'pending'.
    
*   **POST /api/reports/review**: Evaluates a report (reportId, approved).
    
    *   **Guard Clause Validation:** Only reports with status: 'pending' can be reviewed. Attempts to re-review approved or rejected reports directly are rejected with 400 Bad Request.
        
    *   **Approval Logic:** Updates report status to approved and safely increments the student's oilInLamp balance by estimatedDroplets.
        
    *   **Rejection Logic:** Updates report status to rejected without altering member oil balances.
        
*   **DELETE /api/reports/:id**: Removes a report document from MongoDB by id or reportId.
    

6\. Report State Machine Workflow
---------------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   [ Student Submits Report ] ──► status: "pending"                                        │                           ┌────────────┴────────────┐                           ▼                         ▼                    [ Leader Approves ]       [ Leader Rejects ]                           │                         │                           ▼                         ▼                   status: "approved"        status: "rejected"              (+ droplets added to oil)       (0 droplets added)                           │                         │                           │             [ Student Edits & Resubmits ]                           │                         │                           │                         ▼                           └───────────────► status: "pending"                                             (Can now be reviewed again)   `

7\. Technical Architecture
--------------------------

The backend follows a modular, layered MVC architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   server/  ├── config/  │   └── db.js                 # MongoDB connection singleton  ├── controllers/  │   ├── statusController.js   # Member status GET, POST, PUT, DELETE logic  │   └── reportController.js   # Report GET, POST, PUT, REVIEW, DELETE logic  ├── models/  │   ├── statusModel.js       # Database abstraction for member status collection  │   └── reportModel.js       # Database abstraction & review business logic  ├── routes/  │   ├── statusRoutes.js      # Express RESTful route definitions for status  │   └── reportRoutes.js      # Express RESTful route definitions for reports  ├── test-api.js               # Automated Axios integration test suite  ├── swagger.json              # OpenAPI 3.0 specification  ├── .env                      # Database secrets (excluded from Git)  ├── package.json              # Backend dependencies & npm scripts  └── index.js                  # Express entry point & Swagger mounting   `

8\. Security & Code Quality Standards
-------------------------------------

*   MongoDB Atlas credentials remain stored exclusively in server/.env and are strictly excluded from source control via .gitignore.
    
*   Password special characters are URL-encoded within connection strings.
    
*   Code style and execution standards are verified using ESLint (npx eslint .) and Prettier (npm run format), guaranteeing zero unhandled global errors or syntax warnings.
    
*   Full state safety prevents double-awarding droplets or illegal status transition exploits.
    

9\. Learning Activity Alignment (CSE 341 Week 02)
-------------------------------------------------

This implementation directly fulfills all core learning objectives:

*   **RESTful URI Hierarchies:** Designed standardized plural resource paths (/api/status, /api/reports).
    
*   **Complete HTTP Verbs:** Implemented GET, POST, PUT, and DELETE requests across API endpoints.
    
*   **MongoDB CRUD Operations:** Executed native driver methods (findOne, find, insertOne, updateOne, deleteOne) in Node.js.
    
*   **API Documentation (Swagger):** Standardized API routes, query params, headers, and request body schemas using OpenAPI 3.0 and swagger-ui-express.
    
*   **Code Standardization & Verification:** Enforced consistent style and syntax rules via ESLint, Prettier, and automated integration testing via test-api.js.
    

10\. Deliverables
-----------------

*   Complete, running server/ Node.js/Express application.
    
*   Native MongoDB Atlas singleton module (server/config/db.js).
    
*   Complete RESTful models, controllers, and routes supporting full CRUD workflows.
    
*   OpenAPI specification (server/swagger.json) and live Swagger UI endpoint (/api-docs).
    
*   Automated integration test suite (server/test-api.js).
    
*   Configured ESLint setup and package scripts (npm run lint, npm run lint:fix).
    
*   Updated documentation files (server-setup.md, demonstrated-skills.md, server-statement-of-work.md).
    

11\. Acceptance Criteria
------------------------

The backend work is accepted when:

1.  Server starts without errors via Express.
    
2.  MongoDB Atlas establishes a successful connection pool.
    
3.  Health check (GET /) returns a 200 status message.
    
4.  Member status endpoints successfully execute GET, POST, PUT, and DELETE operations.
    
5.  Report endpoints successfully execute GET, POST, PUT, POST /review, and DELETE operations.
    
6.  Guard clauses block re-reviewing already approved or rejected reports directly with 400 Bad Request.
    
7.  Student updates via PUT /api/reports/:id reset report status to pending.
    
8.  Automated API integration test (node test-api.js) completes all 10 step assertions successfully.
    
9.  Terminal command npm run lint executes with **0 errors**.
    

12\. Proof of Completed Work
----------------------------

### Server & Database Initialization

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MongoDB Connected Successfully  Server active on http://localhost:5000  Swagger Docs available at http://localhost:5000/api-docs   `

### Integration Test Suite Output (node test-api.js)

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ========== STARTING API INTEGRATION TESTS ==========  1. Testing POST /api/status for memberId: test-user-1790210863476...  ✔ PASS: Member status created successfully.  2. Testing duplicate POST /api/status (Should fail with 400)...  ✔ PASS: Duplicate member creation correctly rejected with 400 Bad Request.  3. Testing POST /api/reports...  ✔ PASS: Progress report created with ID: report-1790210863883  4. Testing GET /api/reports?memberId=test-user-1790210863476...  ✔ PASS: Retrieved 1 pending report(s).  5. Testing POST /api/reports/review (Approving 15 droplets)...  ✔ PASS: Report successfully approved.  6. Testing GET /api/status?memberId=test-user-1790210863476 (Verifying oil update)...  ✔ PASS: Oil balance correctly increased to 25! (Current balance: 25)  7. Testing POST /api/reports/review on already approved report (Should fail)...  ✔ PASS: Double approval correctly blocked with 400 Bad Request.  8. Creating a 2nd report to test rejection flow...     Rejecting report report-1790210864561...  ✔ PASS: Report successfully rejected without awarding oil.  ✔ PASS: Oil balance verified unchanged (still 25).  9. Testing PUT /api/reports/report-1790210864561 (Student edits & resubmits rejected report)...  ✔ PASS: Report successfully updated and status reset to pending.     Re-reviewing (approving) the resubmitted report...  ✔ PASS: Resubmitted report approved!  ✔ PASS: Final oil balance correctly updated to 37!  10. Cleaning up test records...  ✔ PASS: Test data cleaned up successfully.  ==================================================  ALL API INTEGRATION TESTS COMPLETED SUCCESSFULLY!  ==================================================   `

### Code Verification Output

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PS G:\Projects\yw-vineyard-tracker\server> npm run lint  > server@1.0.0 lint  > eslint .  (0 errors, 0 warnings)   `

13\. Conclusion
---------------

This Statement of Work reflects the complete backend design and implementation for the YW Vineyard Tracker API, fulfilling all CSE 341 Week 02 RESTful web service, MongoDB CRUD, code formatting, state machine validation, and Swagger documentation requirements.
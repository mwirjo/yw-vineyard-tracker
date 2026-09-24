YW Vineyard Tracker Server Setup Guide
======================================

This guide documents how the Node.js backend was created inside the existing YW Vineyard Tracker project. It includes software requirements, MongoDB Atlas configuration, server setup commands, final architecture, API endpoints, integration testing, and verification procedures.

1\. Software and Accounts Needed Before Starting
------------------------------------------------

Install or create these items before building the backend:

### Required software

*   **Node.js**, downloaded from [nodejs.org](https://nodejs.org/?utm_source=gemini). Node.js runs the backend and includes npm.
    
*   **Visual Studio Code** for editing and running the project.
    
*   **Git** for version control.
    
*   **Thunder Client** or **Postman**, used for direct REST endpoint testing.
    
*   **A web browser** for basic health checks and interactive **Swagger UI** testing.
    

The REST client recommended for VS Code is **Thunder Client by Thunder Client**.

*   VS Code extension ID: rangav.vscode-thunder-client
    
*   Publisher namespace: rangav
    
*   Install it from the VS Code Extensions panel by searching for **Thunder Client**.
    
*   Open it from the lightning icon in the Activity Bar, then choose **New Request**.
    

Verify the installed CLI tools:

PowerShell

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   node -v  npm -v  git --version   `

2\. Connect to MongoDB Atlas Online
-----------------------------------

Complete this setup in the MongoDB Atlas dashboard before starting the server:

1.  Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?utm_source=gemini).
    
2.  Create or open the project containing your database cluster.
    
3.  Open the cluster (e.g., Cluster0) and click **Connect**.
    
4.  Under network security, add your current IP address under **Network Access** (or 0.0.0.0/0 for development).
    
5.  Under **Database Access**, create a database user with a username and password.
    
6.  Choose **Connect your application** or **Drivers** as the connection method.
    
7.  Select the **Node.js** driver.
    
8.  Copy the SRV connection string provided by Atlas.
    
9.  Replace with your URL-encoded database password.
    

Example Connection String Format:

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   mongodb+srv://USERNAME:ENCODED_PASSWORD@cluster0.example.mongodb.net/yw-vineyard-tracker?appName=Cluster0   `

> **Security Note:** Keep the connection string private. It contains secret credentials and must never be committed to Git or pushed publicly.

3\. Open the Project Folder
---------------------------

The backend is kept in a dedicated server directory within the existing workspace:

PowerShell

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd "G:\Projects\yw-vineyard-tracker\server"   `

4\. Install Backend Dependencies
--------------------------------

Run this command inside the server directory:

PowerShell

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install express mongodb dotenv cors swagger-ui-express axios  npm install --save-dev eslint globals   `

### Dependency Breakdown

*   **express:** Core web application framework for routes and middleware.
    
*   **mongodb:** Official native Node.js driver for MongoDB operations.
    
*   **dotenv:** Loads environment variables from .env files.
    
*   **cors:** Configures Cross-Origin Resource Sharing for frontend communication.
    
*   **swagger-ui-express:** Serves interactive OpenAPI documentation at /api-docs.
    
*   **axios:** HTTP client used by test-api.js for end-to-end integration testing.
    
*   **eslint & globals:** Enforces JavaScript style consistency and global environment definitions.
    

5\. Configure package.json
--------------------------

Ensure your server/package.json includes CommonJS execution mode, startup scripts, and linting scripts:

JSON

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "name": "server",    "version": "1.0.0",    "main": "index.js",    "type": "commonjs",    "scripts": {      "start": "node index.js",      "dev": "node --watch index.js",      "test": "node test-api.js",      "lint": "eslint .",      "lint:fix": "eslint . --fix"    },    "dependencies": {      "axios": "^1.7.0",      "cors": "^2.8.5",      "dotenv": "^16.4.5",      "express": "^4.19.0",      "mongodb": "^6.8.0",      "swagger-ui-express": "^5.0.1"    },    "devDependencies": {      "eslint": "^9.0.0",      "globals": "^15.0.0"    }  }   `

6\. Create the Environment File
-------------------------------

Create server/.env:

Codefragment

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PORT=5000  MONGODB_URI=mongodb+srv://USERNAME:ENCODED_PASSWORD@cluster0.example.mongodb.net/yw-vineyard-tracker?appName=Cluster0   `

> Ensure .env and server/.env are added to your root .gitignore file.

7\. Server Architecture
-----------------------

The backend follows a clean MVC structure:

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   server/  ├── config/  │   └── db.js                 # MongoDB connection singleton  ├── controllers/  │   ├── statusController.js   # HTTP handlers for member status  │   └── reportController.js   # HTTP handlers for daily progress reports  ├── models/  │   ├── statusModel.js       # Database queries for member_status collection  │   └── reportModel.js       # Database queries & review state logic for reports  ├── routes/  │   ├── statusRoutes.js      # Route definitions for /api/status  │   └── reportRoutes.js      # Route definitions for /api/reports  ├── test-api.js               # Integration test script (Axios)  ├── swagger.json              # OpenAPI 3.0 API documentation spec  ├── .env                      # Database credentials (Git-ignored)  ├── package.json              # Scripts & dependencies  └── index.js                  # Main Express entry point & middleware mounting   `

8\. Start the Backend
---------------------

Run the server in development mode with live watch reloading:

PowerShell

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run dev   `

### Expected Terminal Output

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MongoDB Connected Successfully  Server active on http://localhost:5000  Swagger Docs available at http://localhost:5000/api-docs   `

9\. Run Integration Tests
-------------------------

In a separate terminal window while the server is running, execute the integration test suite:

PowerShell

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   node test-api.js   `

This automated script tests the full backend API workflow:

1.  Member status creation & duplicate submission prevention (400 Bad Request).
    
2.  Submitting progress reports (pending status).
    
3.  Leader approval & verifying exact oil balance additions.
    
4.  Blocking double-approval attempts on already reviewed reports (400 Bad Request).
    
5.  Leader rejection flow (verifying no oil reward is granted).
    
6.  Student edit & resubmission (PUT /api/reports/:id), verifying status resets to pending.
    
7.  Final approval re-review and clean test data removal.
    

10\. API Route Reference & Swagger Documentation
------------------------------------------------

Access the interactive visual testing documentation in your browser at:

http://localhost:5000/api-docs

**VerbPathDescriptionGET**/Health check endpoint**GET**/api-docsInteractive Swagger UI API documentation**GET**/api/statusList member status records (supports ?memberId=)**POST**/api/statusCreate new member status document**PUT**/api/status/:idUpdate member resource balances**DELETE**/api/status/:idDelete member status record by ID**GET**/api/reportsRetrieve reports (supports ?status= and ?memberId=)**POST**/api/reportsSubmit daily progress report (pending)**PUT**/api/reports/:idEdit and resubmit report (resets status to pending)**POST**/api/reports/reviewLeader review (pending only; approves/rejects report)**DELETE**/api/reports/:idDelete report record by ID

11\. Code Quality & Linting
---------------------------

Run ESLint to verify syntax and formatting compliance across all backend files:

PowerShell

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run lint   `

_(Run npm run lint:fix to automatically correct fixable formatting rules)._
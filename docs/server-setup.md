# YW Vineyard Tracker Server Setup Guide

This guide documents how the Node.js backend was created inside the existing YW Vineyard Tracker project. It includes the software required before starting, how to connect to a MongoDB Atlas cluster online, the commands used to build the server, and how to verify that it works.

## 1. Software and Accounts Needed Before Starting

Install or create these items before building the backend:

### Required software

- **Node.js**, downloaded from [nodejs.org](https://nodejs.org/). Node.js runs the backend and includes npm.
- **Visual Studio Code** for editing and running the project.
- **Git** for version control.
- **Thunder Client**, the REST client used for this project.
- **A web browser** for basic health-check requests.

The REST client used in this project is **Thunder Client by Thunder Client**.

- VS Code extension ID: `rangav.vscode-thunder-client`
- Publisher namespace: `rangav`
- Install it from the VS Code Extensions panel by searching for `Thunder Client`.
- Open it from the lightning icon in the Activity Bar, then choose **New Request**.

Thunder Client was used to test the health route, status route, query parameter, and custom HTTP header.

Verify the installed tools:

```powershell
node -v
npm -v
```

```powershell
git --version
```

### Required online accounts and services

## 2. Connect to MongoDB Atlas Online

Complete this setup in the MongoDB Atlas website before starting the Node server:

1.  Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create or open the project containing the cluster.
3.  Open the cluster, such as `Cluster0`, and click **Connect**.
4.  Under connection security, add your current IP address under **Network Access**.
5.  Under **Database Access**, create a database user with a username and password.
6.  Choose **Connect your application** or **Drivers** as the connection method.
7.  Select the **Node.js** driver and the current driver version.
8.  Copy the SRV connection string Atlas provides. It will look similar to:

    ```text
    mongodb+srv://USERNAME:<db_password>@cluster0.example.mongodb.net/?appName=Cluster0
    ```

9.  Replace `<db_password>` with the password for the MongoDB database user, or use the URL-encoded connection string copied from Atlas.
10. Add the project database name before the question mark, for example:

        ```text
        mongodb+srv://USERNAME:ENCODED_PASSWORD@cluster0.example.mongodb.net/yw-vineyard-tracker?appName=Cluster0
        ```

11. Keep the connection string private. It contains credentials and must never be posted publicly or committed to GitHub.

If the password contains special characters, they must be URL-encoded. For example, `@` becomes `%40`. Atlas may encode the password automatically when you use its **Copy** button. Do not encode an already encoded value a second time.

## 3. Open the Existing Project

The backend was added to the existing React project instead of creating a separate repository.

```powershell
cd "G:\Projects\yw-vineyard-tracker"
```

The frontend stays in the project root, and the backend is kept in a separate `server` folder.

## 4. Create and Initialize the Server Folder

If the server folder does not exist yet:

```powershell
mkdir server
cd server
npm init -y
```

If the folder and `server/package.json` already exist, enter the folder instead:

```powershell
cd "G:\Projects\yw-vineyard-tracker\server"
```

## 5. Install the Backend Packages

Run this command inside the `server` folder:

```powershell
npm install express mongodb dotenv cors
```

The packages have these purposes:

The most important course-specific installation is:

```powershell
npm install mongodb
```

The combined command installs it together with the other required backend packages.

## 6. Configure the Server Package

The backend uses Node/CommonJS syntax such as `require()` and `module.exports`. The `server/package.json` was configured with:

```json
{
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

Use `npm start` for a normal run or `npm run dev` to restart automatically after code changes.

## 7. Create the Environment File Securely

Create this file:

```text
server/.env
```

Add your private values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/yw-vineyard-tracker?appName=Cluster0
```

The `.env` file must be in `server`, next to `server.js` and `package.json`, not inside `server/config`.

The root `.gitignore` includes:

```text
.env
server/.env
```

This prevents database credentials from being uploaded to GitHub.

## 8. Create the Backend Files

Create the following folders and files:

```text
server/
├── config/
│   └── db.js
├── controllers/
│   └── trackerController.js
├── routes/
│   └── trackerRoutes.js
├── .env
├── package.json
└── server.js
```

### Database connection: `server/config/db.js`

This file loads `MONGODB_URI`, creates the MongoDB client, connects to Atlas, stores the database instance, and exports `connectDB` and `getDB`.

### Controller: `server/controllers/trackerController.js`

This file contains the `getMemberStatus` business logic. It reads the optional `memberId` query parameter and `x-client-version` header, queries the `member_status` collection, and returns JSON.

### Routes: `server/routes/trackerRoutes.js`

This file defines the `GET /status` route and connects it to the controller.

### Main server: `server/server.js`

This file creates the Express application, enables CORS and JSON parsing, mounts `/api` routes, defines the health check, connects to MongoDB, and starts listening on port 5000.

## 9. Configure ESLint for Node

The frontend is a browser/Vite application, but the backend is a Node application. `eslint.config.js` was updated so `server/**/*.js` uses Node globals.

This fixed false warnings such as:

## 10. Start the Backend

Use a terminal in the server folder:

```powershell
cd "G:\Projects\yw-vineyard-tracker\server"
node server.js
```

Or use the development script:

```powershell
npm run dev
```

Expected output:

```text
MongoDB Connected Successfully
Server active on http://localhost:5000
```

The frontend can run at the same time in a second terminal from the project root:

```powershell
cd "G:\Projects\yw-vineyard-tracker"
npm run dev
```

## 11. Test the Backend

Open the health check in a browser or REST client:

```text
GET http://localhost:5000/
```

Expected response:

```text
YW Vineyard Tracker API is running.
```

Test the status endpoint:

```text
GET http://localhost:5000/api/status
GET http://localhost:5000/api/status?memberId=123
```

To test headers, add:

```text
x-client-version: 1.0.0
```

## 12. Errors Encountered and Fixes

### Node globals were undefined

The editor treated the server as browser code. We configured the server as CommonJS and assigned Node globals to the server files in ESLint.

### `.env` was in the wrong folder

The environment file was moved from `server/config/.env` to `server/.env` so dotenv could load it when the server starts from the server folder.

### MongoDB SRV DNS timeout

The error `querySrv ETIMEOUT` occurred while resolving the Atlas cluster. We tested public DNS, temporarily used Google DNS (`8.8.8.8` and `8.8.4.4`), flushed the DNS cache, and later confirmed Automatic DNS worked again.

### MongoDB authentication failed

Atlas returned `bad auth: authentication failed`. We corrected the database user credentials and URL-encoded password characters such as `@` to `%40`.

### `server.js` could not be found

The command was run from the project root, but `server.js` is inside `server`. We fixed it by changing into the server folder before running Node.

## 13. Verification

Run the backend lint check from the project root:

```powershell
cd "G:\Projects\yw-vineyard-tracker"
npx eslint server/**/*.js
```

No output means the server files passed ESLint.

The backend and database were successfully verified with:

```text
MongoDB Connected Successfully
Server active on http://localhost:5000
```

## 14. Rebuild Checklist for a Future Student

1. Install Node.js and verify `node -v` and `npm -v`.
2. Install VS Code, Git, and a REST client.
3. Create a MongoDB Atlas account and cluster.
4. Add an IP address and database user in Atlas.
5. Copy the Node.js driver connection string.
6. Open the existing project root.
7. Create and enter the `server` folder.
8. Run `npm init -y` if needed.
9. Run `npm install express mongodb dotenv cors`.
10. Configure `server/package.json` as CommonJS.
11. Create `server/.env` and add `PORT` and `MONGODB_URI`.
12. Add `.env` and `server/.env` to `.gitignore`.
13. Create the config, controller, route, and server files.
14. Configure ESLint for Node globals.
15. Start the backend with `node server.js` or `npm run dev`.
16. Confirm the MongoDB and server success messages.
17. Test the health check, status endpoint, query parameter, and header.

## 15. Admin Review Endpoint

The first admin workflow endpoint was added:

```text
POST http://localhost:5000/api/reports/review
```

It is implemented in `server/controllers/reviewController.js` and connected through `server/routes/trackerRoutes.js`.

Send this JSON body from Thunder Client:

```json
{
  "reportId": "report-123",
  "approved": true
}
```

The controller finds a pending report in the `reports` collection and changes its status to `approved` or `rejected`. A missing sample report returns:

```json
{
  "success": false,
  "error": "Pending report not found."
}
```

This response was verified successfully. It proves the request body was parsed, the route reached the controller, and MongoDB was queried.

The controller also safely handles a missing body with `req.body || {}` and returns a clear validation message instead of crashing.

The endpoint was then tested with a pending MongoDB document:

```json
{
  "reportId": "report-123",
  "memberId": "123",
  "status": "pending",
  "reward": 10
}
```

The approval request returned:

```json
{
  "success": true,
  "reportId": "report-123",
  "status": "approved"
}
```

This confirms that the backend found the pending report and updated its status in MongoDB.

## Conclusion

The backend is a reproducible Node.js, Express, and MongoDB Atlas service inside the YW Vineyard Tracker project. This setup satisfies the CSE 341 objectives for secure database integration, API architecture, GET requests, query parameters, headers, REST client testing, and Node.js debugging.

## Deployment Note

The W01 learning activity is completed through local Node.js development, MongoDB Atlas connection, and REST client testing. Publishing the API to Render is not required for this activity. Render is an optional future deployment step used when the backend needs a public URL or when the course deployment instructions specifically require it.

## Completed Objectives

### 1. Secure API and Database Integration

We set up the backend so it can connect securely to MongoDB using environment variables instead of hardcoded sensitive values.

Completed work:

This supports the objective:

### 2. Node.js and Express Architecture

### 3. API Testing and Request Handling

The API is set up to receive and respond to real HTTP requests, including dynamic query parameters and headers.

### 4. Local Debugging and Tooling Setup

We corrected the server environment to be recognized as a Node project instead of browser JavaScript.

## Final Server Structure

The project now contains the following backend structure:
├── public/
├── server/
│ ├── config/
│ ├── routes/
│ │ └── trackerRoutes.js
│ ├── .env
│ ├── package.json
│ └── server.js
├── .gitignore
├── package.json
├── eslint.config.js
├── vite.config.js
└── README.md

````

## Key Implementation Notes

- The server is intentionally separated from the frontend so the React app and API can evolve independently.
- The backend uses CommonJS because the server code is running in a Node.js environment.
- The root project remains a frontend React app, while the backend is isolated in `server/`.

## Verification

We validated the server with:

```bash
cd "g:\Projects\yw-vineyard-tracker"; npx eslint server/**/*.js
````

This completed successfully with no output, confirming the server files are recognized and lint correctly as Node code.

MongoDB Connected Successfully
Server active on http://localhost:5000

````

The server was started from the backend folder with:

```powershell
cd "G:\Projects\yw-vineyard-tracker\server"
node server.js
````

The local DNS setting was returned to Automatic after confirming that the connection worked.

## Conclusion

The backend foundation for the YW Vineyard Tracker project is now in place and aligned with the learning activity objectives. The project has secure database connection support, modular API architecture, request handling, and a clean development setup ready for the next backend features.

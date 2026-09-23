# Server Setup Errors and Solutions

## Overview

This document records the problems that occurred while setting up the backend for the YW Vineyard Tracker project and how each issue was resolved.

## Problems Encountered

### 1. `require is not defined`

This error appeared in the backend files, including:

- `server/server.js`
- `server/config/db.js`
- `server/controllers/trackerController.js`
- `server/routes/trackerRoutes.js`

#### Why it happened

The server files were using Node/CommonJS syntax:

```js
const express = require("express");
const { getDB } = require("../config/db");
module.exports = router;
```

But the workspace was being treated as a browser-based JavaScript project. In browser JavaScript, `require` is not available unless using a bundler or module system.

#### Solution

We configured the server as a Node/CommonJS project and set the proper package settings in `server/package.json`.

```json
{
  "type": "commonjs"
}
```

This makes Node recognize the files as CommonJS, which allows `require` and `module.exports` to work properly.

---

### 2. `process is not defined`

This appeared in the same backend files whenever code used `process.env`.

#### Why it happened

The environment variables in the server rely on Node's `process` global.

Example:

```js
const PORT = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGODB_URI);
```

When VS Code interpreted the files as browser JavaScript, it flagged `process` as undefined.

#### Solution

We made sure the backend files were evaluated as Node.js files and updated the ESLint environment to include Node globals.

In `eslint.config.js`, the server folder was assigned Node globals instead of browser globals.

---

### 3. `module is not defined`

This happened when files used `module.exports` to export functions and routes.

#### Why it happened

Again, the files were being treated as browser scripts rather than Node modules.

Example:

```js
module.exports = { connectDB, getDB };
module.exports = router;
module.exports = { getMemberStatus };
```

In browser JavaScript, `module` does not exist by default.

#### Solution

The fix was the same as above: the backend folder was set up as a Node/CommonJS app, and ESLint was changed to provide Node globals for the server project.

---

## Root Cause Summary

The real issue was not the server logic itself. The server files were valid Node code, but the editor and linting setup were not configured to recognize the backend as a Node project.

The root cause was a configuration mismatch:

- the frontend is a Vite React app
- the backend is a Node.js server inside a `server/` folder
- the shared JavaScript environment was treating everything like browser code

## Fixes Applied

### 1. Server package configuration

Updated `server/package.json`:

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

### 2. Installed backend dependencies

Installed:

- express
- cors
- dotenv
- mongodb

### 3. ESLint environment fix

Updated `eslint.config.js` to give `server/**/*.js` Node globals while leaving frontend files with browser globals.

This prevented the editor from incorrectly treating Express, dotenv, MongoDB, and `process.env` as browser-only APIs.

### 4. MongoDB SRV DNS timeout

The backend initially reported:

```text
querySrv ETIMEOUT _mongodb._tcp.cluster0.quz9jkl.mongodb.net
```

#### Why it happened

The computer's automatic DNS server did not respond when Node tried to resolve the MongoDB Atlas SRV record.

#### Solution

We tested the same record with Google's public DNS resolver and confirmed that the Atlas record was valid. Google DNS (`8.8.8.8` and `8.8.4.4`) was used temporarily to troubleshoot the issue. Automatic DNS was later restored after the connection worked.

### 5. MongoDB authentication failure

After DNS resolution worked, Atlas reported:

```text
bad auth: authentication failed
```

#### Why it happened

The database username or password in the connection string did not match the MongoDB Atlas database user. A password containing `@` also has to be URL-encoded because `@` separates the password from the cluster hostname.

#### Solution

We verified the Atlas database user and used the connection string copied from Atlas. Special characters are URL-encoded when needed, such as `@` becoming `%40`. The final connection succeeded after correcting the credentials and connection string.

---

## Verification

We verified the fix by running:

```bash
cd "g:\Projects\yw-vineyard-tracker"; npx eslint server/**/*.js
```

The command completed successfully with no errors, confirming the backend files now lint correctly under a Node environment.

The database and server were then verified with:

```text
MongoDB Connected Successfully
Server active on http://localhost:5000
```

## Final Outcome

The server setup is now correctly recognized as a Node/CommonJS project, and the backend can continue to be developed without the false runtime errors that were caused by the initial configuration mismatch.

## Admin Review Endpoint Test

### Missing request body

The first request to the review endpoint produced:

```text
Cannot destructure property 'reportId' of 'req.body' as it is undefined.
```

This happened because the request did not contain a parsed JSON body.

### Fix

The controller now safely reads the body:

```js
const { reportId, approved } = req.body || {};
```

Thunder Client must send the request as JSON with this header:

```text
Content-Type: application/json
```

and this body:

```json
{
  "reportId": "report-123",
  "approved": true
}
```

### Verification

The endpoint returned:

```json
{
  "success": false,
  "error": "Pending report not found."
}
```

This was expected because `report-123` was not yet stored in the `reports` collection. The response confirms that the route, JSON parsing, controller, and database lookup are working.

### Successful approval test

After adding this pending document to the `reports` collection:

```json
{
  "reportId": "report-123",
  "memberId": "123",
  "status": "pending",
  "reward": 10
}
```

The same review request returned:

```json
{
  "success": true,
  "reportId": "report-123",
  "status": "approved"
}
```

This confirms the complete flow: Thunder Client sent JSON, Express routed the request, the controller found the pending MongoDB document, and the document status changed to `approved`.

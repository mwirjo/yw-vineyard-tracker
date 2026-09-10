# YW Vineyard Tracker Backend Statement of Work

## 1. Project Context

The YW Vineyard Tracker is a React application designed to encourage Young Women to set goals, work on personal development, support one another, and participate in shared activities.

The application uses a game-inspired resource system based on the project Statement of Work:

- active lamp oil and an oil reserve
- red, blue, and gold talent droplets
- rare real talents
- activity passes and keys
- daily progress reports
- administrative review of submitted reports

The frontend provides the user experience. The backend provides the secure data and API layer that stores member state, receives reports, processes administrative decisions, and returns information to the frontend.

## 2. Purpose

The purpose of this work is to build a maintainable Node.js backend for the existing YW Vineyard Tracker project while applying the CSE 341 Web Services learning objectives.

The backend demonstrates:

- Node.js server development
- Express API architecture
- secure MongoDB Atlas integration
- environment-variable security
- routes and controllers
- GET and POST requests
- query parameters and HTTP headers
- JSON request and response bodies
- REST client testing
- backend validation and error responses

## 3. Project Goals

The completed backend should:

1. Provide a reliable API for the React frontend.
2. Store member game state in MongoDB Atlas.
3. Store and process daily progress reports.
4. Allow administrators to approve or reject reports.
5. Apply project reward and penalty rules consistently.
6. Keep database credentials out of the source code and GitHub.
7. Use a clear architecture that future students can understand and extend.
8. Provide a foundation for future reporting, admin, and group-activity features.

## 4. Scope of Work

### Included in this backend phase

- Create the `server` package inside the existing React project.
- Configure Node.js and CommonJS for the backend.
- Install Express, MongoDB, dotenv, and cors.
- Connect securely to MongoDB Atlas.
- Store the connection string in `server/.env`.
- Protect environment files with `.gitignore`.
- Organize the backend into config, controllers, and routes.
- Create the Express server entry point.
- Create a member-status GET endpoint.
- Support query parameters and custom headers.
- Create an admin report-review POST endpoint.
- Validate report-review request bodies.
- Update report status after an administrative decision.
- Apply approval rewards to member resources.
- Apply rejection penalties to lamp oil.
- Test the backend with Thunder Client.
- Verify the backend through linting and real MongoDB requests.

### Not included in this phase

- Complete frontend-to-backend state synchronization
- Authentication and authorization for administrators
- Production deployment to Render
- Full database schema validation
- All future group, Sunday reporting, and Young Men features
- Final production security hardening

These items can be included in later phases.

## 5. Backend Functions

### 5.1 Server health check

The backend provides a route to confirm that the Express server is running:

```text
GET /
```

Expected response:

```text
YW Vineyard Tracker API is running.
```

### 5.2 Member status retrieval

The backend provides:

```text
GET /api/status
```

It:

- retrieves member-status documents from MongoDB
- optionally filters by `memberId`
- reads the `x-client-version` header
- returns a JSON response
- returns an error response when the database request fails

Example:

```text
GET /api/status?memberId=123
```

### 5.3 Daily report review

The backend provides:

```text
POST /api/reports/review
```

The request body contains:

```json
{
  "reportId": "report-123",
  "approved": true
}
```

The endpoint:

1. Validates `reportId` and `approved`.
2. Finds the report only when its status is `pending`.
3. Finds the related member using `memberId`.
4. If approved, generates an outcome using the project reward rules.
5. If rejected, subtracts the claimed droplets from `oilInLamp`.
6. Updates the report status.
7. Stores the approval reward on the report when applicable.
8. Returns the result as JSON.

### 5.4 Approval reward rules

The reward logic follows the main project SOW and existing frontend game logic:

- 70% chance of an oil bonus added to `oilReserve`
- 30% chance of a talent-family reward
- talent-family rewards may be talent droplets or real talents
- rarity levels are common, uncommon, and rare
- a gold real talent also increases `activityPasses`

Member resource fields are:

```json
{
  "oilInLamp": 10,
  "oilReserve": 50,
  "activityPasses": 0,
  "talentDroplets": {
    "red": 0,
    "blue": 0,
    "gold": 0
  },
  "talents": {
    "red": 0,
    "blue": 0,
    "gold": 0
  }
}
```

### 5.5 Rejection rules

When a report is rejected, the claimed amount is removed from `oilInLamp`. The value cannot fall below zero.

The report is marked:

```text
rejected
```

## 6. Technical Architecture

The backend uses a layered structure:

```text
server/
├── config/
│   └── db.js
├── controllers/
│   ├── trackerController.js
│   └── reviewController.js
├── routes/
│   └── trackerRoutes.js
├── .env
├── package.json
└── server.js
```

### Configuration layer

`server/config/db.js` owns the MongoDB connection and exports reusable database functions.

### Controller layer

Controllers contain request handling and business logic. They do not define URL paths.

### Route layer

Routes define the HTTP methods and paths, then forward requests to controllers.

### Server layer

`server/server.js` configures middleware, mounts routes, connects to MongoDB, and starts the HTTP server.

## 7. Security Requirements

- MongoDB credentials must be stored in `server/.env`.
- `.env` files must be listed in `.gitignore`.
- Credentials must never be committed to GitHub.
- The MongoDB database user must be separate from the Atlas website login.
- Password special characters must be URL-encoded in the connection string.
- The backend must use environment variables rather than hardcoded secrets.

## 8. Learning Activity Alignment

This work completes the following CSE 341 objectives:

- build a Node.js web service
- connect Node.js securely to MongoDB
- move database connection logic into a separate file
- organize an API with routes and controllers
- create GET and POST requests
- use query parameters
- use HTTP headers
- process JSON request bodies
- test requests with a REST client
- debug and verify a Node.js application

## 9. Deliverables

The backend phase delivers:

- a working `server` package
- a configured Express application
- a secure MongoDB Atlas connection
- a member-status endpoint
- an admin report-review endpoint
- controllers for status and review logic
- route definitions for the API
- protected environment configuration
- REST client test evidence
- setup and troubleshooting documentation

## 10. Acceptance Criteria

The backend work is accepted when:

- Node.js starts the backend without configuration errors
- MongoDB Atlas connects successfully
- the health-check route returns a response
- `/api/status` returns JSON
- `memberId` filters member-status results
- `x-client-version` is returned in the response
- the review endpoint validates its JSON body
- pending reports can be approved or rejected
- approved reports update member resources
- rejected reports apply the oil penalty
- API behavior can be verified with Thunder Client
- secrets remain excluded from Git

## 11. Proof of Completed Work

The following work has been completed and verified during development.

### Server and database

```text
MongoDB Connected Successfully
Server active on http://localhost:5000
```

### Member status API

The status endpoint returned successful JSON responses and accepted:

```text
GET /api/status?memberId=123
Header: x-client-version: 1.0.0
```

### Review API

The report-review endpoint successfully returned:

```json
{
  "success": true,
  "reportId": "report-123",
  "status": "approved",
  "reward": {
    "category": "oil",
    "rarity": "common",
    "amount": 20
  }
}
```

MongoDB verification showed that the report status changed to `approved` and the member's oil reserve increased for the test.

The backend lint check also completed with no errors:

```powershell
cd "G:\Projects\yw-vineyard-tracker"
npx eslint server/**/*.js
```

## 12. Future Work

Future backend phases may include:

- authentication and admin authorization
- frontend API integration
- report creation from submitted daily progress
- daily report expiration and cleanup
- Sunday reporting
- peer-to-peer support data
- key and group-activity APIs
- production deployment to Render

## Conclusion

This Statement of Work defines the backend work for the YW Vineyard Tracker from its purpose through its functions, architecture, security requirements, deliverables, acceptance criteria, and proof of completion. Troubleshooting details remain documented separately in `server-errors-solved.md`.

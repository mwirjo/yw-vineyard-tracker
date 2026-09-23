# YW Vineyard Tracker

The YW Vineyard Tracker is a React application with a Node.js, Express, and MongoDB backend. The project supports the CSE 341 Web Services learning objectives while providing the backend foundation for member progress, rewards, reports, and future admin features.

## Project Overview

YW Vineyard Tracker is a gamified personal-development application for Young Women. Users select goals in spiritual, social, intellectual, and physical areas, record daily progress, and earn game resources connected to their participation.

The application is inspired by the project's vineyard, lamp, talent, and sisterhood themes. It includes a member-facing dashboard for progress and inventory, an administrator dashboard for reviewing reports, a Node.js API, and a MongoDB Atlas database.

The project is being developed as a full-stack application:

- **React and Vite** provide the frontend interface.
- **React Context API and hooks** manage shared game state.
- **Node.js and Express** provide the backend API.
- **MongoDB Atlas** stores reports and member resources.
- **Thunder Client** tests the API independently of the frontend.

## Current Project Status

Completed so far:

- React frontend with member and admin dashboard components
- Goal selection and progress scoring
- Daily report submission and reset behavior
- Game resources including lamp oil, oil reserve, talent droplets, talents, and activity passes
- Conditional approval and rejection feedback in the frontend
- Node.js and Express backend inside the existing project
- Secure MongoDB Atlas connection through environment variables
- Member-status GET endpoint
- Admin report-review POST endpoint
- Approval reward and rejection penalty logic
- REST client testing with Thunder Client
- GitHub repository and `main` branch publication
- Backend deployment to Render for public hosting
- Setup, SOW, troubleshooting, and skills documentation

The W01 local learning activity is complete. Render deployment is additional hosting work and is not required to satisfy the local W01 activity.

## Demonstrated Skills Summary

- React functional components, hooks, and Context API state management
- Controlled forms, checkboxes, sliders, and conditional rendering
- Full-stack feature design across frontend, backend, and database layers
- Node.js, Express, REST APIs, and JSON request handling
- MongoDB Atlas queries and updates
- Secure `.env` configuration and `.gitignore` practices
- Query parameters, HTTP headers, and REST client testing
- Debugging DNS, authentication, runtime, and deployment errors
- GitHub source control and Render deployment
- Technical documentation and project planning

## Project Structure

```text
yw-vineyard-tracker/
├── src/                    # React frontend
├── public/                 # Public frontend assets
├── server/                 # Node.js API
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # API business logic
│   ├── routes/             # API route definitions
│   ├── .env                # Local secrets; never commit
│   ├── package.json
│   └── server.js           # Express entry point
├── eslint.config.js
├── package.json
├── docs/                   # Setup, SOW, errors, skills, and installation docs
└── README.md              # Project overview
```

## Requirements

- Node.js
- npm
- MongoDB Atlas account and database user
- VS Code, Postman, Thunder Client, or another REST client

## Frontend Setup

From the project root:

```powershell
npm install
npm run dev
```

The frontend normally runs at `http://localhost:5173`.

## Backend Setup

Install the backend dependencies:

```powershell
cd server
npm install
```

Create `server/.env` with your Atlas connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/yw-vineyard-tracker?appName=Cluster0
```

Use the connection string copied from MongoDB Atlas. If the password contains special characters, Atlas should provide the URL-encoded version. Never commit `.env` or share the password.

Start the backend from the `server` folder:

```powershell
npm run dev
```

The API normally runs at `http://localhost:5000`.

The frontend and backend can run simultaneously in two terminals:

- project root: `npm run dev`
- `server` folder: `npm run dev`

## Current API

### Health check

```text
GET http://localhost:5000/
```

Expected response:

```text
YW Vineyard Tracker API is running.
```

### Member status

```text
GET http://localhost:5000/api/status
GET http://localhost:5000/api/status?memberId=123
```

The endpoint demonstrates query parameters and reads the optional `x-client-version` request header. It returns JSON data from the `member_status` MongoDB collection.

### Admin report review

```text
POST http://localhost:5000/api/reports/review
```

Send a JSON body with:

```json
{
  "reportId": "report-123",
  "approved": true
}
```

The endpoint validates the request, finds a pending report, updates its status, and applies the project reward or rejection rules to the related member.

## CSE 341 Learning Objectives Completed

- Created a Node.js and Express web service.
- Connected the API securely to MongoDB Atlas through environment variables.
- Protected database credentials with `.gitignore`.
- Separated database configuration, routes, and controllers.
- Used HTTP GET requests, query parameters, and headers.
- Tested the API locally with direct HTTP requests or a REST client.
- Diagnosed and fixed Node.js environment, DNS, and authentication issues.
- Built and tested an admin report-review workflow with JSON request bodies.
- Updated MongoDB member resources when a report was approved or rejected.

For the complete learning-activity mapping and proof of work, see the [server Statement of Work](docs/server-statement-of-work.md) and [demonstrated skills](docs/demonstrated-skills.md).

## Errors Encountered and Solutions

### `require`, `process`, and `module` were not defined

The backend uses Node/CommonJS syntax, but the shared project configuration treated all JavaScript files as browser code.

**Fix:** Set `server/package.json` to `"type": "commonjs"` and configure `eslint.config.js` to use Node globals for `server/**/*.js`. The frontend continues to use browser globals.

### `.env` was in the wrong folder

The server could not reliably load configuration when `.env` was placed in `server/config`.

**Fix:** Move it to `server/.env`, next to `server/package.json` and `server.js`.

### MongoDB SRV DNS timeout

The local DNS server timed out while resolving `_mongodb._tcp.cluster0.quz9jkl.mongodb.net`.

**Fix:** Test with a public DNS resolver and, when necessary, use Google DNS (`8.8.8.8` and `8.8.4.4`). Automatic DNS was later confirmed to work again.

### MongoDB authentication failed

Atlas returned `bad auth: authentication failed` when the database credentials were incorrect.

**Fix:** Verify the Atlas database username and reset the database password when necessary. Special characters in passwords must be URL-encoded, for example `@` becomes `%40`. Atlas's copied connection string can perform this encoding.

### Admin review request body or report errors

The review endpoint can return validation errors when `reportId` or `approved` is missing, or a not-found response when the report is not currently `pending`.

**Fix:** Send JSON with `Content-Type: application/json`, include both required fields, and reset the test report to `pending` before testing it again.

## Verification

The backend was successfully verified with:

```text
MongoDB Connected Successfully
Server active on http://localhost:5000
```

The server files also pass the backend lint check:

```powershell
cd "G:\Projects\yw-vineyard-tracker"
npx eslint server/**/*.js
```

The frontend also passes its lint check:

```powershell
npx eslint src
```

## Roadmap

Planned future work includes:

- connect the React frontend directly to the deployed API
- add authentication and administrator authorization
- create reports from frontend submissions in MongoDB
- add daily report expiration and cleanup
- implement Sunday reporting, keys, and group activities
- add automated tests and formal API documentation
- deploy the frontend as a separate static site when needed

## Related Documentation

- [Server setup objectives](docs/server-setup.md)
- [Server statement of work](docs/server-statement-of-work.md)
- [Server errors solved](docs/server-errors-solved.md)
- [Demonstrated skills](docs/demonstrated-skills.md)
- [Frontend installation guide](docs/installation.md)

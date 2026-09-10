# YW Vineyard Tracker

The YW Vineyard Tracker is a React application with a Node.js, Express, and MongoDB backend. The project supports the CSE 341 Web Services learning objectives while providing the backend foundation for member progress, rewards, reports, and future admin features.

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
└── README.md
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

## CSE 341 Learning Objectives Completed

- Created a Node.js and Express web service.
- Connected the API securely to MongoDB Atlas through environment variables.
- Protected database credentials with `.gitignore`.
- Separated database configuration, routes, and controllers.
- Used HTTP GET requests, query parameters, and headers.
- Tested the API locally with direct HTTP requests or a REST client.
- Diagnosed and fixed Node.js environment, DNS, and authentication issues.

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

## Related Documentation

- [Server setup objectives](server-setup.md)
- [Server statement of work](server-statement-of-work.md)
- [Server errors solved](server-errors-solved.md)

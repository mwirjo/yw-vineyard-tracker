# Demonstrated Skills

## Project

YW Vineyard Tracker

This project demonstrates the ability to build, test, document, version, and deploy a Node.js backend connected to MongoDB Atlas and designed to support a React frontend.

## Most Important Skills Demonstrated

- React frontend development with functional components and hooks
- React Context API state management
- Node.js and Express REST API development
- MongoDB Atlas database integration
- Full-stack feature design across frontend, backend, and database layers
- Secure environment-variable configuration
- REST API testing with Thunder Client
- Debugging real runtime, network, database, and deployment problems
- GitHub source control and Render backend deployment

## Frontend Development with React

- Built a React application using functional components.
- Used React `useState` to manage interactive local and shared state.
- Used the React Context API to share game state and actions across components.
- Created a reusable `GameProvider` for centralized application state.
- Created a custom `useGame` hook for consuming shared context.
- Split the interface into focused components, including:
  - `VineyardDashboard`
  - `AdminDashboard`
  - `GameProvider`
- Built controlled checkbox inputs for selecting personal-development goals.
- Built controlled range sliders for entering progress scores.
- Handled form submission with `preventDefault()`.
- Calculated progress totals from multiple selected goals.
- Implemented conditional rendering for pending, approved, rejected, and empty report states.
- Created separate member and administrator views in the same React application.
- Passed data and event functions through shared context rather than duplicating state.
- Implemented user actions for submitting progress, approving reports, rejecting reports, and resetting daily reports.
- Connected UI messages to application state changes.

## Frontend Game Logic and User Experience

- Modeled game resources such as lamp oil, oil reserve, talent droplets, talents, and activity passes.
- Implemented random reward logic with rarity levels and reward categories.
- Implemented rejection penalties that cannot reduce lamp oil below zero.
- Built a progress workflow from goal selection to report submission and administrative review.
- Displayed reward results conditionally based on reward category and rarity.
- Created inventory displays for multiple talent types.
- Added links for users to open saved long-term goal documents.
- Added responsive layout classes using Tailwind CSS.
- Used visual states, color coding, spacing, borders, and animation classes to communicate status.

## React Architecture Understanding

- Distinguished component state from shared application state.
- Used Context API to avoid passing game state through unrelated components.
- Organized React code into components, context, and hooks folders.
- Connected the root `App` component to the shared `GameProvider`.
- Integrated member-facing and admin-facing workflows into one application shell.

## Backend Development

- Built a Node.js backend inside an existing React/Vite project.
- Created an Express server with middleware, routes, and controllers.
- Configured a backend package with CommonJS and npm scripts.
- Created a server health-check endpoint.
- Built GET and POST API endpoints.
- Processed JSON request bodies.
- Returned structured JSON responses and HTTP status codes.
- Used asynchronous JavaScript with `async` and `await`.

## API Architecture

- Organized backend code using a layered structure:
  - configuration
  - routes
  - controllers
- Separated database connection logic from request-handling logic.
- Connected route paths to controller functions.
- Created a member-status API endpoint.
- Created an admin report-review endpoint.
- Designed an API that can be extended with future reporting and administration features.

## MongoDB and Data Management

- Connected a Node.js application to MongoDB Atlas using the official MongoDB driver.
- Created and used MongoDB collections for reports and member status.
- Queried documents by `memberId` and `reportId`.
- Updated document status from `pending` to `approved` or `rejected`.
- Updated member resources after an approved report.
- Implemented oil reserve rewards, talent droplets, talents, and activity passes.
- Applied rejection penalties to lamp oil.
- Verified database changes directly in MongoDB Atlas.

## Security and Configuration

- Stored the MongoDB connection string in an environment file instead of source code.
- Added environment files to `.gitignore`.
- Kept credentials out of GitHub.
- Used URL encoding for special characters in database passwords.
- Configured separate local and hosted environment values.
- Added MongoDB Atlas network access rules for the deployed backend.
- Understood the difference between local secrets and Render environment variables.

## REST API Testing

- Installed and used Thunder Client in VS Code.
- Tested API endpoints independently of the frontend.
- Tested GET requests.
- Tested POST requests.
- Tested query parameters such as `memberId`.
- Tested custom HTTP headers such as `x-client-version`.
- Tested JSON request bodies.
- Tested successful responses and expected error responses.
- Verified that API requests changed MongoDB data correctly.

## Debugging and Problem Solving

- Diagnosed browser-versus-Node ESLint errors.
- Fixed `require is not defined` errors.
- Fixed `process is not defined` errors.
- Fixed `module is not defined` errors.
- Diagnosed an environment file in the wrong directory.
- Diagnosed MongoDB DNS SRV timeouts.
- Tested DNS resolution with public DNS tools.
- Diagnosed MongoDB authentication failures.
- Corrected special-character encoding in a MongoDB connection string.
- Diagnosed missing request bodies in POST requests.
- Added validation for missing `reportId` and `approved` values.
- Diagnosed stale Node processes using port 5000.
- Diagnosed a missing `server.js` path caused by running commands from the wrong directory.
- Diagnosed and corrected a Render build command that referenced a nonexistent `build` script.
- Diagnosed a Render-to-MongoDB Atlas TLS/network connection problem.

## Deployment and Hosting

- Created a Git repository for the project.
- Connected the local repository to GitHub.
- Published the local `main` branch to GitHub.
- Configured a Render web service from the GitHub repository.
- Configured a monorepo deployment using `server` as the root directory.
- Used `npm install` as the backend build command.
- Used `npm start` as the backend start command.
- Configured hosted environment variables in Render.
- Deployed the backend successfully to Render after correcting the deployment settings and MongoDB network access.

## Frontend and Backend Integration Awareness

- Understood the difference between a React frontend, an Express backend, and MongoDB Atlas.
- Recognized that the frontend and backend can run in separate terminals.
- Understood that the backend provides API services for the frontend.
- Identified that a deployed frontend and deployed backend may be hosted as separate services.
- Connected backend data rules to existing frontend game-state fields such as `oilInLamp`, `oilReserve`, `talentDroplets`, `talents`, and `activityPasses`.

## Development Tools

- Used Visual Studio Code for development and debugging.
- Used PowerShell to run Node.js, npm, Git, DNS, and HTTP commands.
- Used ESLint to validate backend files.
- Used Thunder Client to test the API.
- Used MongoDB Atlas Data Explorer to create and inspect documents.
- Used GitHub for remote source control.
- Used Render for backend hosting.

## Documentation and Communication

- Created a reusable server setup guide.
- Documented required software and accounts.
- Documented MongoDB Atlas setup.
- Documented the backend folder structure.
- Documented API testing steps.
- Documented errors and their solutions separately.
- Created a backend Statement of Work with scope, goals, functions, deliverables, and acceptance criteria.
- Recorded proof of completed work and verification results.
- Explained technical decisions in plain language.
- Used a course learning activity to guide project implementation.

## Professional Strengths Demonstrated

- Breaking a large project into smaller backend tasks.
- Asking clarifying questions before implementing features.
- Connecting new backend work to existing project requirements.
- Testing real behavior instead of assuming code works.
- Reading error messages and tracing them to their cause.
- Protecting sensitive information during development and deployment.
- Learning unfamiliar tools such as MongoDB Atlas, Thunder Client, GitHub, and Render.
- Maintaining documentation that can help future developers reproduce the setup.
- Translating project requirements into working technical features.

## Resume-Ready Summary

Built and deployed a Node.js and Express REST API for a React-based vineyard tracking application. Connected the API securely to MongoDB Atlas using environment variables, implemented member-status retrieval and admin report-review workflows, processed query parameters, headers, and JSON request bodies, updated game-state resources based on approval decisions, tested the API with Thunder Client, diagnosed DNS/authentication/runtime issues, published the project to GitHub, and deployed the backend to Render.

## Areas for Future Growth

The following skills are planned future work rather than completed claims:

- user authentication and authorization
- automated tests
- formal MongoDB schema validation
- frontend integration with the deployed API
- production monitoring and logging
- CI/CD automation
- API documentation with OpenAPI or Swagger

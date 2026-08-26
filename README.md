# EventPulse API

EventPulse is a production-grade, real-time backend RESTful API designed for managing events, handling user registrations with capacity and duplicate guards, and broadcasting live event announcements via WebSockets. Built with scalability and security in mind, it features JWT authentication, role-based access control, input validation, automated testing, interactive OpenAPI/Swagger documentation, and continuous cloud deployment.

---

## Tech Stack

- Runtime & Framework: Node.js, Express.js
- Database & ORM: MongoDB, Mongoose
- Real-Time WebSockets: Socket.io
- Authentication & Security: JSON Web Tokens (JWT), Bcrypt.js, express-mongo-sanitize, CORS
- Validation: express-validator
- Testing: Jest, Supertest
- Documentation: Swagger UI (swagger-ui-express, swagger-jsdoc), Postman
- Deployment Platform: Vercel Serverless Functions & MongoDB Atlas

---

## Local Installation Steps

Follow these steps to set up and run EventPulse locally on your machine:

1. Clone the Repository
   git clone https://github.com/YOUR_GITHUB_USERNAME/EYOUTH-31002220101275-EventPulse.git
   cd EYOUTH-31002220101275-EventPulse

2. Install Project Dependencies
   npm install

3. Configure Environment Variables
   Create a .env file in the root directory:
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventpulse?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_super_secret_key_12345
   NODE_ENV=development

4. Seed the Database
   Populate your database with initial mock categories, admin/attendee users, and sample events:
   npm run seed

5. Start the Local Server
   # Start with Nodemon hot-reloading
   npm run dev

   # Or start in standard production mode
   npm start

   The server will start running locally at http://localhost:5000.

6. Run Automated Tests
   Execute unit and integration tests using Jest and Supertest:
   npm test

---

## Live Deployment Link

- Production API URL: https://eyouth-31002220101275-eventpulse.vercel.app
- Health Check: https://eyouth-31002220101275-eventpulse.vercel.app/health
- Interactive Swagger Docs: https://eyouth-31002220101275-eventpulse.vercel.app/api-docs

---

## API Endpoint Summary

Method: GET
Endpoint: /health
Access: Public
Description: Live system uptime, database status, and environment health monitor

Method: GET
Endpoint: /api-docs
Access: Public
Description: Interactive OpenAPI / Swagger UI documentation interface

Method: POST
Endpoint: /api/auth/register
Access: Public
Description: Register a new user (attendee or admin)

Method: POST
Endpoint: /api/auth/login
Access: Public
Description: Authenticate credentials and receive a JWT token

Method: GET
Endpoint: /api/events
Access: Public
Description: Retrieve a list of all scheduled events

Method: GET
Endpoint: /api/events/:id
Access: Public
Description: Fetch detailed information for a specific event

Method: POST
Endpoint: /api/events
Access: Admin
Description: Create a new event with capacity and location constraints

Method: PATCH
Endpoint: /api/events/:id
Access: Admin
Description: Update existing event details

Method: DELETE
Endpoint: /api/events/:id
Access: Admin
Description: Delete an event and remove its registrations

Method: POST
Endpoint: /api/registrations
Access: Attendee
Description: Register the authenticated user for an event (capacity/duplicate guarded)

Method: GET
Endpoint: /api/registrations/my
Access: Attendee
Description: List all events registered by the authenticated user

Method: DELETE
Endpoint: /api/registrations/:id
Access: Attendee
Description: Cancel an active event registration

Method: POST
Endpoint: /api/announcements
Access: Admin
Description: Publish a real-time event announcement via Socket.io

Method: GET
Endpoint: /api/announcements/:eventId
Access: Public
Description: Fetch past historical announcements for an event

---

## Repository & Submission Assets

- Postman Collection: Located in postman/EventPulse_API.postman_collection.json
- Postman Environment: Located in postman/EventPulse_Dev.postman_environment.json
# Task Manager API and Docker Compose Application

[![CI Pipeline](https://github.com/smit9132/assignment-w4-24it086/actions/workflows/ci.yml/badge.svg)](https://github.com/smit9132/assignment-w4-24it086/actions/workflows/ci.yml)

This project provides a React task-management frontend and a Node.js/Express REST API backed by MongoDB. It demonstrates task CRUD, JWT authentication, caching, event-driven notifications, HATEOAS responses, and containerization with Docker Compose.

This API implements the **Richardson Maturity Model Level 3**, achieving resource-oriented URLs, proper HTTP methods/status codes, and HATEOAS (Hypermedia As The Engine Of Application State) support.

## Technology Stack

- **Frontend:** React, React Router, Vite
- **Backend:** Node.js 20, Express 5
- **Database:** MongoDB 7 with Mongoose 8
- **Authentication:** JWT and bcryptjs
- **Other backend features:** NodeCache, Node.js EventEmitter, custom middleware
- **Containerization:** Docker and Docker Compose
- **Configuration:** dotenv

## Richardson Maturity Model

This API progressively implements the Richardson Maturity Model for REST APIs:

### Level 0 — Swamp of POX
A single endpoint exposed via HTTP. Not suitable for scalable REST APIs. This API does NOT use Level 0.

### Level 1 — Resources
The API uses resource-oriented URLs to represent distinct resources:
- `/tasks` - the tasks collection
- `/tasks/:id` - individual task resources

Each resource has a unique URI, and operations are performed on these specific resources.

### Level 2 — HTTP Verbs and Status Codes
The API uses HTTP methods appropriately and returns meaningful status codes:
- **GET** - Retrieve data (200 OK, 404 Not Found)
- **POST** - Create data (201 Created, 400 Bad Request)
- **PUT** - Full resource update (200 OK, 404 Not Found, 400 Bad Request)
- **PATCH** - Partial resource update (200 OK, 404 Not Found, 400 Bad Request)
- **DELETE** - Remove data (200 OK, 404 Not Found)
- **Error responses** - 500 Internal Server Error for server failures

### Level 3 — HATEOAS (Hypermedia)
The API includes hypermedia links (`_links`) in responses, allowing clients to discover available actions and navigate the API dynamically. This is the highest maturity level and enables true REST API discoverability.

**Example:** A client doesn't need to know the API structure beforehand; it can follow `_links` to perform actions:

```json
{
  "_links": {
    "self": { "href": "/tasks/123", "method": "GET" },
    "update": { "href": "/tasks/123", "method": "PUT" },
    "partialUpdate": { "href": "/tasks/123", "method": "PATCH" },
    "delete": { "href": "/tasks/123", "method": "DELETE" },
    "collection": { "href": "/tasks", "method": "GET" }
  }
}
```

## Project Structure

```
├── Dockerfile                 # Backend image
├── docker-compose.yml         # Frontend, backend, MongoDB, network, and volume
├── .dockerignore              # Backend build-context exclusions
├── .env.example               # Safe local environment template
├── server.js                  # Express app and MongoDB connection
├── cache.js / events.js       # Cache and shared task event emitter
├── listeners.js               # Event listeners/notifications
├── controllers/               # Authentication and task handlers
├── middleware/                # Authentication, validation, logging, errors
├── models/                    # Mongoose Task and User models
├── routes/                    # Authentication, task, and cache endpoints
├── utils/hateoas.js           # HATEOAS response links
└── frontend/
    ├── Dockerfile             # Multi-stage frontend build and preview
    ├── .dockerignore          # Frontend build-context exclusions
    ├── src/api.js             # Browser API/authentication client
    ├── src/App.jsx            # Routes and shared app UI
    └── src/components/Projects/Projects.jsx  # Task CRUD and sign-in UI
```

## Installation and Setup

### Run locally without Docker

For a local run, have MongoDB listening on `localhost:27017`. The frontend calls the API at `http://localhost:5000`.

1. Copy `.env.example` to `.env` and set a private, random `JWT_SECRET`. Keep `.env` untracked. The example URI points to local MongoDB.
2. Install and start the backend:

```powershell
npm ci
node server.js
```

3. In a second terminal, install and start the frontend:

```powershell
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`; use the Docker instructions in [Practical 11](#practical-11-containerization-with-docker-compose) to run all services without installing MongoDB separately.

## Practical 7: Authentication and Middleware Pipeline

Practical 7 adds JWT authentication and server-side validation while preserving the existing MongoDB/Mongoose task CRUD API.

### Authentication Features

- `POST /register` creates a user and stores the password as a bcrypt hash.
- `POST /login` verifies credentials and returns a JWT that expires in one hour.
- `GET /me` returns the authenticated user's `id`, `email`, and `createdAt` without the password.
- All task routes require `Authorization: Bearer <token>`.
- `POST /tasks` uses validation middleware and rejects a missing or empty title before database access.

### Authentication Endpoints

Register with `{ "email": "student@example.com", "password": "password123" }` at `POST /register`.

Login with the same body at `POST /login`, then use the returned token in the Authorization header for `/tasks` and `/me` requests.

### Protected Task Routes

`GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `PATCH /tasks/:id`, and `DELETE /tasks/:id` are protected by `authMiddleware`. Requests without a token or with an invalid/expired token return HTTP 401.

### Environment Variables

Copy `.env.example` to `.env` and set `MONGO_URI`, `PORT`, and a private `JWT_SECRET`. Never commit `.env` or place a real secret in `.env.example`.

### Postman Testing Flow

1. Register a user with `POST /register`.
2. Login with `POST /login` and copy the returned token.
3. Send `Authorization: Bearer <token>` when testing `/tasks` and `/me`.
4. Test task create, read, update, and delete operations.
5. Confirm missing and invalid tokens return HTTP 401.
6. Confirm `POST /tasks` without a title returns HTTP 400 with `Title is required`.

## API Endpoints

All endpoints are prefixed with `/` and are documented below.

### GET /

**Description:** Health check endpoint.

**Response:**

```
Task Manager API Running
```

---

### GET /tasks

**Description:** Retrieve all tasks.

**Response (200 OK):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Learn Express.js",
      "description": "Master Express fundamentals",
      "completed": false,
      "priority": "high",
      "createdAt": "2024-08-13T10:00:00.000Z",
      "_links": {
        "self": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "GET" },
        "update": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PUT" },
        "partialUpdate": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PATCH" },
        "delete": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "DELETE" },
        "collection": { "href": "/tasks", "method": "GET" }
      }
    }
  ],
  "_links": {
    "self": { "href": "/tasks", "method": "GET" },
    "create": { "href": "/tasks", "method": "POST" }
  }
}
```

---

### GET /tasks/:id

**Description:** Retrieve a single task by ID.

**Parameters:**
- `id` (path parameter): MongoDB ObjectId of the task

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Learn Express.js",
    "description": "Master Express fundamentals",
    "completed": false,
    "priority": "high",
    "createdAt": "2024-08-13T10:00:00.000Z",
    "_links": {
      "self": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "GET" },
      "update": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PUT" },
      "partialUpdate": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PATCH" },
      "delete": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "DELETE" },
      "collection": { "href": "/tasks", "method": "GET" }
    }
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Task not found"
}
```

**Response (400 Bad Request - Invalid ID):**

```json
{
  "success": false,
  "message": "Invalid task ID"
}
```

---

### POST /tasks

**Description:** Create a new task.

**Request Body:**

```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "priority": "high"
}
```

**Validation:**
- `title` (required): String, max 100 characters
- `description` (optional): String
- `priority` (optional): One of `["low", "medium", "high"]`, defaults to `"medium"`

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "New Task",
    "description": "Task description",
    "completed": false,
    "priority": "high",
    "createdAt": "2024-08-13T10:05:00.000Z",
    "_links": {
      "self": { "href": "/tasks/507f1f77bcf86cd799439012", "method": "GET" },
      "update": { "href": "/tasks/507f1f77bcf86cd799439012", "method": "PUT" },
      "partialUpdate": { "href": "/tasks/507f1f77bcf86cd799439012", "method": "PATCH" },
      "delete": { "href": "/tasks/507f1f77bcf86cd799439012", "method": "DELETE" },
      "collection": { "href": "/tasks", "method": "GET" }
    }
  }
}
```

**Response (400 Bad Request - Missing required field):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": "Path `title` is required."
  }
}
```

**Response (400 Bad Request - Invalid enum value):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "priority": "Path `priority` must be one of [low, medium, high]."
  }
}
```

---

### PUT /tasks/:id

**Description:** Full update of a task (all fields must be provided or will be set to default/null).

**Parameters:**
- `id` (path parameter): MongoDB ObjectId of the task

**Request Body:**

```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true,
  "priority": "medium"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Task Title",
    "description": "Updated description",
    "completed": true,
    "priority": "medium",
    "createdAt": "2024-08-13T10:00:00.000Z",
    "_links": {
      "self": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "GET" },
      "update": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PUT" },
      "partialUpdate": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PATCH" },
      "delete": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "DELETE" },
      "collection": { "href": "/tasks", "method": "GET" }
    }
  }
}
```

---

### PATCH /tasks/:id

**Description:** Partial update of a task (only provided fields are updated).

**Parameters:**
- `id` (path parameter): MongoDB ObjectId of the task

**Request Body (example - update only `completed`):**

```json
{
  "completed": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Learn Express.js",
    "description": "Master Express fundamentals",
    "completed": true,
    "priority": "high",
    "createdAt": "2024-08-13T10:00:00.000Z",
    "_links": {
      "self": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "GET" },
      "update": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PUT" },
      "partialUpdate": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PATCH" },
      "delete": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "DELETE" },
      "collection": { "href": "/tasks", "method": "GET" }
    }
  }
}
```

**Note:** PATCH is ideal for mobile clients or situations where only a single field needs updating without re-sending all task data.

---

### DELETE /tasks/:id

**Description:** Delete a task.

**Parameters:**
- `id` (path parameter): MongoDB ObjectId of the task

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "_links": {
    "collection": { "href": "/tasks", "method": "GET" }
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Task Schema

The Task model in MongoDB has the following fields:

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `_id` | ObjectId | Auto | - | MongoDB auto-generated ID |
| `title` | String | Yes | - | Task title, trimmed |
| `description` | String | No | - | Task description |
| `completed` | Boolean | No | `false` | Task completion status |
| `priority` | String | No | `"medium"` | One of: `"low"`, `"medium"`, `"high"` |
| `createdAt` | Date | No | `Date.now()` | Timestamp of creation |

---

## Error Handling

The API returns structured error responses for all error scenarios:

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fieldName": "Detailed error message"
  }
}
```

### Invalid MongoDB ID (400)

```json
{
  "success": false,
  "message": "Invalid task ID"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Task not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

Sensitive information (stack traces, MongoDB connection strings) is never exposed to clients.

---

## Testing with Postman

Follow these steps to test the API using Postman:

1. **Import the Base URL:**
  - Set base URL: `http://localhost:5000`

2. **Create a Task (POST /tasks):**
   - Method: `POST`
  - URL: `http://localhost:5000/tasks`
   - Body (JSON):
     ```json
     {
       "title": "Learn MongoDB",
       "description": "Master MongoDB and Mongoose",
       "priority": "high"
     }
     ```
   - Expected: `201 Created`

3. **Retrieve All Tasks (GET /tasks):**
   - Method: `GET`
  - URL: `http://localhost:5000/tasks`
   - Expected: `200 OK` with task list and HATEOAS links

4. **Get Single Task (GET /tasks/:id):**
   - Method: `GET`
   - URL: `http://localhost:3000/tasks/<task-id-from-step-2>`
   - Expected: `200 OK`

5. **Partial Update (PATCH /tasks/:id):**
   - Method: `PATCH`
   - URL: `http://localhost:3000/tasks/<task-id>`
   - Body (JSON):
     ```json
     {
       "completed": true
     }
     ```
   - Expected: `200 OK`

6. **Full Update (PUT /tasks/:id):**
   - Method: `PUT`
   - URL: `http://localhost:3000/tasks/<task-id>`
   - Body (JSON):
     ```json
     {
       "title": "Updated Title",
       "description": "Updated description",
       "completed": true,
       "priority": "low"
     }
     ```
   - Expected: `200 OK`

7. **Delete Task (DELETE /tasks/:id):**
   - Method: `DELETE`
   - URL: `http://localhost:3000/tasks/<task-id>`
   - Expected: `200 OK`

8. **Test 404 (GET /tasks/<invalid-id>):**
   - Method: `GET`
   - URL: `http://localhost:3000/tasks/123`
   - Expected: `400 Bad Request` with "Invalid task ID"

---

## HATEOAS Explained

**HATEOAS** stands for "Hypermedia As The Engine Of Application State."

In this API, every task resource response includes a `_links` object with URLs to related actions. This allows clients to:

1. **Discover available actions** without hardcoding URLs
2. **Navigate the API** dynamically by following links
3. **Build truly decoupled clients** that don't break if URLs change

### Example HATEOAS in Action

When you retrieve a task, the response includes:

```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Learn Express.js",
    "_links": {
      "self": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "GET" },
      "update": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PUT" },
      "partialUpdate": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "PATCH" },
      "delete": { "href": "/tasks/507f1f77bcf86cd799439011", "method": "DELETE" },
      "collection": { "href": "/tasks", "method": "GET" }
    }
  }
}
```

A smart client can:
- Use the `self` link to re-fetch the task
- Use the `update` link to update the task
- Use the `partialUpdate` link for partial updates
- Use the `delete` link to remove the task
- Use the `collection` link to go back to the task list

This is the key feature of Richardson Maturity Model Level 3.

---

## Environment Configuration

### Optional MongoDB Atlas configuration

For a non-Docker deployment, set `MONGO_URI` to your MongoDB Atlas connection string and `PORT=5000` in your local `.env` file. Keep credentials private and do not add them to source control. Docker Compose instead uses its MongoDB service; see Practical 11.

### .env.example

A template file `.env.example` is provided for team members. Fill in their own credentials without exposing secrets to Git.

---

## Git Workflow

### Commit the Work

```bash
git add .
git commit -m "feat: Upgrade API to Richardson Maturity Model Level 3 with HATEOAS support

- Implement HATEOAS links for all endpoints
- Add PATCH endpoint for partial updates
- Create utils/hateoas.js helper for consistent link generation
- Improve error handling and structured error responses
- Add comprehensive API documentation
- Reach Richardson Level 3 maturity"
```

### Push to Repository

```bash
git push origin main
```

---

## Notes for Future Enhancements

- Implement pagination for large task lists
- Add filtering and sorting capabilities
- Add rate limiting for production deployments
- Implement comprehensive unit and integration tests
- Add API versioning (e.g., `/v1/tasks`)

---

## Practical 9: In-Memory Caching

The API uses `node-cache` for in-memory caching without changing the existing MongoDB/Mongoose CRUD or authentication behavior.

### Cache Configuration

- TTL: 60 seconds (`stdTTL: 60`)
- `GET /tasks` key: `all_tasks`
- `GET /tasks/:id` key: `task_<id>`
- Cache implementation: `cache.js`

The cache stores the existing response format, including HATEOAS links. The first request after startup or invalidation is a cache miss and queries MongoDB. Requests within the TTL can be served from memory.

### Cache Invalidation

After a successful `POST /tasks`, the `all_tasks` cache is deleted. After a successful `PUT`, `PATCH`, or `DELETE` on `/tasks/:id`, both `all_tasks` and the affected `task_<id>` cache entry are deleted. Failed database operations do not invalidate the cache.

### Cache Statistics

`GET /api/cache/stats` returns cache hit and miss counters for collection and individual-task requests, the configured TTL, and the current number of cache entries. The endpoint requires the same Bearer JWT authentication as the task routes.

### Practical 9 Measurements

The three baseline readings were taken before caching:

| Condition | Reading 1 | Reading 2 | Reading 3 | Average |
|---|---:|---:|---:|---:|
| Without caching | 85 ms | 327 ms | 60 ms | 157.33 ms |
| With caching | To be measured | To be measured | To be measured | To be calculated |

The cached readings must be measured in Postman after restarting the server. Do not use estimated values.

---

## Practical 10: Asynchronous Event-Driven Processing

The API uses Node.js's built-in `EventEmitter`; no external event or queue package is used. The shared event instance is defined in `events.js`. `server.js` imports `listeners.js` once before mounting the task routes, registering handlers before task requests can emit events.

### Events and Processing

- After MongoDB successfully creates a task and the existing HTTP 201 response is sent, the controller emits `task-created` with the task and authenticated user's ID.
- The `task-created` listener logs the task title, creation timestamp, and authenticated user ID (the available user context; the current Task schema has no separate assignee field). It logs when handling starts, then completes its notification log after an artificial 2-second `setTimeout` delay. The delayed work does not hold the HTTP request open.
- After a task is successfully deleted and the existing HTTP 200 response is sent, the controller emits `task-deleted`. Its listener logs the deleted task and user separately.
- An `error` listener logs custom EventEmitter errors so an emitted `error` event has a handler.
- The API logs `[API] Response sent at` immediately after sending its response, making it possible to compare that time with `[Notification] Notification completed at`. No timestamps or test outcomes are prefilled here; capture the actual output from your run.

Event listeners do not change authentication, CRUD response formats, or Practical 9 cache behavior. POST still clears `all_tasks`; PUT/PATCH/DELETE still clear `all_tasks` and the affected task cache entry. `GET /api/cache/stats` remains available with a Bearer token.

### Practical 10 Postman Flow

Start the API using `node server.js` after configuring `.env` with `MONGO_URI` and `JWT_SECRET`.

1. Register a user: `POST http://localhost:5000/register`, JSON body `{"email":"student@example.com","password":"password123"}`. Use a unique email if that account already exists.
2. Log in: `POST http://localhost:5000/login` with the same JSON body. Copy `token` from the response.
3. For each following request, set Authorization to **Bearer Token** and provide that token.
4. Check the collection cache: send `GET http://localhost:5000/tasks` twice, then `GET http://localhost:5000/api/cache/stats`; compare `allTasks` misses/hits.
5. Create a task: `POST http://localhost:5000/tasks`, `Content-Type: application/json`, body `{"title":"Practical 10 event test","description":"Verify asynchronous notification","priority":"high"}`. Confirm HTTP 201, then copy `data._id` from the response as the task ID. In the server terminal, compare `[API] Response sent at` with `[Notification] Notification completed at`; the latter should be about 2 seconds later.
6. Request `GET /tasks` again and confirm the new task is present (POST invalidated the prior collection response). Repeat the GET and inspect cache statistics for a hit.
7. Check individual-task caching with two requests to `GET http://localhost:5000/tasks/<taskId>`, then inspect `/api/cache/stats` for `taskById` activity.
8. Update the task using `PATCH http://localhost:5000/tasks/<taskId>` with body `{"completed":true}`. Request the task again to confirm the updated value and that the old cached entry was invalidated. A `PUT` can be checked similarly using the full task fields.
9. Delete it using `DELETE http://localhost:5000/tasks/<taskId>`. Confirm HTTP 200 and observe `[Event] task-deleted received` and `[Notification] Deleted task` in the server terminal. GET the collection and individual task again to verify invalidation and the expected 404 for the deleted task.

Capture the actual Postman status/body and server terminal logs as evidence. In particular, include the POST HTTP 201 response alongside the API response timestamp and the later notification completion timestamp; include DELETE HTTP 200 alongside its event logs; and include cache-stat responses before and after mutations.

---

## Practical 11: Containerization with Docker Compose

### Objective and learning outcomes

Containerize the React frontend, Express API, and MongoDB database as separate services that can be built and started together. This practical demonstrates reproducible image builds, service discovery on a bridge network, environment-based configuration, and persistent database storage.

After completing it, you should be able to:

- Build application images from Dockerfiles and distinguish images from running containers.
- Define and operate related services with Docker Compose.
- Let containers communicate through Compose service names on a user-defined bridge network.
- Pass configuration to the backend through environment variables without baking secrets into images.
- Persist MongoDB data in a named volume beyond the lifetime of a container.
- Use a multi-stage frontend build to produce and serve a production Vite bundle.

### Prerequisites

- Docker Desktop (Windows/macOS) or Docker Engine with the Compose plugin.
- Confirm Docker and Compose are available:

```bash
docker --version
docker compose version
```

The backend and frontend Dockerfiles use Node.js 20 Alpine images. Docker builds install dependencies from the committed lockfiles using `npm ci`.

### Architecture

```text
Browser (http://localhost:5173)
  -> frontend container (built React app served by Vite preview)
  -> backend container (Express API, port 5000)
  -> mongodb container (MongoDB, port 27017)

Browser API requests use the published host address http://localhost:5000.
```

All three services join the `app-network` bridge network. The backend connects to MongoDB at `mongodb://mongodb:27017/taskdb`; `mongodb` resolves to the database service inside Compose. MongoDB data is stored in the named `mongodb_data` volume, mounted at `/data/db`.

### Configure and Start

Compose reads `JWT_SECRET` from the repository-root `.env` file. On Windows PowerShell, create it with `Copy-Item .env.example .env`; on macOS/Linux, use `cp .env.example .env`. Replace the placeholder with a private random value. `docker-compose.yml` sets the backend's `MONGO_URI` to the Compose service address, overriding the local URI in the example file. Do not commit `.env`.

From the repository root, build and start the frontend, backend, and database together:

```bash
docker compose up --build
```

To run it in the background, use `docker compose up --build -d`. The backend waits for the MongoDB health check before starting.

### URLs and Container Ports

- Frontend: `http://localhost:5173`
- Backend health endpoint: `http://localhost:5000/`
- Task manager UI: `http://localhost:5173/projects`
- API health response: `Task Manager API Running`
- MongoDB from the host: `mongodb://localhost:27017/taskdb`
- MongoDB from the backend container: `mongodb://mongodb:27017/taskdb`

The frontend's API requests run in the user's browser, so its existing `http://localhost:5000` API URL is correct when the backend port is published to the host. Inside the backend container, `localhost` would refer to that backend container itself; the Compose service name `mongodb` resolves to the database container on `app-network`.

| Compose service | Host port | Container port | Purpose |
|---|---:|---:|---|
| `frontend` | 5173 | 5173 | React production build |
| `backend` | 5000 | 5000 | Express REST API |
| `mongodb` | 27017 | 27017 | MongoDB database |

`EXPOSE` in a Dockerfile documents a container port; it does not publish that port. The Compose `ports` entries map host ports to container ports, making the frontend, API, and MongoDB reachable at the URLs above.

### Inspect containers and logs

List services and containers:

```bash
docker compose ps
docker ps
```

Follow all service logs or a single service:

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f mongodb
```

### Test the application

1. Open `http://localhost:5173`, then choose **Open the task manager** (or visit `/projects`).
2. Register an account and sign in. Registration uses `POST /register`; sign-in uses `POST /login` and stores the returned token in browser local storage.
3. Confirm a request without a token is rejected: `GET http://localhost:5000/tasks` returns HTTP 401. The frontend attaches the token as `Authorization: Bearer <token>`.
4. In the signed-in task manager, create a task, refresh the list, edit it, mark it complete, and delete it. The UI uses `POST`, `GET`, `PUT`, and `DELETE` on `/tasks`; `PATCH /tasks/:id` is also available to API clients.
5. Check the API root at `http://localhost:5000/`. For a direct API flow, use Postman with the endpoints and request bodies documented in [Practical 7](#practical-7-authentication-and-middleware-pipeline) and [API Endpoints](#api-endpoints).

These are instructions for exercising the implemented features, not a claim that the live application was tested as part of this documentation update.

### Rebuild after code changes

```bash
docker compose up --build
```

For a background run, use `docker compose up --build -d`. To rebuild one service only, use `docker compose build frontend` or `docker compose build backend`, then `docker compose up -d`.

### Stop without deleting database data

Stop and remove the containers and Compose network with:

```bash
docker compose down
```

The `mongodb_data` named volume is retained, so database contents survive `docker compose down` and container recreation. Do not add `-v` to the down command unless you intentionally want to delete the database volume and its data.

### Docker Build Notes

- Each project has a `.dockerignore` that excludes `node_modules`, `.env` files, `.git`, `.gitignore`, and npm debug logs. The backend ignore file also excludes the frontend folder from the backend build context.
- Host `node_modules` are not copied into either image. Dependencies are installed inside the image for its Node/Linux environment, avoiding host-specific binaries and stale packages.
- The frontend Dockerfile builds the React app in a Node 20 Alpine build stage, then copies the build output and preview runtime dependencies into a Node 20 Alpine runtime stage. Vite preview listens on `0.0.0.0:5173`.
- The official `mongo:7` image stores database files at `/data/db`, backed by the named `mongodb_data` volume.

### Troubleshooting

- If Compose reports that `JWT_SECRET` is missing, create the repository-root `.env` from `.env.example` and set a private JWT secret.
- If a port is already allocated, stop the process using host port 5173, 5000, or 27017 before starting Compose.
- If the API cannot connect to MongoDB, inspect `docker compose logs backend mongodb` and `docker compose ps`; confirm MongoDB becomes healthy and the backend URI uses `mongodb`, not `localhost` or `127.0.0.1`.
- If a service exits, inspect its logs with `docker compose logs <service>` and check the reported exit status with `docker compose ps -a`.
- If changes do not appear, rebuild the affected image with `docker compose build --no-cache <service>` and restart with `docker compose up`.
- If the frontend loads but API requests fail, confirm the backend is published on host port 5000 and visit `http://localhost:5000/`.
- If services were already built before a source or dependency change, rebuild with `docker compose up --build`.
- `docker compose down` preserves database data; `docker compose down -v` deletes the named volume.

### Short viva questions and answers

1. **What is a Docker image?** A read-only template containing the application and its runtime requirements, used to create containers.
2. **What is a container?** An isolated running instance of an image with its own process environment.
3. **What does a Dockerfile do?** It describes the steps and defaults used to build an image.
4. **Why use Docker Compose?** It describes and operates the related application services, networks, and volumes together.
5. **What is a bridge network?** A private network that lets containers communicate by service name while isolating that traffic from other networks.
6. **Why use environment variables?** They configure a service at runtime without hard-coding deployment-specific values into source or an image.
7. **What is a named volume?** Docker-managed persistent storage independent of a container's writable layer; `mongodb_data` preserves the database across container recreation.
8. **How does the backend find MongoDB?** Through the Compose DNS service name `mongodb` on `app-network`, using `mongodb://mongodb:27017/taskdb`.
9. **What is a multi-stage build?** A Dockerfile with separate build and runtime stages; the frontend compiles React in one stage and runs the built app from the runtime stage.

## License

ISC

## Practical 12 — GitHub Actions CI/CD Pipeline

### Objective and Overview

This practical implements a GitHub Actions CI pipeline that automatically runs on every push to the `main` branch. It checks out the repository, installs backend dependencies using `npm ci`, runs automated Jest tests, and reports pass/fail status with a green ✅ or red ❌ in the GitHub Actions tab.

The pipeline ensures the Task Manager API backend remains functional across code changes and gives immediate feedback on failures — without needing a local MongoDB server.

### CI Workflow Architecture

- **Workflow file**: `.github/workflows/ci.yml`
- **Trigger**: Every push to `main` branch, plus manual `workflow_dispatch` invocation
- **Runner**: `ubuntu-latest`
- **Node.js version**: 20 (matches Dockerfile and `jest@30` requirements)
- **Steps**:
  1. `actions/checkout@v4` — checks out the repository code
  2. `actions/setup-node@v4` (Node 20, npm cache) — sets up Node.js with dependency caching
  3. `npm ci` — installs exact dependencies from `package-lock.json` (reproducible)
  4. `npm test` — runs the full Jest test suite with `--forceExit`

### How Tests Run Without MongoDB

The test file (`task_api.test.js`) mocks both the `User` and `Task` Mongoose models using `jest.mock()`. This means no real database connection is needed — the models are replaced with in-memory fake functions. The Express app is imported directly and tested with [Supertest](https://github.com/ladjs/supertest), which makes real HTTP requests in-process without starting a server manually.

### Workflow Environment Variables

Since `.env` is not committed to Git, the CI workflow sets the required environment variables directly:

```yaml
env:
  JWT_SECRET: ci-test-secret-key-for-github-actions
  MONGO_URI: mongodb://localhost:27017/taskdb_test
  PORT: 5000
```

### Dependency Installation and Test Commands

```bash
# Install exact versions from lock file (reproducible CI install)
npm ci

# Run automated tests (Jest with --forceExit to avoid hangs)
npm test
```

### Running Tests Locally

```bash
# From the project root directory
npm install
npm test
```

All 6 tests should pass in about 1–2 seconds:

```
PASS ./task_api.test.js
  GET /tasks without authentication
    ✓ should return 401 when authentication header is missing
  POST /tasks without authentication
    ✓ should return 401 when authentication header is missing
  POST /register
    ✓ should register a new user
    ✓ should return 400 when email is missing
    ✓ should return 400 when password is missing
  POST /login
    ✓ should return 401 with invalid credentials

Tests: 6 passed, 6 total
```

### Viewing Runs Under GitHub → Actions

1. Push changes to the `main` branch
2. Navigate to the repository on GitHub
3. Click the **Actions** tab
4. Select the **CI Pipeline** workflow
5. Click the latest run to see step-by-step logs
6. A green ✅ means all tests passed; a red ❌ means at least one test failed

### GitHub Actions Status Badge

The badge at the top of this README shows the live pipeline status:

```markdown
[![CI Pipeline](https://github.com/smit9132/assignment-w4-24it086/actions/workflows/ci.yml/badge.svg)](https://github.com/smit9132/assignment-w4-24it086/actions/workflows/ci.yml)
```

### CI vs CD

| Concept | Description |
|---------|-------------|
| **Continuous Integration (CI)** | Automatically test every code push. Catches bugs early before merging. |
| **Continuous Deployment (CD)** | Automatically deploy tested code to production/staging. Practical 11 (Docker Compose) provides the deployment foundation. |

Practical 12 focuses on **CI only** — automated testing, not deployment.

### Practical 12 Key Learning Outcomes

- Set up a GitHub Actions CI pipeline for a Node.js/Express API
- Write automated tests with Jest and Supertest that run without a real database
- Export the Express app separately from server startup to make it testable
- Use `jest.mock()` to isolate tests from MongoDB
- Configure `--forceExit` to prevent Jest from hanging in CI
- Use `npm ci` instead of `npm install` for reproducible CI builds
- Provide environment variables in the workflow YAML instead of `.env`
- Interpret green ✅ and red ❌ pipeline run status
- Debug and fix CI failures (wrong Node.js version, hanging process, missing env vars)

---

**For academic practical purposes and demonstration of CI/CD pipeline concepts.**
---

## Practical 13 � AI API Integration into a Web Application

### Objective and Overview

This practical integrates an AI-powered assistant into the existing Task Management web application. Users can enter a task title (e.g., *"Complete DBMS assignment"*) and click **? Generate Description**. The backend calls the OpenAI API using the official openai Node.js SDK and the gpt-4o-mini model to synthesize a concise, actionable task description.

The generated description is inserted into an **editable textarea**, giving the user full autonomy to accept, edit, or replace the suggestion before saving the task to MongoDB.

### Architecture and Request Flow

`	ext
[ React Frontend ]
  �
  �  1. User enters title & clicks "Generate Description"
  �  2. POST /api/ai/generate-description { title: "Complete DBMS assignment" }
  ?
[ Express Backend Server ]
  �
  +-? [ Rate Limiting Middleware ]
  �     +-? Exceeded 1 request/task/minute? --? Return 429 Too Many Requests
  �
  +-? [ Validation Check ]
  �     +-? Missing / blank title?          --? Return 400 Bad Request
  �
  +-? [ Secure API Key Verification ]
  �     +-? Missing / placeholder key?       --? Return 200 Graceful Fallback Template
  �
  +-? [ OpenAI SDK Integration ]
        �
        +-? Model: gpt-4o-mini (10s timeout)
        +-? System Prompt: Concise, plain text, actionable
        +-? Payload: Only sanitized task title (No tokens/emails)
        ?
   [ Success / Fallback Response ]
        �
        ?
[ React Form populated with editable description & user disclaimer ]
`

### Backend Endpoint Specification

#### Endpoint
POST /api/ai/generate-description

#### Headers
Content-Type: application/json

#### Request Body
`json
{
  "title": "Complete DBMS assignment"
}
`

#### Success Response (200 OK)
`json
{
  "success": true,
  "description": "Complete the assigned DBMS exercises focusing on ER diagram design, normalization to 3NF, and writing optimized SQL queries."
}
`

#### Validation Error (400 Bad Request)
`json
{
  "success": false,
  "message": "Task title is required to generate a description."
}
`

#### Rate Limit Exceeded (429 Too Many Requests)
`json
{
  "success": false,
  "message": "Rate limit reached. Maximum one AI generation request per task per minute. Please wait 45 second(s) before trying again.",
  "retryAfter": 45
}
`

#### Fallback Response (200 OK - Graceful Degradation)
Returned when OPENAI_API_KEY is not set or OpenAI is unreachable:
`json
{
  "success": true,
  "description": "Plan and execute tasks related to 'Complete DBMS assignment'. Review objectives, organize required resources, and complete deliverables on time.",
  "isFallback": true,
  "message": "AI service key is not configured on the server. A fallback template description has been provided."
}
`

### Secure API Key Configuration

The OpenAI API key is stored **strictly on the backend** in the root .env file:

`env
OPENAI_API_KEY=your_actual_api_key_here
`

#### Security Guardrails
1. **Never in Frontend**: The React client has no access to the API key. No VITE_ variables are used for OpenAI credentials.
2. **Never in Git**: .env is explicitly ignored in .gitignore:
   `
   .env
   .env.*
   !.env.example
   `
3. **Never in Docker Images**: .dockerignore prevents .env from being copied during image builds.
4. **Safe Template Provided**: .env.example contains placeholders without credentials:
   `env
   MONGO_URI=mongodb://localhost:27017/taskdb
   PORT=5000
   JWT_SECRET=replace_with_a_private_random_secret
   OPENAI_API_KEY=your_actual_api_key_here
   `
5. **No Secret Logging**: The backend never prints, logs, or returns the API key in terminal logs or error responses.

### How to Configure Your OpenAI API Key

1. Sign in to your [OpenAI Platform](https://platform.openai.com) account.
2. Navigate to **API Keys** and generate a new secret key.
3. Open your local .env file in the project root.
4. Replace your_actual_api_key_here with your secret key:
   `env
   OPENAI_API_KEY=sk-proj-...
   `
5. Restart your backend server (
ode server.js).
6. *If you do not have an API key*, the application automatically uses the built-in structured fallback mechanism, ensuring the entire app and all tests work without error.

### Frontend Features

The task creation form in rontend/src/components/Projects/Projects.jsx includes:
- **Task Title Input**: Title input field where users enter their task name.
- **? Generate Description Button**: Calls the backend AI route. Disabled when title is blank or an operation is in progress.
- **Loading Indicator**: Displays an animated spinner and status message (*"Generating description with AI..."*) while awaiting response.
- **Editable Textarea**: Automatically receives the generated description. The user can edit every word, delete it, or add additional notes.
- **AI Disclaimer**: Displays a visible notice:
  > *?? **AI-generated suggestion:** Please review and edit the description before saving.*
- **Notification Toast**: Informs the user when description is ready or displays a friendly error/fallback notice.
- **Manual Mode Preserved**: Users can type descriptions manually and save tasks without ever touching the AI button.

### Rate Limiting Implementation

Rate limiting is enforced on the backend via [middleware/aiRateLimiter.js](./middleware/aiRateLimiter.js):
- **Limit**: Maximum **1 request per task per minute** per client.
- **Mechanism**: In-memory timestamp tracker keyed by client IP and normalized task title.
- **Response**: Returns HTTP 429 Too Many Requests with the exact remaining wait time.
- **Scope**: Applied exclusively to POST /api/ai/generate-description. Normal task CRUD operations (/tasks) are completely unaffected.

### Responsible AI and Privacy Considerations

- **Data Minimization**: Only the 	itle string is sent to the OpenAI API.
- **Zero Sensitive Data**: User emails, passwords, JWT tokens, and private database IDs are never sent to external AI services.
- **Strict System Prompt**: Restricts model output to safe, practical, plain-text sentences without hallucinated Markdown tags.
- **Human in the Loop**: The user retains full control and responsibility to review, modify, or reject AI-generated suggestions before storing them in MongoDB.

### Automated Testing (Jest & Supertest)

The test suite in [	ask_api.test.js](./task_api.test.js) tests all aspects of the application (11 tests in total):

1. **Practical 11 & 12 Tests (6 tests)**:
   - Authentication checks for GET /tasks and POST /tasks
   - User registration (success and missing fields validation)
   - User login authentication checks
2. **Practical 13 AI Tests (5 tests)**:
   - Successful description generation with valid title (mocked OpenAI SDK)
   - 400 Bad Request validation on empty or missing title
   - 429 Too Many Requests rate limit enforcement on duplicate requests
   - 200 OK Graceful fallback when API key is missing or placeholder
   - 200 OK Graceful fallback when OpenAI service times out or throws an error

#### Mocking Strategy
The OpenAI SDK is mocked in Jest:
`javascript
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreateChatCompletion } }
  }));
});
`
This guarantees that:
- Automated tests and GitHub Actions CI pipelines **pass without requiring a real API key**.
- Tests execute in **~3 seconds**.
- **No OpenAI credits** are consumed during testing.

### Running Tests Locally

From the project root:
`ash
npm test
`

Expected output:
`	ext
PASS ./task_api.test.js
  GET /tasks without authentication
    ? should return 401 when authentication header is missing
  POST /tasks without authentication
    ? should return 401 when authentication header is missing
  POST /register
    ? should register a new user
    ? should return 400 when email is missing
    ? should return 400 when password is missing
  POST /login
    ? should return 401 with invalid credentials
  POST /api/ai/generate-description
    ? should generate a task description when a valid title is provided
    ? should return 400 when task title is empty or missing
    ? should enforce rate limiting on repeated requests for the same task title within one minute
    ? should return fallback description gracefully when API key is missing or placeholder
    ? should return fallback description without crashing when OpenAI service encounters an error or timeout

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
`

### Faculty Practical Demonstration Steps

To demonstrate Practical 13 to your faculty:
1. **Start the Application**:
   - Backend: 
ode server.js (listening on port 5000)
   - Frontend: cd frontend && npm run dev (listening on port 5173)
2. **Sign In**: Log into the application from the React web interface.
3. **Test Empty Validation**: Click "Generate Description" with an empty title to show the validation message.
4. **Generate Description**:
   - Type title: *"Complete DBMS assignment"*
   - Click **? Generate Description**
   - Point out the **loading spinner** ("Generating description with AI...")
   - Observe the description populated into the description box.
5. **Demonstrate Human-in-the-Loop Editing**:
   - Edit the generated text inside the textarea (e.g., append specific chapter numbers).
   - Point out the required disclaimer: *"AI-generated suggestion: Please review and edit the description before saving."*
6. **Save Task**: Click **Create task** and verify that the task with the edited description appears in the "Saved tasks" list.
7. **Demonstrate Rate Limiting**: Immediately click **? Generate Description** again with the same title to show the rate limit notice.
8. **Demonstrate Graceful Fallback**: Explain how fallback descriptions are generated if the API key is not configured or if the external AI service times out.
9. **Show CI Pipeline**: Run 
pm test to prove all 11 automated tests pass cleanly.

---

**For academic practical demonstration of AI API integration into modern full-stack web applications.**

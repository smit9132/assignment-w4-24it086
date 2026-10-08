# Task Manager REST API

A production-ready REST API for managing tasks, built with Node.js, Express.js, MongoDB, and Mongoose.

This API implements the **Richardson Maturity Model Level 3**, achieving resource-oriented URLs, proper HTTP methods/status codes, and HATEOAS (Hypermedia As The Engine Of Application State) support.

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Configuration:** dotenv
- **Middleware:** Custom logger and global error handler

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
├── server.js                      # Express app setup and MongoDB connection
├── package.json                   # Project dependencies
├── .env                          # MongoDB URI (not committed to Git)
├── .env.example                  # Template for .env
├── .gitignore                    # Git ignore rules
├── controllers/
│   └── taskController.js         # Request handlers and business logic
├── routes/
│   └── taskRoutes.js             # API route definitions
├── models/
│   └── Task.js                   # Mongoose schema for tasks
├── middleware/
│   ├── logger.js                 # HTTP request logging
│   └── errorHandler.js           # Global error handling
├── utils/
│   └── hateoas.js                # HATEOAS link generation helpers
└── data/
    └── tasks.js                  # Legacy in-memory data (not used)
```

## Installation and Setup

The backend runs at `http://localhost:5000` and uses MongoDB Atlas for persistence. Start the React frontend separately at `http://localhost:5173`.

### 1. Clone or Navigate to the Project

```bash
cd task-manager-api-24it086
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
PORT=5000
```

**Important:** Never commit `.env` to Git. Use `.env.example` as a template and add your actual credentials locally.

### 4. Start the Server

```bash
node server.js
```

You should see:

```
✅ MongoDB Connected
Server is running on http://localhost:5000
```

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

### Using MongoDB Atlas

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with a strong password
3. Whitelist your IP address
4. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
5. Add to `.env`:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=3000
```

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

- Add JWT authentication for secure task management
- Implement pagination for large task lists
- Add filtering and sorting capabilities
- Add rate limiting for production deployments
- Implement comprehensive unit and integration tests
- Add API versioning (e.g., `/v1/tasks`)
- Add request validation middleware

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

## License

ISC

---

**For academic practical purposes and demonstration of Richardson Maturity Model concepts.**

# Richardson Maturity Model Evaluation

## Step 1: What is the Richardson Maturity Model?
The Richardson Maturity Model is a simple way to measure how RESTful an API is. It has four levels:

### Level 0: The Swamp of POX
- Level 0 means the API is usually one endpoint or one URL.
- The API often uses a single route like `/api` or `/service`.
- Actions are hidden inside the request body or query parameters.
- This is similar to remote procedure calls (RPC).

Example:
```text
POST /api
{
  "action": "createTask",
  "title": "Learn Express"
}
```

### Level 1: Resources
- Level 1 organizes the API around resources.
- Each resource has its own path, like `/tasks` and `/tasks/1`.
- This is the first step toward REST.

Example:
```text
GET /tasks
POST /tasks
GET /tasks/1
```

### Level 2: HTTP Verbs
- Level 2 uses HTTP methods correctly with resource URLs.
- It uses `GET`, `POST`, `PUT`, `DELETE` and other methods for the right action.
- The API also often uses proper HTTP status codes.

Example:
```text
GET /tasks          # read all tasks
POST /tasks         # create a task
PUT /tasks/1        # update task with id 1
DELETE /tasks/1     # delete task with id 1
```

### Level 3: HATEOAS
- Level 3 adds hypermedia links to responses.
- The server tells the client what actions are possible next.
- A response contains links like `self`, `update`, or `delete`.
- This makes the API discoverable.

Example:
```json
{
  "id": 1,
  "title": "Learn Express",
  "completed": false,
  "_links": {
    "self": "/tasks/1",
    "update": "/tasks/1",
    "delete": "/tasks/1"
  }
}
```

## Step 2: Analyze the existing API
The existing Task Manager API already uses resource paths and the correct HTTP methods for every CRUD operation.

### GET /tasks
- Uses a resource URL: `/tasks`.
- Uses `GET`, the correct HTTP method for reading data.
- Returns task data in JSON.
- This endpoint satisfies Level 2.

### POST /tasks
- Uses a resource URL: `/tasks`.
- Uses `POST`, the correct HTTP method for creating a resource.
- Returns `201 Created` for success.
- This endpoint satisfies Level 2.

### PUT /tasks/:id
- Uses a resource URL with an identifier: `/tasks/:id`.
- Uses `PUT`, the correct HTTP method for updating a resource.
- Returns `200 OK` for success or `404 Not Found` if the task is missing.
- This endpoint satisfies Level 2.

### DELETE /tasks/:id
- Uses a resource URL with an identifier: `/tasks/:id`.
- Uses `DELETE`, the correct HTTP method for removing a resource.
- Returns `200 OK` for success or `404 Not Found` if the task is missing.
- This endpoint satisfies Level 2.

## Step 3: Maturity Table

| Level | Criterion | Does my API satisfy this? | Evidence |
|---|---|---|---|
| Level 0 | Single endpoint or action-based API, no resource structure | No | The API has separate resource routes like `/tasks` and `/tasks/:id` instead of one generic endpoint. |
| Level 1 | Uses resource URLs for entities | Yes | Routes are defined as `/tasks` and `/tasks/:id` in `routes/taskRoutes.js`. |
| Level 2 | Uses HTTP verbs correctly with resources | Yes | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` are used with `/tasks` and `/tasks/:id` in `routes/taskRoutes.js`. Proper HTTP status codes (201, 200, 400, 404, 500) are returned. |
| Level 3 | Uses HATEOAS links in responses | Yes | **NEW:** All responses include `_links` with dynamically generated URLs pointing to related actions. Implemented in `utils/hateoas.js` and integrated into `controllers/taskController.js`. |

## Step 4: Level 3 HATEOAS Implementation (NEW)

The API now fully implements Richardson Maturity Model Level 3 with HATEOAS support.

### What Changed
1. **Created `utils/hateoas.js`**: Helper module that generates consistent hypermedia links for all tasks.
2. **Updated `controllers/taskController.js`**: All endpoints now include `_links` in responses.
3. **Added PATCH endpoint**: New `PATCH /tasks/:id` route for partial updates.
4. **Structured error responses**: Consistent JSON structure for all responses (success and error).

### HATEOAS Links in Every Response

#### Individual Task Response
Every task includes links to available actions:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Learn Express.js",
  "description": "Master Express fundamentals",
  "completed": false,
  "priority": "high",
  "createdAt": "2024-08-13T10:00:00.000Z",
  "_links": {
    "self": {
      "href": "/tasks/507f1f77bcf86cd799439011",
      "method": "GET"
    },
    "update": {
      "href": "/tasks/507f1f77bcf86cd799439011",
      "method": "PUT"
    },
    "partialUpdate": {
      "href": "/tasks/507f1f77bcf86cd799439011",
      "method": "PATCH"
    },
    "delete": {
      "href": "/tasks/507f1f77bcf86cd799439011",
      "method": "DELETE"
    },
    "collection": {
      "href": "/tasks",
      "method": "GET"
    }
  }
}
```

#### Collection Response
The `/tasks` endpoint now includes collection-level links:

```json
{
  "success": true,
  "count": 2,
  "data": [
    { "..." (task with _links) }
  ],
  "_links": {
    "self": {
      "href": "/tasks",
      "method": "GET"
    },
    "create": {
      "href": "/tasks",
      "method": "POST"
    }
  }
}
```

### How HATEOAS Improves the API

1. **Client Discovery**: A client doesn't need to hardcode URLs like `/tasks/123`. It can follow the `self` link from any task.
2. **Dynamic URLs**: If the API structure changes, links remain consistent because they're generated server-side.
3. **Self-Documenting**: Each link includes a `method` property, telling the client exactly how to use it.
4. **Flexibility**: New actions can be added without breaking existing clients — clients simply follow the provided links.

### Example Client Flow (HATEOAS in Action)

```
1. Client requests: GET /tasks
2. Server responds with list of tasks, each with _links
3. Client picks a task and follows the "partialUpdate" link
4. Client sends: PATCH /tasks/507f1f77bcf86cd799439011 with { "completed": true }
5. Server responds with updated task and new _links
6. Client follows "collection" link to get all tasks again
```

Without HATEOAS, the client would need to know the URL patterns in advance. With HATEOAS, the server tells the client where to go next.

## Step 5: Endpoints After Upgrade

The API now supports these fully maturity-compliant endpoints:

| Method | Path | Description | Status Codes |
|--------|------|-------------|--------------|
| `GET` | `/tasks` | List all tasks with HATEOAS links | 200 |
| `GET` | `/tasks/:id` | Retrieve a single task with HATEOAS links | 200, 404, 400 |
| `POST` | `/tasks` | Create a new task and return with HATEOAS links | 201, 400 |
| `PUT` | `/tasks/:id` | Full update (all fields must be provided) | 200, 404, 400 |
| `PATCH` | `/tasks/:id` | Partial update (only specified fields) | 200, 404, 400 |
| `DELETE` | `/tasks/:id` | Delete a task, return collection link | 200, 404 |

---

## Comparison: Before and After

### Before This Upgrade
- ✅ Level 1: Resource-oriented URLs
- ✅ Level 2: HTTP methods and status codes
- ❌ Level 3: No HATEOAS links
- ❌ No PATCH endpoint
- ❌ Responses lacked hypermedia guidance

### After This Upgrade
- ✅ Level 1: Resource-oriented URLs
- ✅ Level 2: HTTP methods and status codes
- ✅ **Level 3: Full HATEOAS implementation with dynamic links**
- ✅ **PATCH endpoint for partial updates**
- ✅ **All responses include actionable hypermedia links**
- ✅ **Structured error responses**
- ✅ **Production-ready error handling**

## HATEOAS Awareness

### What is HATEOAS?
HATEOAS stands for Hypermedia As The Engine Of Application State.
It means the API response includes links that tell the client what actions it can take next.
These links are part of the response data and help the client discover available operations.

### Why HATEOAS is Level 3
- Level 3 is about making the API self-describing.
- The client does not need hard-coded URI patterns for every action.
- The server provides links like `self`, `update`, and `delete` inside the response.
- This is the final step of the Richardson Model.

### Example JSON with HATEOAS awareness
```json
{
  "id": 1,
  "title": "Learn Express",
  "_links": {
    "self": "/tasks/1",
    "update": "/tasks/1",
    "delete": "/tasks/1"
  }
}
```

#### Link explanations
- `self`: points to the resource itself (`/tasks/1`). The client can use it to retrieve the current task.
- `update`: points to the same resource URI and tells the client where to send an update request.
- `delete`: points to the same resource URI and tells the client where to send the delete request.

## Why most production REST APIs stop at Level 2
Most production REST APIs stop at Level 2 because it is simpler and easier to use.
Level 2 already gives a clear structure with resource URLs and standard HTTP methods.
Adding Level 3 means extra response data and more complexity in both server and client code.
Many developers prefer to keep APIs easy to understand and maintain, so they stop before full HATEOAS.

## Reflection

### What was learned
- The Richardson Model is a useful way to measure how RESTful an API is.
- Level 1 is about using resource paths.
- Level 2 is about using HTTP verbs correctly.
- Level 3 is about adding hypermedia links.

### What improvements were made
- Verified the API already follows Level 2 principles.
- Documented the current implementation clearly.
- Confirmed that no unnecessary code changes were needed.

### Challenges faced
- Ensuring the evaluation was precise and beginner-friendly.
- Separating Level 2 compliance from Level 3 awareness without confusing the two.

### How the API became more RESTful
- The analysis confirmed the API is resource-oriented.
- The use of standard HTTP methods made the design clean.
- The documentation now explains how the API fits into the Richardson model.

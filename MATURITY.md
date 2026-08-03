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
| Level 2 | Uses HTTP verbs correctly with resources | Yes | `GET`, `POST`, `PUT`, `DELETE` are used with `/tasks` and `/tasks/:id` in `routes/taskRoutes.js`. |
| Level 3 | Uses HATEOAS links in responses | No | Responses in `controllers/taskController.js` return task objects and messages, but no `_links` section. |

## Step 4: Level 2 Compliance
The API already satisfies Level 2. No code changes were required for Richardson Level 2 compliance.

### Why no changes were needed
- The routes are resource-based.
- The correct HTTP methods are used for create, read, update, and delete.
- Status codes are appropriate for success and error cases.

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

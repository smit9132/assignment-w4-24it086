# Task Manager API

A beginner-friendly REST API built with Node.js and Express.js.
The API uses an in-memory array for tasks and does not use any database.

## Project Structure

- `server.js` - Main Express application setup
- `routes/taskRoutes.js` - API route definitions
- `controllers/taskController.js` - Controller functions with business logic
- `middleware/logger.js` - Request logging middleware
- `middleware/errorHandler.js` - Global error handling middleware
- `data/tasks.js` - In-memory task storage array

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
node server.js
```

3. Open the API in your browser or API client:

```text
http://localhost:3000/
```

## Available Endpoints

### GET /

- Returns a simple status message.
- Response:

```text
Task Manager API Running
```

### GET /tasks

- Returns all tasks.
- Status: `200 OK`

### POST /tasks

- Creates a new task.
- Request body example:

```json
{
  "title": "New Task"
}
```

- Status: `201 Created`

### PUT /tasks/:id

- Updates a task by id.
- Request body example:

```json
{
  "title": "Updated Task",
  "completed": true
}
```

- Status: `200 OK`

### DELETE /tasks/:id

- Deletes a task by id.
- Status: `200 OK`

## Notes

- `express.json()` is required for parsing JSON request bodies.
- The task data is stored in memory only and resets when the server restarts.
- Use Postman or Thunder Client to send HTTP requests easily.

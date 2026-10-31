const request = require("supertest");
const mongoose = require("mongoose");
const { resetRateLimiter } = require("./middleware/aiRateLimiter");

const mockCreateChatCompletion = jest.fn();

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: mockCreateChatCompletion,
        },
      },
    };
  });
});

jest.mock("./models/User", () => ({
  findOne: jest.fn(async (filter) => {
    if (filter && filter.email) {
      if (filter.email === "existing@example.com") {
        return {
          _id: "user1",
          email: "existing@example.com",
          password: "$2b$10$dummyhash",
        };
      }
      return null;
    }
    return null;
  }),
  create: jest.fn(async (userData) => {
    return {
      _id: "user1",
      email: userData.email,
      password: "$2b$10$dummyhash",
    };
  }),
}));

jest.mock("./models/Task", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

let app;
let server;

beforeAll((done) => {
  const { app: expressApp } = require("./server");
  app = expressApp;
  server = app.listen(5001, done);
});

afterAll((done) => {
  server.close(() => {
    if (mongoose.connection.readyState !== 0) {
      mongoose.disconnect().then(() => done()).catch(() => done());
    } else {
      done();
    }
  });
});

beforeEach(async () => {
  resetRateLimiter();
  mockCreateChatCompletion.mockReset();
  const db = mongoose.connection;
  if (db.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/taskdb_test");
    } catch (err) {
      // MongoDB connection failure should not block mocked tests
    }
  }
  if (db.readyState === 1) {
    try {
      await db.dropDatabase();
    } catch (err) {
      // ignore
    }
  }
});

afterEach(async () => {
  const db = mongoose.connection;
  if (db.readyState === 1) {
    try {
      await db.dropDatabase();
    } catch (err) {
      // ignore
    }
  }
});

describe("GET /tasks without authentication", () => {
  it("should return 401 when authentication header is missing", async () => {
    await request(app).get("/tasks").expect(401);
  });
});

describe("POST /tasks without authentication", () => {
  it("should return 401 when authentication header is missing", async () => {
    await request(app).post("/tasks").send({ title: "Test task" }).expect(401);
  });
});

describe("POST /register", () => {
  it("should register a new user", async () => {
    await request(app).post("/register").send({
      email: "newuser@example.com",
      password: "password123",
    }).expect(201);
  });

  it("should return 400 when email is missing", async () => {
    await request(app).post("/register").send({
      password: "password123",
    }).expect(400);
  });

  it("should return 400 when password is missing", async () => {
    await request(app).post("/register").send({
      email: "test@example.com",
    }).expect(400);
  });
});

describe("POST /login", () => {
  beforeEach(async () => {
    await request(app).post("/register").send({
      email: "existing@example.com",
      password: "password123",
    });
  });

  it("should return 401 with invalid credentials", async () => {
    const res = await request(app).post("/login").send({
      email: "existing@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });
});

describe("POST /api/ai/generate-description", () => {
  const originalKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    resetRateLimiter();
    mockCreateChatCompletion.mockReset();
    process.env.OPENAI_API_KEY = "test_openai_active_key_12345";
  });

  afterAll(() => {
    process.env.OPENAI_API_KEY = originalKey;
  });

  it("should generate a task description when a valid title is provided", async () => {
    mockCreateChatCompletion.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: "Complete the assigned DBMS exercises including schema design and SQL optimization queries.",
          },
        },
      ],
    });

    const res = await request(app)
      .post("/api/ai/generate-description")
      .send({ title: "Complete DBMS assignment" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.description).toContain("Complete the assigned DBMS exercises");
  });

  it("should return 400 when task title is empty or missing", async () => {
    const res = await request(app)
      .post("/api/ai/generate-description")
      .send({ title: "   " });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title is required/i);
  });

  it("should enforce rate limiting on repeated requests for the same task title within one minute", async () => {
    mockCreateChatCompletion.mockResolvedValue({
      choices: [
        {
          message: {
            content: "Task description draft.",
          },
        },
      ],
    });

    const firstRes = await request(app)
      .post("/api/ai/generate-description")
      .send({ title: "Rate Limit Test Task" });
    expect(firstRes.status).toBe(200);

    const secondRes = await request(app)
      .post("/api/ai/generate-description")
      .send({ title: "Rate Limit Test Task" });
    expect(secondRes.status).toBe(429);
    expect(secondRes.body.success).toBe(false);
    expect(secondRes.body.message).toMatch(/rate limit/i);
  });

  it("should return fallback description gracefully when API key is missing or placeholder", async () => {
    process.env.OPENAI_API_KEY = "";

    const res = await request(app)
      .post("/api/ai/generate-description")
      .send({ title: "Prepare weekly status presentation" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isFallback).toBe(true);
    expect(res.body.description).toContain("Prepare weekly status presentation");
    expect(mockCreateChatCompletion).not.toHaveBeenCalled();
  });

  it("should return fallback description without crashing when OpenAI service encounters an error or timeout", async () => {
    mockCreateChatCompletion.mockRejectedValueOnce(new Error("Request timed out after 10000ms"));

    const res = await request(app)
      .post("/api/ai/generate-description")
      .send({ title: "Deploy application with Docker Compose" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isFallback).toBe(true);
    expect(res.body.description).toContain("Deploy application with Docker Compose");
  });
});

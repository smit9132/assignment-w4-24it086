const request = require("supertest");
const mongoose = require("mongoose");

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
  server.close(done);
});

beforeEach((done) => {
  const db = mongoose.connection;
  if (db.readyState === 0) {
    mongoose.connect("mongodb://localhost:27017/taskdb_test", {});
  }
  db.dropDatabase();
  done();
});

afterEach((done) => {
  const db = mongoose.connection;
  db.dropDatabase();
  done();
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
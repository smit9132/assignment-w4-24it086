module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: [
    "server.js",
    "routes/*.js",
    "middleware/*.js",
    "!**/node_modules/*",
  ],
};
const BASE_URL = "http://localhost:5000";
const TOKEN_KEY = "taskManagerToken";
export const AUTH_EXPIRED_EVENT = "task-manager:auth-expired";

export const getAuthToken = () => window.localStorage.getItem(TOKEN_KEY);

export const logout = () => window.localStorage.removeItem(TOKEN_KEY);

const request = async (path, options = {}, authenticated = true) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const token = authenticated ? getAuthToken() : null;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (response.status === 401 && authenticated) {
    logout();
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  return payload;
};

export const login = async (credentials) => {
  const response = await request("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, false);

  if (typeof response.token !== "string" || !response.token) {
    throw new Error("The login response did not include an authentication token.");
  }

  window.localStorage.setItem(TOKEN_KEY, response.token);
  return response.token;
};

export const registerUser = (credentials) => request("/register", {
  method: "POST",
  body: JSON.stringify(credentials),
}, false);

export const getTasks = async () => {
  const response = await request("/tasks");
  return response.data || [];
};

export const createTask = async (task) => {
  const response = await request("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
  return response.data;
};

export const deleteTask = async (id) => request(`/tasks/${id}`, { method: "DELETE" });

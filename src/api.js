const BASE_URL = "http://localhost:5000";

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "The request could not be completed.");
  }

  return payload;
};

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

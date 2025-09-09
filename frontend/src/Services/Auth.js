const API_URL = "http://localhost:8000/api/auth"; // adjust if your backend port/route is different

// Login request
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  const data = await res.json();
  localStorage.setItem("token", data.token); // save token for authenticated requests
  return data;
}

// Register request
export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

// Helper: get current token
export function getToken() {
  return localStorage.getItem("token");
}

// Helper: logout
export function logout() {
  localStorage.removeItem("token");
}

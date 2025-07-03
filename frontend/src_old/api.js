const API_BASE = "/api"; // Proxy to backend or use full URL

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

export async function fetchDepartments() {
  const res = await fetch(`${API_BASE}/departments`);
  return res.json();
}

// ...add more as needed

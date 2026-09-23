const API = "http://localhost:8080";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      (data && data.message) ||
      (data && data.error) ||
      (typeof data === "string" && data) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  login: (username, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),

  searchBooks: (keyword = "") =>
    request(`/books/search?keyword=${encodeURIComponent(keyword)}`),

  addBook: (book) =>
    request("/books", {
      method: "POST",
      body: JSON.stringify(book)
    }),

  getBorrows: () => request("/borrows"),

  borrowBook: (bookId, days) =>
    request("/borrows", {
      method: "POST",
      body: JSON.stringify({ bookId: Number(bookId), days: Number(days) })
    }),

  returnBook: (borrowId) =>
    request(`/borrows/${borrowId}/return`, {
      method: "POST"
    }),

  getFines: (userId) => request(`/fines/user/${userId}`)
};
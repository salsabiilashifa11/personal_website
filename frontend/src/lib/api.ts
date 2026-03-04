const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface About {
  id: number;
  content: string;
  tagline: string; // newline-separated list of rotating items
}

export interface Experience {
  id: number;
  title: string;
  organization: string;
  logo_url: string;
  type: "professional" | "education";
  start_date: string;
  end_date: string;
  description: string;
  order: number;
}

export interface Writing {
  id: number;
  title: string;
  medium_url: string;
  published_at: string;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  cover_url: string;
  status: "read" | "reading" | "will_read";
  created_at: string;
}

export interface BooksGrouped {
  reading: Book[];
  read: Book[];
  will_read: Book[];
}

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// Public
export const getAbout = () => fetchJSON<About>("/about");
export const getExperiences = () => fetchJSON<Experience[]>("/experiences");
export const getWritings = () => fetchJSON<Writing[]>("/writings");
export const getBooks = () => fetchJSON<BooksGrouped>("/books");

// Admin helpers
function adminHeaders(password: string) {
  return { "X-Admin-Password": password };
}

export async function uploadFile(password: string, file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { "X-Admin-Password": password },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }
  const data: { url: string } = await res.json();
  // Return an absolute URL so Next.js Image can load it
  const base = API_BASE.replace(/\/api$/, "");
  return data.url.startsWith("http") ? data.url : `${base}${data.url}`;
}

export const updateAbout = (password: string, content: string, tagline: string) =>
  fetchJSON<About>("/about", {
    method: "PUT",
    headers: adminHeaders(password),
    body: JSON.stringify({ content, tagline }),
  });

export const createExperience = (password: string, data: Omit<Experience, "id">) =>
  fetchJSON<Experience>("/experiences", {
    method: "POST",
    headers: adminHeaders(password),
    body: JSON.stringify(data),
  });

export const updateExperience = (password: string, id: number, data: Partial<Experience>) =>
  fetchJSON<Experience>(`/experiences/${id}`, {
    method: "PUT",
    headers: adminHeaders(password),
    body: JSON.stringify(data),
  });

export const deleteExperience = (password: string, id: number) =>
  fetchJSON<{ message: string }>(`/experiences/${id}`, {
    method: "DELETE",
    headers: adminHeaders(password),
  });

export const createWriting = (password: string, data: { title: string; medium_url: string; published_at: string }) =>
  fetchJSON<Writing>("/writings", {
    method: "POST",
    headers: adminHeaders(password),
    body: JSON.stringify(data),
  });

export const updateWriting = (password: string, id: number, data: { title?: string; medium_url?: string; published_at?: string }) =>
  fetchJSON<Writing>(`/writings/${id}`, {
    method: "PUT",
    headers: adminHeaders(password),
    body: JSON.stringify(data),
  });

export const deleteWriting = (password: string, id: number) =>
  fetchJSON<{ message: string }>(`/writings/${id}`, {
    method: "DELETE",
    headers: adminHeaders(password),
  });

export const createBook = (password: string, data: { title: string; author: string; cover_url: string; status: string }) =>
  fetchJSON<Book>("/books", {
    method: "POST",
    headers: adminHeaders(password),
    body: JSON.stringify(data),
  });

export const updateBook = (password: string, id: number, data: Partial<Book>) =>
  fetchJSON<Book>(`/books/${id}`, {
    method: "PUT",
    headers: adminHeaders(password),
    body: JSON.stringify(data),
  });

export const deleteBook = (password: string, id: number) =>
  fetchJSON<{ message: string }>(`/books/${id}`, {
    method: "DELETE",
    headers: adminHeaders(password),
  });

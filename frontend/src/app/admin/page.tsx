"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAbout, updateAbout,
  getExperiences, createExperience, updateExperience, deleteExperience,
  getWritings, createWriting, updateWriting, deleteWriting,
  getBooks, createBook, updateBook, deleteBook, uploadFile,
  Experience, Writing, Book,
} from "@/lib/api";

type Tab = "about" | "experiences" | "writings" | "books";

const TAB_META: Record<Tab, { label: string; active: string; indicator: string }> = {
  about:       { label: "About",       active: "text-google-blue border-google-blue",   indicator: "bg-google-blue" },
  experiences: { label: "Experiences", active: "text-google-red border-google-red",     indicator: "bg-google-red" },
  writings:    { label: "Writings",    active: "text-google-yellow border-google-yellow", indicator: "bg-google-yellow" },
  books:       { label: "Books",       active: "text-google-green border-google-green",  indicator: "bg-google-green" },
};

// ── Shared input styles ──────────────────────────────
const inputCls = "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue transition";
const selectCls = inputCls;
const textareaCls = `${inputCls} resize-y`;

function Btn({ children, onClick, variant = "primary", color = "blue", disabled }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  color?: "blue" | "red" | "yellow" | "green";
  disabled?: boolean;
}) {
  const colors = {
    blue:   { primary: "bg-google-blue text-white hover:opacity-90",   ghost: "text-google-blue hover:bg-blue-50 dark:hover:bg-blue-950/40" },
    red:    { primary: "bg-google-red text-white hover:opacity-90",    ghost: "text-google-red hover:bg-red-50 dark:hover:bg-red-950/40" },
    yellow: { primary: "bg-google-yellow text-gray-900 hover:opacity-90", ghost: "text-google-yellow hover:bg-yellow-50 dark:hover:bg-yellow-950/40" },
    green:  { primary: "bg-google-green text-white hover:opacity-90",  ghost: "text-google-green hover:bg-green-50 dark:hover:bg-green-950/40" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${colors[color][variant]}`}
    >
      {children}
    </button>
  );
}

function FormCard({ children, title, color }: { children: React.ReactNode; title: string; color: string }) {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-card p-5">
      <h3 className={`font-pixel text-[9px] ${color} mb-4`}>{title}</h3>
      {children}
    </div>
  );
}

function ItemRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-lg border border-gray-100 dark:border-gray-800 px-4 py-3 flex items-start justify-between gap-3">
      <div className="min-w-0">{left}</div>
      <div className="flex gap-2 shrink-0">{right}</div>
    </div>
  );
}

function Msg({ text }: { text: string }) {
  if (!text) return null;
  const isErr = text.toLowerCase().includes("error");
  return (
    <span className={`text-xs font-mono ${isErr ? "text-google-red" : "text-google-green"}`}>
      {text}
    </span>
  );
}

// ── Password gate ────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <p className="font-mono text-xs text-google-green tracking-widest uppercase">Admin</p>
      <h1 className="font-pixel text-lg text-gray-900 dark:text-gray-100">Access Required</h1>
      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-card p-8 flex flex-col gap-4 w-full max-w-sm">
        <label className="text-sm text-gray-600 dark:text-gray-400">Password</label>
        <input
          type="password"
          className={inputCls}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pw && onAuth(pw)}
          autoFocus
        />
        <Btn color="green" onClick={() => pw && onAuth(pw)}>
          Continue →
        </Btn>
      </div>
    </div>
  );
}

// ── About tab ────────────────────────────────────────
function AboutTab({ password }: { password: string }) {
  const [content, setContent] = useState("");
  const [tagline, setTagline] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getAbout().then((a) => { setContent(a.content); setTagline(a.tagline ?? ""); }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true); setMsg("");
    try { await updateAbout(password, content, tagline); setMsg("Saved!"); }
    catch { setMsg("Error saving — check password."); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <FormCard title="Bio" color="text-google-blue">
        <textarea
          className={`${textareaCls} h-40 mb-4`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your bio here..."
        />
        <div className="flex items-center gap-3">
          <Btn color="blue" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
          <Msg text={msg} />
        </div>
      </FormCard>

      <FormCard title="Tagline items" color="text-google-blue">
        <p className="text-xs text-gray-400 mb-3">One item per line — they cycle with a typing effect on the home page.</p>
        <textarea
          className={`${textareaCls} h-32 mb-4 font-mono`}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder={"software engineer\ncurious human\nreads too many books"}
        />
        <div className="flex items-center gap-3">
          <Btn color="blue" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
          <Msg text={msg} />
        </div>
      </FormCard>
    </div>
  );
}

// ── Experiences tab ──────────────────────────────────
const EMPTY_EXP: Omit<Experience, "id"> = { title: "", organization: "", logo_url: "", type: "professional", start_date: "", end_date: "", description: "", order: 0 };

function ExperiencesTab({ password }: { password: string }) {
  const [list, setList] = useState<Experience[]>([]);
  const [form, setForm] = useState<Omit<Experience, "id">>(EMPTY_EXP);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => { setList(await getExperiences().catch(() => [])); }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    setMsg("");
    try {
      if (editingId !== null) await updateExperience(password, editingId, form);
      else await createExperience(password, form);
      setForm(EMPTY_EXP); setEditingId(null); load();
      setMsg(editingId !== null ? "Updated!" : "Created!");
    } catch { setMsg("Error — check password."); }
  };

  const startEdit = (exp: Experience) => { const { id, ...rest } = exp; setEditingId(id); setForm(rest); };
  const remove = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    try { await deleteExperience(password, id); load(); } catch { setMsg("Error deleting."); }
  };

  return (
    <div className="space-y-6">
      <FormCard title={editingId ? "Edit Experience" : "Add Experience"} color="text-google-red">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={inputCls} placeholder="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          <input className={`${inputCls} col-span-full`} placeholder="Logo URL (optional)" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
          <select className={selectCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "professional" | "education" })}>
            <option value="professional">Professional</option>
            <option value="education">Education</option>
          </select>
          <input className={inputCls} placeholder="Start (YYYY-MM)" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <input className={inputCls} placeholder="End (YYYY-MM or Present)" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          <input className={inputCls} type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <textarea className={`${textareaCls} col-span-full h-20`} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex items-center gap-3">
          <Btn color="red" onClick={submit}>{editingId ? "Update" : "Add"}</Btn>
          {editingId && <Btn color="red" variant="ghost" onClick={() => { setEditingId(null); setForm(EMPTY_EXP); }}>Cancel</Btn>}
          <Msg text={msg} />
        </div>
      </FormCard>

      <div className="space-y-2">
        {list.map((exp) => (
          <ItemRow key={exp.id}
            left={<>
              <span className="inline-block font-mono text-[10px] text-google-red bg-red-50 px-1.5 py-0.5 rounded mb-1">{exp.type}</span>
              <p className="text-sm font-semibold text-gray-900">{exp.title}</p>
              <p className="font-mono text-xs text-gray-500">{exp.organization} · {exp.start_date} – {exp.end_date}</p>
            </>}
            right={<>
              <Btn color="blue" variant="ghost" onClick={() => startEdit(exp)}>Edit</Btn>
              <Btn color="red" variant="ghost" onClick={() => remove(exp.id)}>Delete</Btn>
            </>}
          />
        ))}
        {list.length === 0 && <p className="text-sm text-gray-400 italic">No experiences yet.</p>}
      </div>
    </div>
  );
}

// ── Writings tab ─────────────────────────────────────
function WritingsTab({ password }: { password: string }) {
  const [list, setList] = useState<Writing[]>([]);
  const [form, setForm] = useState({ title: "", medium_url: "", published_at: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => { setList(await getWritings().catch(() => [])); }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    setMsg("");
    try {
      if (editingId !== null) await updateWriting(password, editingId, form);
      else await createWriting(password, form);
      setForm({ title: "", medium_url: "", published_at: "" }); setEditingId(null); load();
      setMsg(editingId !== null ? "Updated!" : "Created!");
    } catch { setMsg("Error — check password."); }
  };

  const startEdit = (w: Writing) => {
    setEditingId(w.id);
    setForm({ title: w.title, medium_url: w.medium_url, published_at: w.published_at ? new Date(w.published_at).toISOString().split("T")[0] : "" });
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this writing?")) return;
    try { await deleteWriting(password, id); load(); } catch { setMsg("Error deleting."); }
  };

  return (
    <div className="space-y-6">
      <FormCard title={editingId ? "Edit Writing" : "Add Writing"} color="text-google-yellow">
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={inputCls} placeholder="Medium URL" value={form.medium_url} onChange={(e) => setForm({ ...form, medium_url: e.target.value })} />
          <input className={inputCls} type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
        </div>
        <div className="flex items-center gap-3">
          <Btn color="yellow" onClick={submit}>{editingId ? "Update" : "Add"}</Btn>
          {editingId && <Btn color="yellow" variant="ghost" onClick={() => { setEditingId(null); setForm({ title: "", medium_url: "", published_at: "" }); }}>Cancel</Btn>}
          <Msg text={msg} />
        </div>
      </FormCard>

      <div className="space-y-2">
        {list.map((w) => (
          <ItemRow key={w.id}
            left={<>
              <p className="text-sm font-semibold text-gray-900">{w.title}</p>
              <p className="font-mono text-xs text-gray-400">{new Date(w.published_at).toLocaleDateString()}</p>
            </>}
            right={<>
              <Btn color="blue" variant="ghost" onClick={() => startEdit(w)}>Edit</Btn>
              <Btn color="red" variant="ghost" onClick={() => remove(w.id)}>Delete</Btn>
            </>}
          />
        ))}
        {list.length === 0 && <p className="text-sm text-gray-400 italic">No writings yet.</p>}
      </div>
    </div>
  );
}

// ── Books tab ────────────────────────────────────────
function BooksTab({ password }: { password: string }) {
  const [list, setList] = useState<Book[]>([]);
  const [form, setForm] = useState<{ title: string; author: string; cover_url: string; status: "read" | "reading" | "will_read" }>({ title: "", author: "", cover_url: "", status: "will_read" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const d = await getBooks().catch(() => ({ reading: [], read: [], will_read: [] }));
    setList([...d.reading, ...d.read, ...d.will_read]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      const url = await uploadFile(password, file);
      setForm((f) => ({ ...f, cover_url: url }));
    } catch {
      setMsg("Upload failed — check password.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const submit = async () => {
    setMsg("");
    try {
      if (editingId !== null) await updateBook(password, editingId, form);
      else await createBook(password, form);
      setForm({ title: "", author: "", cover_url: "", status: "will_read" as const }); setEditingId(null); load();
      setMsg(editingId !== null ? "Updated!" : "Created!");
    } catch { setMsg("Error — check password."); }
  };

  const startEdit = (b: Book) => { setEditingId(b.id); setForm({ title: b.title, author: b.author, cover_url: b.cover_url, status: b.status }); };
  const remove = async (id: number) => {
    if (!confirm("Delete this book?")) return;
    try { await deleteBook(password, id); load(); } catch { setMsg("Error deleting."); }
  };

  const statusColors: Record<string, string> = { reading: "text-google-blue bg-blue-50", read: "text-google-green bg-green-50", will_read: "text-gray-500 bg-gray-100" };

  return (
    <div className="space-y-6">
      <FormCard title={editingId ? "Edit Book" : "Add Book"} color="text-google-green">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={inputCls} placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />

          {/* Cover image — URL or file upload */}
          <div className="col-span-full space-y-2">
            <div className="flex gap-2 items-center">
              <input
                className={`${inputCls} flex-1`}
                placeholder="Cover image URL (optional)"
                value={form.cover_url}
                onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
              />
              <span className="text-xs text-gray-400 shrink-0">or</span>
              <label className={`shrink-0 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                {uploading ? "Uploading…" : "Upload file"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>
            </div>
            {/* Preview */}
            {form.cover_url && (
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.cover_url} alt="Cover preview" className="w-10 h-14 object-cover rounded border border-gray-200" />
                <button className="text-xs text-gray-400 hover:text-google-red transition" onClick={() => setForm({ ...form, cover_url: "" })}>Remove</button>
              </div>
            )}
          </div>

          <select className={selectCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "read" | "reading" | "will_read" })}>
            <option value="will_read">Will Read</option>
            <option value="reading">Reading</option>
            <option value="read">Read</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Btn color="green" onClick={submit}>{editingId ? "Update" : "Add"}</Btn>
          {editingId && <Btn color="green" variant="ghost" onClick={() => { setEditingId(null); setForm({ title: "", author: "", cover_url: "", status: "will_read" as const }); }}>Cancel</Btn>}
          <Msg text={msg} />
        </div>
      </FormCard>

      <div className="space-y-2">
        {list.map((b) => (
          <ItemRow key={b.id}
            left={<>
              <span className={`inline-block font-mono text-[10px] px-1.5 py-0.5 rounded mb-1 ${statusColors[b.status] ?? ""}`}>{b.status}</span>
              <p className="text-sm font-semibold text-gray-900">{b.title}</p>
              <p className="font-mono text-xs text-gray-500">{b.author}</p>
            </>}
            right={<>
              <Btn color="blue" variant="ghost" onClick={() => startEdit(b)}>Edit</Btn>
              <Btn color="red" variant="ghost" onClick={() => remove(b.id)}>Delete</Btn>
            </>}
          />
        ))}
        {list.length === 0 && <p className="text-sm text-gray-400 italic">No books yet.</p>}
      </div>
    </div>
  );
}

// ── Main admin page ──────────────────────────────────
const TABS: Tab[] = ["about", "experiences", "writings", "books"];

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("about");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password");
    if (saved) setPassword(saved);
  }, []);

  const handleAuth = (pw: string) => { sessionStorage.setItem("admin_password", pw); setPassword(pw); };

  if (!password) return <PasswordGate onAuth={handleAuth} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-google-green tracking-widest uppercase mb-1">Admin</p>
          <h1 className="font-pixel text-lg text-gray-900 dark:text-gray-100">Panel</h1>
        </div>
        <button
          className="text-sm text-gray-400 dark:text-gray-500 hover:text-google-red transition-colors font-mono"
          onClick={() => { sessionStorage.removeItem("admin_password"); setPassword(null); }}
        >
          Sign out →
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const meta = TAB_META[tab];
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                active ? meta.active : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              {meta.label}
              {active && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${meta.indicator}`} />}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === "about" && <AboutTab password={password} />}
        {activeTab === "experiences" && <ExperiencesTab password={password} />}
        {activeTab === "writings" && <WritingsTab password={password} />}
        {activeTab === "books" && <BooksTab password={password} />}
      </div>
    </div>
  );
}

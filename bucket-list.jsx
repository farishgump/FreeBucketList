import { useState, useMemo } from "react";

const CATEGORIES = ["Travel", "Adventure", "Learning", "Career", "Personal", "Social", "Creative", "Health"];
const STATUSES = ["Dream", "Planning", "In Progress", "Done"];

const STATUS_STYLES = {
  "Dream": { bg: "#1a1a2e", border: "#6c63ff", text: "#a99dff", dot: "#6c63ff" },
  "Planning": { bg: "#1a2e1a", border: "#4ade80", text: "#86efac", dot: "#4ade80" },
  "In Progress": { bg: "#2e1a00", border: "#fb923c", text: "#fdba74", dot: "#fb923c" },
  "Done": { bg: "#1a1a1a", border: "#6b7280", text: "#9ca3af", dot: "#22c55e" },
};

const CATEGORY_ICONS = {
  Travel: "✈️", Adventure: "🧗", Learning: "📚", Career: "💼",
  Personal: "🌱", Social: "👥", Creative: "🎨", Health: "💪"
};

const SAMPLE_ITEMS = [
  { id: 1, title: "See the Northern Lights", category: "Travel", status: "Dream", note: "Iceland or Norway in winter", date: "2024-01-15" },
  { id: 2, title: "Learn to play guitar", category: "Creative", status: "In Progress", note: "Taking lessons every Tuesday", date: "2024-03-01" },
  { id: 3, title: "Run a half marathon", category: "Health", status: "Planning", note: "Training plan starts in June", date: "2024-02-10" },
  { id: 4, title: "Visit the Louvre", category: "Travel", status: "Done", note: "Amazing trip! Mona Lisa was smaller than expected 😄", date: "2023-11-20" },
  { id: 5, title: "Start a journal habit", category: "Personal", status: "Done", note: "Going strong for 6 months", date: "2023-09-05" },
];

let nextId = 6;

function Modal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || { title: "", category: "Travel", status: "Dream", note: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
      <div style={{ background: "#111", border: "1px solid #333", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "480px", fontFamily: "'Playfair Display', serif" }}>
        <h2 style={{ margin: "0 0 24px", color: "#f5f0e8", fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          {item ? "Edit Dream" : "Add to Bucket List"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "#999", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="What's your dream?"
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", padding: "12px 14px", color: "#f5f0e8", fontSize: "1rem", outline: "none", fontFamily: "'Playfair Display', serif", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", color: "#999", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", padding: "12px 14px", color: "#f5f0e8", fontSize: "0.9rem", outline: "none" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: "#999", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", padding: "12px 14px", color: "#f5f0e8", fontSize: "0.9rem", outline: "none" }}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", color: "#999", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>Notes</label>
            <textarea value={form.note} onChange={e => set("note", e.target.value)}
              placeholder="Any details, plans, or thoughts..."
              rows={3}
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", padding: "12px 14px", color: "#f5f0e8", fontSize: "0.9rem", outline: "none", resize: "vertical", fontFamily: "'Playfair Display', serif", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #333", borderRadius: "10px", color: "#999", fontSize: "0.95rem", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={() => { if (form.title.trim()) onSave(form); }}
            style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #6c63ff, #a855f7)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "0.95rem", cursor: "pointer", fontWeight: "600" }}>
            {item ? "Save Changes" : "Add Dream ✨"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BucketList() {
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const [selected, setSelected] = useState(new Set());
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | item
  const [selectMode, setSelectMode] = useState(false);

  const sorted = useMemo(() => {
    let list = [...items];
    if (search) list = list.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || (i.note || "").toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== "All") list = list.filter(i => i.status === filterStatus);
    if (filterCategory !== "All") list = list.filter(i => i.category === filterCategory);
    if (sortBy === "date") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "status") list.sort((a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status));
    if (sortBy === "category") list.sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [items, search, filterStatus, filterCategory, sortBy]);

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter(i => i.status === "Done").length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [items]);

  const toggleSelect = (id) => {
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const deleteSelected = () => {
    setItems(i => i.filter(x => !selected.has(x.id)));
    setSelected(new Set());
    setSelectMode(false);
  };

  const deleteOne = (id) => setItems(i => i.filter(x => x.id !== id));

  const saveItem = (form) => {
    if (modal === "add") {
      setItems(i => [...i, { ...form, id: nextId++, date: new Date().toISOString().split("T")[0] }]);
    } else {
      setItems(i => i.map(x => x.id === modal.id ? { ...x, ...form } : x));
    }
    setModal(null);
  };

  const cycleStatus = (id) => {
    setItems(i => i.map(x => {
      if (x.id !== id) return x;
      const idx = STATUSES.indexOf(x.status);
      return { ...x, status: STATUSES[(idx + 1) % STATUSES.length] };
    }));
  };

  const allSelected = sorted.length > 0 && sorted.every(i => selected.has(i.id));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg, #0f0f1a 0%, #0a0a0a 100%)", padding: "32px 20px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, background: "linear-gradient(135deg, #f5f0e8, #a99dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Bucket List
              </h1>
              <p style={{ margin: "6px 0 0", color: "#666", fontSize: "0.85rem", fontFamily: "'Space Mono', monospace" }}>
                {stats.done}/{stats.total} completed · {stats.pct}%
              </p>
            </div>
            <button onClick={() => setModal("add")}
              style={{ background: "linear-gradient(135deg, #6c63ff, #a855f7)", border: "none", borderRadius: "50px", padding: "12px 20px", color: "#fff", fontSize: "0.9rem", cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(108,99,255,0.4)" }}>
              + Add
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "2px", marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${stats.pct}%`, background: "linear-gradient(90deg, #6c63ff, #22c55e)", borderRadius: "2px", transition: "width 0.5s ease" }} />
          </div>

          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search your dreams..."
            style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "12px 16px", color: "#f5f0e8", fontSize: "0.95rem", outline: "none", fontFamily: "'Space Mono', monospace", marginBottom: "16px", boxSizing: "border-box" }} />

          {/* Filters & Sort */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px", scrollbarWidth: "none" }}>
            {["All", ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: "6px 14px", borderRadius: "50px", border: `1px solid ${filterStatus === s ? "#6c63ff" : "#222"}`, background: filterStatus === s ? "rgba(108,99,255,0.2)" : "transparent", color: filterStatus === s ? "#a99dff" : "#666", fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Space Mono', monospace" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "7px 10px", color: "#999", fontSize: "0.8rem", fontFamily: "'Space Mono', monospace", outline: "none" }}>
          <option value="date">Sort: Date</option>
          <option value="title">Sort: Title</option>
          <option value="status">Sort: Status</option>
          <option value="category">Sort: Category</option>
        </select>

        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "7px 10px", color: "#999", fontSize: "0.8rem", fontFamily: "'Space Mono', monospace", outline: "none" }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
          {selectMode && selected.size > 0 && (
            <button onClick={deleteSelected}
              style={{ padding: "7px 12px", background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", borderRadius: "8px", color: "#f87171", fontSize: "0.8rem", cursor: "pointer" }}>
              Delete ({selected.size})
            </button>
          )}
          <button onClick={() => { setSelectMode(s => !s); setSelected(new Set()); }}
            style={{ padding: "7px 12px", background: selectMode ? "rgba(108,99,255,0.2)" : "transparent", border: `1px solid ${selectMode ? "#6c63ff" : "#222"}`, borderRadius: "8px", color: selectMode ? "#a99dff" : "#666", fontSize: "0.8rem", cursor: "pointer" }}>
            {selectMode ? "Done" : "Select"}
          </button>
        </div>
      </div>

      {/* Select all */}
      {selectMode && sorted.length > 0 && (
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 20px 8px" }}>
          <button onClick={() => allSelected ? setSelected(new Set()) : setSelected(new Set(sorted.map(i => i.id)))}
            style={{ background: "none", border: "none", color: "#6c63ff", cursor: "pointer", fontSize: "0.85rem", fontFamily: "'Space Mono', monospace", padding: 0 }}>
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>
      )}

      {/* List */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 20px 120px" }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#444" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🌟</div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.9rem" }}>No items found.<br />Add your first dream!</p>
          </div>
        )}

        {sorted.map(item => {
          const st = STATUS_STYLES[item.status];
          const isSelected = selected.has(item.id);
          return (
            <div key={item.id}
              onClick={() => selectMode && toggleSelect(item.id)}
              style={{
                background: isSelected ? "rgba(108,99,255,0.1)" : "#111",
                border: `1px solid ${isSelected ? "#6c63ff" : "#1e1e1e"}`,
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "10px",
                cursor: selectMode ? "pointer" : "default",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden"
              }}>
              {/* Category stripe */}
              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", background: st.border, borderRadius: "3px 0 0 3px" }} />

              <div style={{ paddingLeft: "8px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  {selectMode && (
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${isSelected ? "#6c63ff" : "#333"}`, background: isSelected ? "#6c63ff" : "transparent", flexShrink: 0, marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isSelected && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.85rem" }}>{CATEGORY_ICONS[item.category]}</span>
                      <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: item.status === "Done" ? "#666" : "#f5f0e8", textDecoration: item.status === "Done" ? "line-through" : "none", flex: 1 }}>
                        {item.title}
                      </h3>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => !selectMode && cycleStatus(item.id)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", background: st.bg, border: `1px solid ${st.border}`, borderRadius: "50px", color: st.text, fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, flexShrink: 0 }} />
                        {item.status}
                      </button>
                      <span style={{ color: "#444", fontSize: "0.72rem", fontFamily: "'Space Mono', monospace" }}>{item.category}</span>
                    </div>

                    {item.note && <p style={{ margin: "8px 0 0", color: "#666", fontSize: "0.82rem", lineHeight: 1.5, fontFamily: "'Space Mono', monospace" }}>{item.note}</p>}
                  </div>

                  {!selectMode && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                      <button onClick={() => setModal(item)}
                        style={{ padding: "6px 10px", background: "transparent", border: "1px solid #222", borderRadius: "8px", color: "#888", fontSize: "0.75rem", cursor: "pointer" }}>
                        ✏️
                      </button>
                      <button onClick={() => deleteOne(item.id)}
                        style={{ padding: "6px 10px", background: "transparent", border: "1px solid #222", borderRadius: "8px", color: "#888", fontSize: "0.75rem", cursor: "pointer" }}>
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && <Modal item={modal === "add" ? null : modal} onClose={() => setModal(null)} onSave={saveItem} />}
    </div>
  );
}

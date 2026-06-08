/* ===========================================================
   Planla · Yapılacaklar Listesi
   Saf HTML/CSS/JS · veriler tarayıcıda (localStorage) saklanır
   Özellikler: gün/hafta/ay görünümü, tekrarlayan görevler,
   alt görevler, sürükle-bırak sıralama, JSON dışa/içe aktarma
   =========================================================== */

const STORE_KEY = "planla_todos_v2";
const OLD_KEY = "planla_todos_v1";
const THEME_KEY = "planla_theme";

/* ---------- Tarih yardımcıları ---------- */
const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => keyOf(new Date());
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DOW_LONG = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const REPEAT_LABEL = { daily: "Her gün", weekdays: "Hafta içi", weekly: "Her hafta", monthly: "Her ay" };

/* Kategoriler */
const CATS = {
  is:        { label: "İş",        emoji: "💼", color: "#3b82f6" },
  kisisel:   { label: "Kişisel",   emoji: "🌸", color: "#ec4899" },
  egitim:    { label: "Eğitim",    emoji: "📚", color: "#06b6d4" },
  alisveris: { label: "Alışveriş", emoji: "🛒", color: "#f97316" },
  saglik:    { label: "Sağlık",    emoji: "🩺", color: "#10b981" },
};

const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const isoDow = (date) => (date.getDay() + 6) % 7;           // Pazartesi = 0
const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };
function startOfWeek(date) { return addDays(date, -isoDow(date)); }

function prettyDate(k) {
  const d = parseKey(k), t = parseKey(todayKey());
  const diff = Math.round((d - t) / 86400000);
  if (diff === 0) return "Bugün";
  if (diff === 1) return "Yarın";
  if (diff === -1) return "Dün";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${DOW[isoDow(d)]}`;
}

const uid = () =>
  (crypto.randomUUID && crypto.randomUUID()) ||
  Date.now().toString(36) + Math.random().toString(36).slice(2);

/* ---------- Durum ---------- */
let todos = [];
let selectedKey = todayKey();
let dayFilter = "all";
let catFilter = "all";
let formCategory = "";
let view = "day";
let monthCursor = new Date();
let weekCursor = startOfWeek(new Date());
let formPriority = "low";
let currentOccDate = null;  // düzenleme panelini açan günün tarihi

/* ---------- Yükleme + migrasyon ---------- */
function normalize(t) {
  return {
    id: t.id || uid(),
    text: t.text || "",
    date: t.date || todayKey(),
    time: t.time || "",
    note: t.note || "",
    priority: ["low", "med", "high"].includes(t.priority) ? t.priority : "low",
    category: t.category && CATS[t.category] ? t.category : "",
    repeat: ["none","daily","weekdays","weekly","monthly"].includes(t.repeat) ? t.repeat : "none",
    order: typeof t.order === "number" ? t.order : Date.now() + Math.random(),
    subtasks: Array.isArray(t.subtasks) ? t.subtasks.map((s) => ({ id: s.id || uid(), text: s.text || "" })) : [],
    skip: Array.isArray(t.skip) ? t.skip : [],
    state: t.state && typeof t.state === "object" ? t.state : {},
  };
}
function migrateOld(t) {
  const n = normalize(t);
  if (typeof t.done === "boolean" && t.done) n.state[n.date] = { done: true, subs: {} };
  return n;
}
function loadData() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch {}
  if (!raw) {
    let old = null;
    try { old = JSON.parse(localStorage.getItem(OLD_KEY) || "null"); } catch {}
    raw = old ? old.map(migrateOld) : [];
  }
  todos = (raw || []).map(normalize);
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(todos)); }

/* ---------- Tekrar + durum mantığı ---------- */
function occursOn(t, dk) {
  if (dk < t.date) return false;
  if (t.skip.includes(dk)) return false;
  switch (t.repeat) {
    case "daily":    return true;
    case "weekdays": return isoDow(parseKey(dk)) < 5;
    case "weekly":   return isoDow(parseKey(dk)) === isoDow(parseKey(t.date));
    case "monthly":  return parseKey(dk).getDate() === parseKey(t.date).getDate();
    default:         return dk === t.date;
  }
}
const stateOf = (t, dk) => t.state[dk] || null;
const isDone = (t, dk) => !!(stateOf(t, dk) && stateOf(t, dk).done);
function mutState(t, dk) {
  if (!t.state[dk]) t.state[dk] = { done: false, subs: {} };
  if (!t.state[dk].subs) t.state[dk].subs = {};
  return t.state[dk];
}
const subDone = (t, dk, sid) => !!(stateOf(t, dk) && stateOf(t, dk).subs && stateOf(t, dk).subs[sid]);

function byKey(dk) {
  return todos
    .filter((t) => occursOn(t, dk))
    .sort((a, b) =>
      (isDone(a, dk) - isDone(b, dk)) ||
      (a.order - b.order) ||
      (a.time || "99:99").localeCompare(b.time || "99:99"));
}

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const viewDay = $("view-day"), viewWeek = $("view-week"), viewMonth = $("view-month");
const taskList = $("task-list"), dayStrip = $("day-strip");
const dayHeading = $("day-heading"), headerTitle = $("header-title"), headerSub = $("header-sub");
const monthGrid = $("month-grid"), monthTitle = $("month-title");
const weekList = $("week-list"), weekTitle = $("week-title");
const sheet = $("sheet"), backdrop = $("sheet-backdrop"), form = $("task-form");
const toast = $("toast"), subListEl = $("sub-list");

/* =================== GÜN GÖRÜNÜMÜ =================== */
function renderDayStrip() {
  dayStrip.innerHTML = "";
  const base = parseKey(selectedKey);
  for (let i = -3; i <= 10; i++) {
    const d = addDays(base, i), k = keyOf(d);
    const pill = document.createElement("button");
    pill.className = "day-pill";
    if (k === selectedKey) pill.classList.add("active");
    if (k === todayKey()) pill.classList.add("today");
    if (byKey(k).length) pill.classList.add("has-dot");
    pill.innerHTML = `<span class="dow">${DOW[isoDow(d)]}</span><span class="dnum">${d.getDate()}</span><span class="dot"></span>`;
    pill.onclick = () => { selectedKey = k; renderDay(); };
    dayStrip.appendChild(pill);
  }
  const active = dayStrip.querySelector(".active");
  if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
}

function renderCatFilter() {
  const el = $("cat-filter");
  el.innerHTML = "";
  const make = (key, label, color) => {
    const b = document.createElement("button");
    b.className = "cat-chip" + (catFilter === key ? " active" : "");
    b.textContent = label;
    if (catFilter === key && color) b.style.background = color;
    b.onclick = () => { catFilter = key; renderCatFilter(); renderTasks(); };
    el.appendChild(b);
  };
  make("all", "Tümü", "");
  Object.entries(CATS).forEach(([k, c]) => make(k, `${c.emoji} ${c.label}`, c.color));
}

const catChip = (key) => {
  const c = CATS[key];
  return c ? `<span class="chip cat" style="color:${c.color};background:${c.color}22">${c.emoji} ${c.label}</span>` : "";
};

function buildTaskItem(t, dk) {
  const done = isDone(t, dk);
  const li = document.createElement("li");
  li.className = `task-item p-${t.priority}` + (done ? " done" : "");
  li.dataset.id = t.id;

  const subTotal = t.subtasks.length;
  const subDoneCount = t.subtasks.filter((s) => subDone(t, dk, s.id)).length;

  li.innerHTML = `
    <span class="drag-handle" title="Sürükle">⠿</span>
    <input type="checkbox" class="check" ${done ? "checked" : ""}/>
    <div class="task-body">
      <div class="task-title"></div>
      <div class="task-meta">
        ${t.time ? `<span class="chip time">🕑 ${t.time}</span>` : ""}
        ${catChip(t.category)}
        ${t.repeat !== "none" ? `<span class="chip repeat">🔁 ${REPEAT_LABEL[t.repeat]}</span>` : ""}
        ${subTotal ? `<span class="chip subs">☑ ${subDoneCount}/${subTotal}</span>` : ""}
      </div>
      ${subTotal ? `<ul class="subtasks"></ul>` : ""}
      ${t.note ? `<div class="task-note"></div>` : ""}
    </div>`;

  li.querySelector(".task-title").textContent = t.text;
  if (t.note) li.querySelector(".task-note").textContent = t.note;

  // alt görevler
  if (subTotal) {
    const ul = li.querySelector(".subtasks");
    t.subtasks.forEach((s) => {
      const sli = document.createElement("li");
      const checked = subDone(t, dk, s.id);
      if (checked) sli.className = "sdone";
      sli.innerHTML = `<input type="checkbox" class="sub-check" ${checked ? "checked" : ""}/><span></span>`;
      sli.querySelector("span").textContent = s.text;
      sli.querySelector(".sub-check").addEventListener("click", (e) => {
        e.stopPropagation();
        mutState(t, dk).subs[s.id] = !subDone(t, dk, s.id);
        save(); renderDay();
      });
      ul.appendChild(sli);
    });
  }

  // tamamlandı
  li.querySelector(".check").addEventListener("click", (e) => {
    e.stopPropagation();
    mutState(t, dk).done = !isDone(t, dk);
    save(); renderDay();
  });

  // düzenle (sürükleme sonrası tıklamayı engelle)
  li.addEventListener("click", () => { if (!li.dataset.dragged) openSheet(t, dk); });

  // sürükleme
  li.querySelector(".drag-handle").addEventListener("pointerdown", (e) => startDrag(e, li, dk));
  return li;
}

function renderTasks() {
  const all = byKey(selectedKey).filter((t) => catFilter === "all" || t.category === catFilter);
  const list = all.filter((t) =>
    dayFilter === "active" ? !isDone(t, selectedKey)
    : dayFilter === "done" ? isDone(t, selectedKey) : true);

  taskList.innerHTML = "";
  if (!list.length) {
    const msg = all.length ? "Bu filtrede görev yok" : "Bu gün için görev yok";
    taskList.innerHTML = `<li class="empty-state"><span class="emo">🌿</span><p>${msg}</p></li>`;
    return;
  }
  list.forEach((t) => taskList.appendChild(buildTaskItem(t, selectedKey)));
}

function renderProgress() {
  const all = byKey(selectedKey);
  const done = all.filter((t) => isDone(t, selectedKey)).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  const C = 169.6;
  $("ring-fg").style.strokeDashoffset = C - (C * pct) / 100;
  $("ring-label").textContent = pct + "%";
  if (!all.length) {
    $("progress-title").textContent = "Henüz görev yok";
    $("progress-detail").textContent = "Yeni bir görev ekleyerek başla";
  } else if (done === all.length) {
    $("progress-title").textContent = "Hepsi tamam! 🎉";
    $("progress-detail").textContent = `${all.length} görevin tamamı bitti`;
  } else {
    $("progress-title").textContent = `${done}/${all.length} tamamlandı`;
    $("progress-detail").textContent = `${all.length - done} görev kaldı`;
  }
}

function renderDay() {
  const label = prettyDate(selectedKey);
  dayHeading.textContent = label;
  if (view === "day") { headerTitle.textContent = label; headerSub.textContent = "Hadi planını yapalım"; }
  renderDayStrip(); renderTasks(); renderProgress();
}

/* =================== HAFTA GÖRÜNÜMÜ =================== */
function renderWeek() {
  const start = weekCursor, end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  weekTitle.textContent = sameMonth
    ? `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`
    : `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]}`;

  weekList.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i), k = keyOf(d);
    const block = document.createElement("div");
    block.className = "week-day" + (k === todayKey() ? " today" : "");
    block.innerHTML = `
      <div class="week-day-head">
        <span class="wd-title">${DOW_LONG[i]} · ${d.getDate()} ${MONTHS[d.getMonth()]}</span>
        <button class="wd-add" aria-label="Ekle">＋</button>
      </div>
      <ul class="week-tasks"></ul>`;

    block.querySelector(".wd-add").onclick = () => openSheet(null, k);

    const ul = block.querySelector(".week-tasks");
    const tasks = byKey(k);
    if (!tasks.length) {
      ul.innerHTML = `<li class="week-empty">Görev yok</li>`;
    } else {
      tasks.forEach((t) => {
        const done = isDone(t, k);
        const mini = document.createElement("li");
        mini.className = `mini p-${t.priority}` + (done ? " done" : "");
        mini.innerHTML = `
          <input type="checkbox" class="check" style="width:20px;height:20px" ${done ? "checked" : ""}/>
          <span class="m-title">${CATS[t.category] ? CATS[t.category].emoji + " " : ""}</span>
          ${t.time ? `<span class="m-time">${t.time}</span>` : ""}`;
        mini.querySelector(".m-title").append(t.text);
        mini.querySelector(".check").addEventListener("click", (e) => {
          e.stopPropagation();
          mutState(t, k).done = !isDone(t, k);
          save(); renderWeek();
        });
        mini.addEventListener("click", () => openSheet(t, k));
        ul.appendChild(mini);
      });
    }
    weekList.appendChild(block);
  }
}

/* =================== AY GÖRÜNÜMÜ =================== */
function renderMonth() {
  const y = monthCursor.getFullYear(), m = monthCursor.getMonth();
  monthTitle.textContent = `${MONTHS[m]} ${y}`;
  monthGrid.innerHTML = "";
  const first = new Date(y, m, 1);
  const startPad = isoDow(first);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  for (let i = startPad - 1; i >= 0; i--) addCell(new Date(y, m - 1, prevDays - i), true);
  for (let d = 1; d <= daysInMonth; d++) addCell(new Date(y, m, d), false);
  const tail = (7 - ((startPad + daysInMonth) % 7)) % 7;
  for (let d = 1; d <= tail; d++) addCell(new Date(y, m + 1, d), true);
}
function addCell(date, muted) {
  const k = keyOf(date), tasks = byKey(k);
  const cell = document.createElement("div");
  cell.className = "cell" + (muted ? " muted" : "");
  if (k === todayKey()) cell.classList.add("today");
  if (k === selectedKey) cell.classList.add("selected");
  const dots = Math.min(tasks.length, 3);
  let dotsHtml = ""; for (let i = 0; i < dots; i++) dotsHtml += "<i></i>";
  cell.innerHTML = `
    ${tasks.length > 3 ? `<span class="count-badge">${tasks.length}</span>` : ""}
    <span class="num">${date.getDate()}</span>
    <span class="cell-dots">${dotsHtml}</span>`;
  cell.onclick = () => {
    selectedKey = k;
    monthCursor = new Date(date.getFullYear(), date.getMonth(), 1);
    switchView("day");
  };
  monthGrid.appendChild(cell);
}

/* =================== SÜRÜKLE-BIRAK =================== */
let dragEl = null;
function startDrag(e, li, dk) {
  e.preventDefault(); e.stopPropagation();
  dragEl = li; dragEl.dataset.dk = dk;
  li.classList.add("dragging");
  delete li.dataset.dragged;
  document.addEventListener("pointermove", onDragMove, { passive: false });
  document.addEventListener("pointerup", onDragEnd, { once: true });
}
function getAfter(y) {
  const els = [...taskList.querySelectorAll(".task-item:not(.dragging)")];
  let res = null, min = Infinity;
  for (const el of els) {
    const box = el.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && Math.abs(offset) < min) { min = Math.abs(offset); res = el; }
  }
  return res;
}
function onDragMove(e) {
  if (!dragEl) return;
  e.preventDefault();
  const after = getAfter(e.clientY);
  if (after == null) taskList.appendChild(dragEl);
  else if (after !== dragEl) taskList.insertBefore(dragEl, after);
}
function onDragEnd() {
  if (!dragEl) return;
  document.removeEventListener("pointermove", onDragMove);
  const dk = dragEl.dataset.dk;
  dragEl.classList.remove("dragging");
  const el = dragEl; dragEl = null;
  // sıralamayı kaydet
  const ids = [...taskList.querySelectorAll(".task-item")].map((n) => n.dataset.id);
  ids.forEach((id, idx) => { const t = todos.find((x) => x.id === id); if (t) t.order = idx; });
  save();
  // sürükleme sonrası tıklama ile düzenleme açılmasın
  el.dataset.dragged = "1";
  setTimeout(() => { delete el.dataset.dragged; }, 50);
}

/* =================== GÖRÜNÜM GEÇİŞİ =================== */
function switchView(v) {
  view = v;
  viewDay.classList.toggle("hidden", v !== "day");
  viewWeek.classList.toggle("hidden", v !== "week");
  viewMonth.classList.toggle("hidden", v !== "month");
  $("progress-card").classList.toggle("hidden", v !== "day");
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
  if (v === "day") renderDay();
  else if (v === "week") {
    headerTitle.textContent = "Bu hafta"; headerSub.textContent = "Haftanı gör";
    renderWeek();
  } else {
    headerTitle.textContent = "Takvim"; headerSub.textContent = "Ayını planla";
    renderMonth();
  }
}

/* =================== EKLE / DÜZENLE PANELİ =================== */
function setPriority(p) {
  formPriority = p;
  $("f-priority").querySelectorAll(".seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.p === p));
}
function buildCatPicker() {
  const el = $("f-category");
  el.innerHTML = "";
  const make = (key, label, color) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat-opt" + (formCategory === key ? " active" : "");
    b.textContent = label;
    if (formCategory === key && color) b.style.background = color;
    b.onclick = () => { formCategory = key; buildCatPicker(); };
    el.appendChild(b);
  };
  make("", "Yok", "");
  Object.entries(CATS).forEach(([k, c]) => make(k, `${c.emoji} ${c.label}`, c.color));
}

function addSubRow(text = "", id = "") {
  const row = document.createElement("div");
  row.className = "sub-row";
  row.dataset.sid = id || uid();
  row.innerHTML = `<input type="text" placeholder="Alt görev..." /><button type="button" class="sub-del" aria-label="Kaldır">×</button>`;
  row.querySelector("input").value = text;
  row.querySelector(".sub-del").onclick = () => row.remove();
  subListEl.appendChild(row);
  return row;
}
function openSheet(task, occDate) {
  form.reset();
  subListEl.innerHTML = "";
  currentOccDate = occDate || selectedKey;
  closeMenu();
  if (task) {
    $("sheet-title").textContent = "Görevi düzenle";
    $("task-id").value = task.id;
    $("f-text").value = task.text;
    $("f-date").value = task.date;
    $("f-time").value = task.time || "";
    $("f-note").value = task.note || "";
    $("f-repeat").value = task.repeat;
    setPriority(task.priority);
    formCategory = task.category || ""; buildCatPicker();
    task.subtasks.forEach((s) => addSubRow(s.text, s.id));
    $("delete-btn").classList.remove("hidden");
    $("skip-btn").classList.toggle("hidden", task.repeat === "none");
  } else {
    $("sheet-title").textContent = "Yeni görev";
    $("task-id").value = "";
    $("f-date").value = currentOccDate;
    $("f-repeat").value = "none";
    setPriority("low");
    formCategory = ""; buildCatPicker();
    $("delete-btn").classList.add("hidden");
    $("skip-btn").classList.add("hidden");
  }
  backdrop.classList.remove("hidden");
  sheet.classList.remove("hidden");
  setTimeout(() => $("f-text").focus(), 250);
}
function closeSheet() { backdrop.classList.add("hidden"); sheet.classList.add("hidden"); }

function refreshCurrent() { view === "week" ? renderWeek() : view === "month" ? renderMonth() : renderDay(); }

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add("hidden"), 1800);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = $("f-text").value.trim();
  if (!text) return;
  const subs = [...subListEl.querySelectorAll(".sub-row")]
    .map((r) => ({ id: r.dataset.sid, text: r.querySelector("input").value.trim() }))
    .filter((s) => s.text);
  const id = $("task-id").value;
  const data = {
    text,
    date: $("f-date").value || todayKey(),
    time: $("f-time").value,
    note: $("f-note").value.trim(),
    priority: formPriority,
    category: formCategory,
    repeat: $("f-repeat").value,
    subtasks: subs,
  };

  if (id) {
    const t = todos.find((x) => x.id === id);
    Object.assign(t, data);
    showToast("Güncellendi ✓");
  } else {
    todos.push(normalize({ ...data, order: Date.now() }));
    showToast("Görev eklendi ✓");
  }
  save();
  selectedKey = data.date;
  monthCursor = parseKey(data.date);
  weekCursor = startOfWeek(parseKey(data.date));
  closeSheet();
  refreshCurrent();
});

$("add-sub").onclick = () => addSubRow().querySelector("input").focus();

$("delete-btn").addEventListener("click", () => {
  const id = $("task-id").value;
  const t = todos.find((x) => x.id === id);
  if (t && t.repeat !== "none" && !confirm("Bu tekrarlayan görevin tümü silinsin mi?")) return;
  todos = todos.filter((x) => x.id !== id);
  save(); closeSheet(); showToast("Silindi"); refreshCurrent();
});

$("skip-btn").addEventListener("click", () => {
  const id = $("task-id").value;
  const t = todos.find((x) => x.id === id);
  if (!t) return;
  if (!t.skip.includes(currentOccDate)) t.skip.push(currentOccDate);
  save(); closeSheet(); showToast("Bu gün atlandı"); refreshCurrent();
});

/* =================== MENÜ / YEDEK =================== */
const menu = $("menu");
function closeMenu() { menu.classList.add("hidden"); }
$("menu-btn").onclick = (e) => { e.stopPropagation(); menu.classList.toggle("hidden"); };
document.addEventListener("click", (e) => { if (!menu.contains(e.target) && e.target !== $("menu-btn")) closeMenu(); });

$("export-btn").onclick = () => {
  closeMenu();
  const blob = new Blob([JSON.stringify(todos, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `planla-yedek-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast("Yedek indirildi 📤");
};

$("import-btn").onclick = () => { closeMenu(); $("import-file").click(); };
$("import-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error("Geçersiz dosya");
      if (!confirm("İçe aktarılan veriler mevcut görevlerin yerini alacak. Devam edilsin mi?")) return;
      todos = data.map(normalize);
      save(); refreshCurrent(); showToast("Yedek yüklendi 📥");
    } catch { showToast("Dosya okunamadı ✗"); }
    finally { e.target.value = ""; }
  };
  reader.readAsText(file);
});

$("clear-all-btn").onclick = () => {
  closeMenu();
  if (!confirm("Tüm görevler silinsin mi? Bu işlem geri alınamaz.")) return;
  todos = []; save(); refreshCurrent(); showToast("Her şey temizlendi");
};

/* =================== OLAY DİNLEYİCİLER =================== */
$("fab").onclick = () => openSheet(null, selectedKey);
$("cancel-btn").onclick = closeSheet;
backdrop.onclick = closeSheet;

$("f-priority").querySelectorAll(".seg-btn").forEach((b) => (b.onclick = () => setPriority(b.dataset.p)));
document.querySelectorAll(".nav-btn").forEach((b) => (b.onclick = () => switchView(b.dataset.view)));

$("day-filter").querySelectorAll(".seg-btn").forEach((b) =>
  (b.onclick = () => {
    $("day-filter").querySelectorAll(".seg-btn").forEach((x) => x.classList.remove("active"));
    b.classList.add("active"); dayFilter = b.dataset.f; renderTasks();
  }));

$("prev-month").onclick = () => { monthCursor.setMonth(monthCursor.getMonth() - 1); renderMonth(); };
$("next-month").onclick = () => { monthCursor.setMonth(monthCursor.getMonth() + 1); renderMonth(); };
$("prev-week").onclick = () => { weekCursor = addDays(weekCursor, -7); renderWeek(); };
$("next-week").onclick = () => { weekCursor = addDays(weekCursor, 7); renderWeek(); };

document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSheet(); closeMenu(); closePomo(); } });

/* =================== POMODORO =================== */
const POMO = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const POMO_KEY = "planla_pomo";
let pomoMode = "focus";
let pomoRemaining = POMO.focus;
let pomoTimer = null;
let pomoCount = (() => {
  try { const d = JSON.parse(localStorage.getItem(POMO_KEY) || "null"); if (d && d.date === todayKey()) return d.count; } catch {}
  return 0;
})();
function pomoSaveCount() { localStorage.setItem(POMO_KEY, JSON.stringify({ date: todayKey(), count: pomoCount })); }
const pomoFmt = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

function pomoRender() {
  $("pomo-time").textContent = pomoFmt(pomoRemaining);
  const C = 326.7;
  $("pring-fg").style.strokeDashoffset = C * (1 - pomoRemaining / POMO[pomoMode]);
  $("pomo-toggle").textContent = pomoTimer ? "Duraklat" : "Başlat";
  $("pomo-count").textContent = `Bugün ${pomoCount} odak seansı 🍅`;
  $("pomo").classList.toggle("break", pomoMode !== "focus");
}
function pomoStop() { if (pomoTimer) { clearInterval(pomoTimer); pomoTimer = null; } }
function pomoSetMode(m) {
  pomoStop();
  pomoMode = m; pomoRemaining = POMO[m];
  $("pomo-modes").querySelectorAll(".seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.m === m));
  pomoRender();
}
function pomoBeep() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)();
    const o = a.createOscillator(), g = a.createGain();
    o.connect(g); g.connect(a.destination); o.type = "sine"; o.frequency.value = 880;
    g.gain.setValueAtTime(0.001, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, a.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.7);
    o.start(); o.stop(a.currentTime + 0.7);
  } catch {}
}
function pomoTick() {
  pomoRemaining--;
  if (pomoRemaining <= 0) {
    pomoStop(); pomoBeep();
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    if (pomoMode === "focus") {
      pomoCount++; pomoSaveCount();
      showToast("Odak tamamlandı! Mola zamanı ☕");
      pomoSetMode(pomoCount % 4 === 0 ? "long" : "short");
    } else {
      showToast("Mola bitti! Hadi devam 💪");
      pomoSetMode("focus");
    }
    return;
  }
  pomoRender();
}
function pomoStart() { if (pomoTimer) return; pomoTimer = setInterval(pomoTick, 1000); pomoRender(); }

function openPomo() { closeMenu(); $("pomo-backdrop").classList.remove("hidden"); $("pomo").classList.remove("hidden"); pomoRender(); }
function closePomo() { $("pomo-backdrop").classList.add("hidden"); $("pomo").classList.add("hidden"); }
$("pomo-btn").onclick = openPomo;
$("pomo-close").onclick = closePomo;
$("pomo-backdrop").onclick = closePomo;
$("pomo-toggle").onclick = () => { pomoTimer ? pomoStop() : pomoStart(); pomoRender(); };
$("pomo-reset").onclick = () => pomoSetMode(pomoMode);
$("pomo-modes").querySelectorAll(".seg-btn").forEach((b) => (b.onclick = () => pomoSetMode(b.dataset.m)));

/* =================== TEMA =================== */
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  $("theme-btn").textContent = t === "dark" ? "☀️" : "🌙";
  localStorage.setItem(THEME_KEY, t);
}
$("theme-btn").onclick = () => {
  const cur = document.documentElement.getAttribute("data-theme");
  applyTheme(cur === "dark" ? "light" : "dark");
};
applyTheme(localStorage.getItem(THEME_KEY) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

/* =================== BAŞLANGIÇ =================== */
loadData();
renderCatFilter();
switchView("day");

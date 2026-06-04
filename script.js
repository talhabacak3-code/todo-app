// ===== Sabitler =====
const REST = `${SUPABASE_URL}/rest/v1/todos`;
const AUTH = `${SUPABASE_URL}/auth/v1`;
const SESSION_KEY = "todo_session";

// ===== DOM =====
const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");
const authForm = document.getElementById("auth-form");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authSubmit = document.getElementById("auth-submit");
const authError = document.getElementById("auth-error");
const authSwitchBtn = document.getElementById("auth-switch-btn");
const authSwitchText = document.getElementById("auth-switch-text");
const logoutBtn = document.getElementById("logout-btn");
const userEmailEl = document.getElementById("user-email");

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear-done");
const filterBtns = document.querySelectorAll(".filter-btn");

// ===== Durum =====
let session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
let todos = [];
let filter = "all";
let authMode = "login"; // "login" | "signup"

// ===== Oturum yardımcıları =====
function saveSession(s) {
  session = s;
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession() {
  session = null;
  localStorage.removeItem(SESSION_KEY);
}

// access_token süresi dolduysa refresh_token ile yeniler
async function refreshSession() {
  if (!session?.refresh_token) throw new Error("Oturum yok");
  const res = await fetch(`${AUTH}/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!res.ok) throw new Error("Oturum yenilenemedi");
  saveSession(await res.json());
}

// Giriş yapmış kullanıcı adına REST isteği (401'de bir kez token yeniler)
async function apiFetch(url, options = {}, retry = true) {
  const res = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (res.status === 401 && retry) {
    await refreshSession();
    return apiFetch(url, options, false);
  }
  return res;
}

// ===== Kimlik doğrulama =====
async function signUp(email, password) {
  const res = await fetch(`${AUTH}/signup`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error_description || "Kayıt başarısız");
  // E-posta onayı kapalı olduğu için token doğrudan döner
  if (!data.access_token) throw new Error("Kayıt tamam ama oturum açılamadı");
  return data;
}

async function signIn(email, password) {
  const res = await fetch(`${AUTH}/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.error_description || data.msg || "E-posta veya şifre hatalı"
    );
  return data;
}

async function signOut() {
  try {
    await fetch(`${AUTH}/logout`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  } catch (_) {}
  clearSession();
  todos = [];
  showAuth();
}

// ===== Ekran yönetimi =====
function showAuth() {
  authScreen.hidden = false;
  appScreen.hidden = true;
  authError.textContent = "";
}

function showApp() {
  authScreen.hidden = true;
  appScreen.hidden = false;
  userEmailEl.textContent = session?.user?.email || "";
  load();
}

function setAuthMode(mode) {
  authMode = mode;
  authError.textContent = "";
  if (mode === "login") {
    authSubmit.textContent = "Giriş Yap";
    authSwitchText.textContent = "Hesabın yok mu?";
    authSwitchBtn.textContent = "Kayıt ol";
    authPassword.autocomplete = "current-password";
  } else {
    authSubmit.textContent = "Kayıt Ol";
    authSwitchText.textContent = "Zaten hesabın var mı?";
    authSwitchBtn.textContent = "Giriş yap";
    authPassword.autocomplete = "new-password";
  }
}

// ===== Görev REST işlemleri =====
async function fetchTodos() {
  const res = await apiFetch(`${REST}?select=*&order=inserted_at.asc`);
  if (!res.ok) throw new Error(`Yükleme hatası: ${res.status}`);
  return res.json();
}

async function createTodo(text) {
  const res = await apiFetch(REST, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ text }), // user_id sunucuda auth.uid() ile dolar
  });
  if (!res.ok) throw new Error(`Ekleme hatası: ${res.status}`);
  const [row] = await res.json();
  return row;
}

async function updateTodo(id, changes) {
  const res = await apiFetch(`${REST}?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error(`Güncelleme hatası: ${res.status}`);
}

async function deleteTodo(id) {
  const res = await apiFetch(`${REST}?id=eq.${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Silme hatası: ${res.status}`);
}

// ===== Arayüz =====
function render() {
  list.innerHTML = "";
  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  if (filtered.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Görev yok 🎉";
    list.appendChild(li);
  }

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggle(todo));

    const span = document.createElement("span");
    span.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.innerHTML = "&times;";
    del.addEventListener("click", () => remove(todo.id));

    li.append(checkbox, span, del);
    list.appendChild(li);
  });

  const active = todos.filter((t) => !t.done).length;
  countEl.textContent = `${active} görev kaldı`;
}

async function load() {
  try {
    todos = await fetchTodos();
    render();
  } catch (err) {
    countEl.textContent = err.message;
  }
}

async function addTodo(text) {
  try {
    const row = await createTodo(text);
    todos.push(row);
    render();
  } catch (err) {
    countEl.textContent = err.message;
  }
}

async function toggle(todo) {
  const newDone = !todo.done;
  todo.done = newDone;
  render();
  try {
    await updateTodo(todo.id, { done: newDone });
  } catch (err) {
    todo.done = !newDone;
    render();
    countEl.textContent = err.message;
  }
}

async function remove(id) {
  const backup = todos;
  todos = todos.filter((t) => t.id !== id);
  render();
  try {
    await deleteTodo(id);
  } catch (err) {
    todos = backup;
    render();
    countEl.textContent = err.message;
  }
}

// ===== Olaylar =====
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = authEmail.value.trim();
  const password = authPassword.value;
  if (!email || password.length < 6) {
    authError.textContent = "Geçerli e-posta ve en az 6 karakter şifre girin.";
    return;
  }
  authSubmit.disabled = true;
  authError.textContent = "";
  try {
    const data =
      authMode === "signup"
        ? await signUp(email, password)
        : await signIn(email, password);
    saveSession(data);
    authForm.reset();
    showApp();
  } catch (err) {
    authError.textContent = err.message;
  } finally {
    authSubmit.disabled = false;
  }
});

authSwitchBtn.addEventListener("click", () =>
  setAuthMode(authMode === "login" ? "signup" : "login")
);

logoutBtn.addEventListener("click", signOut);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
  input.focus();
});

clearBtn.addEventListener("click", async () => {
  const doneIds = todos.filter((t) => t.done).map((t) => t.id);
  if (doneIds.length === 0) return;
  try {
    const res = await apiFetch(`${REST}?id=in.(${doneIds.join(",")})`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Silme hatası: ${res.status}`);
    todos = todos.filter((t) => !t.done);
    render();
  } catch (err) {
    countEl.textContent = err.message;
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

// ===== Başlangıç =====
setAuthMode("login");
if (session?.access_token) {
  showApp();
} else {
  showAuth();
}

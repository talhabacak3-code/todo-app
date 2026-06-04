const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear-done");
const filterBtns = document.querySelectorAll(".filter-btn");

const REST = `${SUPABASE_URL}/rest/v1/todos`;
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

let todos = [];
let filter = "all";

// --- Supabase REST işlemleri ---

async function fetchTodos() {
  const res = await fetch(`${REST}?select=*&order=inserted_at.asc`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(`Yükleme hatası: ${res.status}`);
  return res.json();
}

async function createTodo(text) {
  const res = await fetch(REST, {
    method: "POST",
    headers: { ...HEADERS, Prefer: "return=representation" },
    body: JSON.stringify({ text, done: false }),
  });
  if (!res.ok) throw new Error(`Ekleme hatası: ${res.status}`);
  const [row] = await res.json();
  return row;
}

async function updateTodo(id, changes) {
  const res = await fetch(`${REST}?id=eq.${id}`, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error(`Güncelleme hatası: ${res.status}`);
}

async function deleteTodo(id) {
  const res = await fetch(`${REST}?id=eq.${id}`, {
    method: "DELETE",
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(`Silme hatası: ${res.status}`);
}

// --- Arayüz ---

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
  // İyimser ekleme: önce sunucuya yaz, dönen kaydı listeye ekle.
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
  todo.done = newDone; // iyimser güncelleme
  render();
  try {
    await updateTodo(todo.id, { done: newDone });
  } catch (err) {
    todo.done = !newDone; // hata olursa geri al
    render();
    countEl.textContent = err.message;
  }
}

async function remove(id) {
  const backup = todos;
  todos = todos.filter((t) => t.id !== id); // iyimser silme
  render();
  try {
    await deleteTodo(id);
  } catch (err) {
    todos = backup;
    render();
    countEl.textContent = err.message;
  }
}

// --- Olaylar ---

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
    const res = await fetch(`${REST}?id=in.(${doneIds.join(",")})`, {
      method: "DELETE",
      headers: HEADERS,
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

load();

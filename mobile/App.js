import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, Pressable, TextInput, Modal,
  StyleSheet, useColorScheme, StatusBar as RNStatusBar, Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ===================== Sabitler ===================== */
const STORE_KEY = "planla_state_v1";

const THEMES = {
  light: { bg: "#f3effa", card: "#ffffff", soft: "#f3f0fb", border: "#ece7f7", text: "#41415c", sub: "#9aa0b5", primary: "#a78bfa", primaryDeep: "#7c5fe6", accent: "#f9a8d4" },
  dark:  { bg: "#1b1830", card: "#2a2540", soft: "#332c4a", border: "#3a3354", text: "#e7e4f3", sub: "#9990b5", primary: "#a78bfa", primaryDeep: "#c4b5fd", accent: "#f9a8d4" },
};
const PRIO = { low: "#34d399", med: "#fbbf24", high: "#fb7185" };
const PRIO_LABEL = { low: "Düşük", med: "Orta", high: "Yüksek" };
const CATS = {
  is:        { label: "İş", emoji: "💼", color: "#3b82f6" },
  kisisel:   { label: "Kişisel", emoji: "🌸", color: "#ec4899" },
  egitim:    { label: "Eğitim", emoji: "📚", color: "#06b6d4" },
  alisveris: { label: "Alışveriş", emoji: "🛒", color: "#f97316" },
  saglik:    { label: "Sağlık", emoji: "🩺", color: "#10b981" },
};
const REPEATS = [
  { k: "none", label: "Yok" }, { k: "daily", label: "Her gün" },
  { k: "weekdays", label: "Hafta içi" }, { k: "weekly", label: "Her hafta" }, { k: "monthly", label: "Her ay" },
];
const REPEAT_LABEL = { daily: "Her gün", weekdays: "Hafta içi", weekly: "Her hafta", monthly: "Her ay" };
const NOTE_COLORS = ["#a78bfa", "#f9a8d4", "#fbbf24", "#34d399", "#60a5fa", "#fb7185"];
const STAGES = [
  { min: 0, name: "Tohum", emoji: "🌰" }, { min: 1, name: "Filiz", emoji: "🌱" },
  { min: 3, name: "Fidan", emoji: "🌿" }, { min: 6, name: "Genç Ağaç", emoji: "🪴" },
  { min: 12, name: "Ağaç", emoji: "🌳" }, { min: 24, name: "Gür Ağaç", emoji: "🌳" },
  { min: 40, name: "Meyveli Ağaç", emoji: "🍎" },
];
const TECHNIQUES = {
  pomodoro:  { name: "🍅 Pomodoro", focus: 25, short: 5, long: 15, longEvery: 4, desc: "25 dk çalış, 5 dk mola. 4 turda bir uzun mola." },
  t5217:     { name: "⏱️ 52 / 17", focus: 52, short: 17, long: 17, longEvery: 0, desc: "52 dk derin çalışma, 17 dk mola." },
  t5010:     { name: "📚 50 / 10", focus: 50, short: 10, long: 30, longEvery: 2, desc: "50 dk çalış, 10 dk mola." },
  ultradian: { name: "🧠 90 / 20", focus: 90, short: 20, long: 30, longEvery: 0, desc: "90 dk yoğun odak, 20 dk dinlenme." },
};

/* ===================== Tarih yardımcıları ===================== */
const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => keyOf(new Date());
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DOW_LONG = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const isoDow = (date) => (date.getDay() + 6) % 7;
const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };
const startOfWeek = (date) => addDays(date, -isoDow(date));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
function prettyDate(k) {
  const d = parseKey(k), t = parseKey(todayKey());
  const diff = Math.round((d - t) / 86400000);
  if (diff === 0) return "Bugün";
  if (diff === 1) return "Yarın";
  if (diff === -1) return "Dün";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${DOW[isoDow(d)]}`;
}

/* ===================== Görev mantığı ===================== */
function occursOn(t, dk) {
  if (dk < t.date) return false;
  if (t.skip && t.skip.includes(dk)) return false;
  switch (t.repeat) {
    case "daily": return true;
    case "weekdays": return isoDow(parseKey(dk)) < 5;
    case "weekly": return isoDow(parseKey(dk)) === isoDow(parseKey(t.date));
    case "monthly": return parseKey(dk).getDate() === parseKey(t.date).getDate();
    default: return dk === t.date;
  }
}
const isDone = (t, dk) => !!(t.state && t.state[dk] && t.state[dk].done);
const subDone = (t, dk, sid) => !!(t.state && t.state[dk] && t.state[dk].subs && t.state[dk].subs[sid]);
function tasksFor(todos, dk) {
  return todos.filter((t) => occursOn(t, dk)).sort((a, b) =>
    (isDone(a, dk) - isDone(b, dk)) || ((a.order || 0) - (b.order || 0)) || ((a.time || "99").localeCompare(b.time || "99")));
}
const treeStage = (p) => { let i = 0; for (let s = 0; s < STAGES.length; s++) if (p >= STAGES[s].min) i = s; return i; };
const streakCurrent = (st) => {
  if (!st || !st.lastActiveDate) return 0;
  const t = todayKey(), y = keyOf(addDays(parseKey(t), -1));
  return st.lastActiveDate === t || st.lastActiveDate === y ? st.current : 0;
};

const DEFAULT_DATA = {
  todos: [], notes: [], routines: [], routineState: {},
  garden: { points: 0 }, streak: { current: 0, best: 0, lastActiveDate: "" },
  theme: null, pomoTech: "pomodoro",
};

/* ===================== Ana uygulama ===================== */
export default function App() {
  const sys = useColorScheme();
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(DEFAULT_DATA);
  const [view, setView] = useState("day");
  const [selectedKey, setSelectedKey] = useState(todayKey());
  const [monthCursor, setMonthCursor] = useState(new Date());
  const [weekCursor, setWeekCursor] = useState(startOfWeek(new Date()));
  const [toast, setToast] = useState("");

  const theme = data.theme || (sys === "dark" ? "dark" : "light");
  const C = THEMES[theme];
  const s = makeStyles(C);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) setData({ ...DEFAULT_DATA, ...JSON.parse(raw) });
      } catch {}
      setLoaded(true);
    })();
  }, []);
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, loaded]);

  const toastTimer = useRef(null);
  const showToast = (m) => {
    setToast(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1900);
  };
  const mutate = (fn) => setData((prev) => { const next = JSON.parse(JSON.stringify(prev)); fn(next); return next; });

  function applyCompletion(d, delta, milestoneToast) {
    const before = treeStage(d.garden.points);
    d.garden.points = Math.max(0, d.garden.points + delta);
    const after = treeStage(d.garden.points);
    if (delta > 0) {
      const t = todayKey();
      if (d.streak.lastActiveDate !== t) {
        const y = keyOf(addDays(parseKey(t), -1));
        d.streak.current = d.streak.lastActiveDate === y ? d.streak.current + 1 : 1;
        d.streak.lastActiveDate = t;
        d.streak.best = Math.max(d.streak.best || 0, d.streak.current);
        if ([3, 7, 14, 21, 30, 50, 100].includes(d.streak.current)) milestoneToast(`🔥 ${d.streak.current} günlük seri!`);
      }
      if (after > before) milestoneToast(`Ağacın büyüdü → ${STAGES[after].name} ${STAGES[after].emoji}`);
    }
  }

  function toggleTask(id, dk) {
    let msg = null;
    mutate((d) => {
      const t = d.todos.find((x) => x.id === id);
      if (!t.state[dk]) t.state[dk] = { done: false, subs: {} };
      const now = !t.state[dk].done;
      t.state[dk].done = now;
      applyCompletion(d, now ? 1 : -1, (m) => (msg = m));
    });
    if (msg) showToast(msg);
  }
  function toggleSub(id, dk, sid) {
    mutate((d) => {
      const t = d.todos.find((x) => x.id === id);
      if (!t.state[dk]) t.state[dk] = { done: false, subs: {} };
      if (!t.state[dk].subs) t.state[dk].subs = {};
      t.state[dk].subs[sid] = !t.state[dk].subs[sid];
    });
  }
  function toggleRoutine(id) {
    let msg = null;
    mutate((d) => {
      if (!d.routineState[selectedKey]) d.routineState[selectedKey] = {};
      const now = !d.routineState[selectedKey][id];
      d.routineState[selectedKey][id] = now;
      applyCompletion(d, now ? 1 : -1, (m) => (msg = m));
    });
    if (msg) showToast(msg);
  }

  const [taskModal, setTaskModal] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [routineModal, setRoutineModal] = useState(false);
  const [pomoOpen, setPomoOpen] = useState(false);

  if (!loaded) return <View style={[s.flex, { backgroundColor: C.bg }]} />;

  const headerInfo = {
    day: ["Bugün", "Hadi planını yapalım"], week: ["Bu hafta", "Haftanı gör"],
    month: ["Takvim", "Ayını planla"], notes: ["Not Defteri", "Aklındakileri yaz"], tree: ["Ağaç Bahçesi", "Görevlerle büyüt"],
  }[view];
  const title = view === "day" ? prettyDate(selectedKey) : headerInfo[0];

  return (
    <View style={[s.flex, { backgroundColor: C.bg }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <View style={{ height: Platform.OS === "android" ? RNStatusBar.currentHeight : 44 }} />

      <View style={s.header}>
        <View style={s.row}>
          <View style={s.logo}><Text style={{ fontSize: 18 }}>✦</Text></View>
          <View>
            <Text style={s.h1}>{title}</Text>
            <Text style={s.sub}>{headerInfo[1]}</Text>
          </View>
        </View>
        <View style={s.row}>
          <Pressable style={s.iconBtn} onPress={() => setPomoOpen(true)}>
            <Text style={{ fontSize: 16 }}>🍅</Text>
          </Pressable>
          <Pressable style={[s.iconBtn, { marginLeft: 8 }]} onPress={() => mutate((d) => { d.theme = theme === "dark" ? "light" : "dark"; })}>
            <Text style={{ fontSize: 16 }}>{theme === "dark" ? "☀️" : "🌙"}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={s.flex} contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {view === "day" && <DayView {...{ C, s, data, selectedKey, setSelectedKey, toggleTask, toggleSub, toggleRoutine, openTask: (t) => setTaskModal({ task: t }), openRoutines: () => setRoutineModal(true) }} />}
        {view === "week" && <WeekView {...{ C, s, data, weekCursor, setWeekCursor, toggleTask, openTask: (t) => setTaskModal({ task: t }), addOn: (k) => setTaskModal({ date: k }) }} />}
        {view === "month" && <MonthView {...{ C, s, data, monthCursor, setMonthCursor, selectedKey, onPick: (k) => { setSelectedKey(k); setMonthCursor(parseKey(k)); setView("day"); } }} />}
        {view === "notes" && <NotesView {...{ C, s, data, openNote: (n) => setNoteModal(n ? { note: n } : { new: true }) }} />}
        {view === "tree" && <TreeView {...{ C, s, data }} />}
      </ScrollView>

      <View style={s.nav}>
        {[["day", "📅", "Gün"], ["week", "🗒️", "Hafta"]].map(([v, i, l]) => <NavBtn key={v} {...{ s, C, v, i, l, view, setView }} />)}
        <Pressable style={s.fab} onPress={() => (view === "notes" ? setNoteModal({ new: true }) : setTaskModal({ date: selectedKey }))}>
          <Text style={{ color: "#fff", fontSize: 30, marginTop: -2 }}>+</Text>
        </Pressable>
        {[["month", "🗓️", "Ay"], ["notes", "📝", "Not"], ["tree", "🌳", "Ağaç"]].map(([v, i, l]) => <NavBtn key={v} {...{ s, C, v, i, l, view, setView }} />)}
      </View>

      {toast ? <View style={s.toast}><Text style={s.toastText}>{toast}</Text></View> : null}

      {taskModal && <TaskEditor {...{ C, s, taskModal, selectedKey, onClose: () => setTaskModal(null),
        onSave: (payload, id) => { mutate((d) => {
          if (id) { const t = d.todos.find((x) => x.id === id); Object.assign(t, payload); }
          else d.todos.push({ id: uid(), order: Date.now(), state: {}, skip: [], ...payload });
        }); setSelectedKey(payload.date); setTaskModal(null); showToast(id ? "Güncellendi ✓" : "Görev eklendi ✓"); },
        onDelete: (id) => { mutate((d) => { d.todos = d.todos.filter((x) => x.id !== id); }); setTaskModal(null); showToast("Silindi"); },
        onSkip: (id) => { mutate((d) => { const t = d.todos.find((x) => x.id === id); if (!t.skip.includes(selectedKey)) t.skip.push(selectedKey); }); setTaskModal(null); showToast("Bu gün atlandı"); } }} />}

      {noteModal && <NoteEditor {...{ C, s, noteModal, onClose: () => setNoteModal(null),
        onSave: (payload, id) => { mutate((d) => {
          if (id) { const n = d.notes.find((x) => x.id === id); Object.assign(n, payload, { updated: Date.now() }); }
          else d.notes.push({ id: uid(), updated: Date.now(), ...payload });
        }); setNoteModal(null); showToast("Not kaydedildi ✓"); },
        onDelete: (id) => { mutate((d) => { d.notes = d.notes.filter((x) => x.id !== id); }); setNoteModal(null); showToast("Not silindi"); } }} />}

      {routineModal && <RoutineEditor {...{ C, s, data, onClose: () => setRoutineModal(false),
        onSave: (list) => { mutate((d) => { d.routines = list; }); setRoutineModal(false); showToast("Rutinler kaydedildi ✓"); } }} />}

      {pomoOpen && <Pomodoro {...{ C, s, data, mutate, showToast, onClose: () => setPomoOpen(false) }} />}
    </View>
  );
}

/* ===================== Alt bileşenler ===================== */
function NavBtn({ s, C, v, i, l, view, setView }) {
  const active = view === v;
  return (
    <Pressable style={s.navBtn} onPress={() => setView(v)}>
      <Text style={{ fontSize: 19, opacity: active ? 1 : 0.55 }}>{i}</Text>
      <Text style={[s.navLabel, { color: active ? C.primaryDeep : C.sub }]}>{l}</Text>
    </Pressable>
  );
}
function Check({ C, checked, onPress, size = 24 }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{
      width: size, height: size, borderRadius: 8, borderWidth: 2,
      borderColor: checked ? "transparent" : C.primary, backgroundColor: checked ? C.primary : "transparent",
      alignItems: "center", justifyContent: "center",
    }}>
      {checked && <Text style={{ color: "#fff", fontWeight: "700", fontSize: size * 0.55 }}>✓</Text>}
    </Pressable>
  );
}
function Chip({ C, label, active, color, onPress }) {
  return (
    <Pressable onPress={onPress} style={{
      paddingVertical: 8, paddingHorizontal: 13, borderRadius: 12, marginRight: 7, marginBottom: 7,
      borderWidth: 1, borderColor: active ? "transparent" : C.border,
      backgroundColor: active ? (color || C.primary) : C.soft,
    }}>
      <Text style={{ fontWeight: "600", fontSize: 13, color: active ? "#fff" : C.text }}>{label}</Text>
    </Pressable>
  );
}

/* ---------- Gün ---------- */
function DayView({ C, s, data, selectedKey, setSelectedKey, toggleTask, toggleSub, toggleRoutine, openTask, openRoutines }) {
  const [filter, setFilter] = useState("all");
  const [cat, setCat] = useState("all");
  const base = parseKey(selectedKey);
  const days = []; for (let i = -3; i <= 10; i++) days.push(addDays(base, i));
  const all = tasksFor(data.todos, selectedKey).filter((t) => cat === "all" || t.category === cat);
  const list = all.filter((t) => filter === "active" ? !isDone(t, selectedKey) : filter === "done" ? isDone(t, selectedKey) : true);
  const dayTasks = tasksFor(data.todos, selectedKey);
  const done = dayTasks.filter((t) => isDone(t, selectedKey)).length;
  const total = dayTasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const sc = streakCurrent(data.streak);

  return (
    <View>
      <View style={s.progressCard}>
        <View style={s.ring}><Text style={{ fontWeight: "700", color: C.primaryDeep }}>{pct}%</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.progressTitle}>{total ? (done === total ? "Hepsi tamam! 🎉" : `${done}/${total} tamamlandı`) : "Henüz görev yok"}</Text>
          <Text style={s.sub}>{total ? `${total - done} görev kaldı` : "Yeni görev ekle"}{sc > 0 ? ` · 🔥 ${sc} gün` : ""}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
        {days.map((d) => {
          const k = keyOf(d), active = k === selectedKey, isToday = k === todayKey();
          const has = tasksFor(data.todos, k).length > 0;
          return (
            <Pressable key={k} onPress={() => setSelectedKey(k)} style={[s.dayPill, active && { backgroundColor: C.primary, borderColor: "transparent" }]}>
              <Text style={[s.dayDow, active && { color: "#fff" }]}>{DOW[isoDow(d)]}</Text>
              <Text style={[s.dayNum, active && { color: "#fff" }, isToday && !active && { color: C.primaryDeep }]}>{d.getDate()}</Text>
              <View style={{ width: 5, height: 5, borderRadius: 3, marginTop: 3, backgroundColor: has ? (active ? "#fff" : C.primary) : "transparent" }} />
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={s.routineCard}>
        <View style={[s.row, { justifyContent: "space-between", marginBottom: 10 }]}>
          <Text style={{ fontWeight: "700", fontSize: 15, color: C.text }}>🌅 Günlük Rutinler</Text>
          <Pressable onPress={openRoutines} style={s.smallBtn}><Text style={{ color: C.primaryDeep, fontWeight: "600", fontSize: 12 }}>Düzenle</Text></Pressable>
        </View>
        {data.routines.length === 0 ? (
          <Pressable onPress={openRoutines}><Text style={s.sub}>Henüz rutin yok. İlk rutinini ekle →</Text></Pressable>
        ) : data.routines.map((r) => {
          const d = !!(data.routineState[selectedKey] && data.routineState[selectedKey][r.id]);
          return (
            <View key={r.id} style={[s.row, { marginBottom: 8 }]}>
              <Check C={C} checked={d} onPress={() => toggleRoutine(r.id)} size={20} />
              <Text style={[{ marginLeft: 11, fontWeight: "600", color: C.text }, d && { textDecorationLine: "line-through", color: C.sub }]}>{r.text}</Text>
            </View>
          );
        })}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 14 }}>
        <Chip C={C} label="Tümü" active={cat === "all"} onPress={() => setCat("all")} />
        {Object.entries(CATS).map(([k, c]) => <Chip key={k} C={C} label={`${c.emoji} ${c.label}`} color={c.color} active={cat === k} onPress={() => setCat(k)} />)}
      </View>

      <View style={[s.row, { justifyContent: "space-between", marginVertical: 10 }]}>
        <Text style={s.h2}>{prettyDate(selectedKey)}</Text>
        <View style={[s.row, s.seg]}>
          {[["all", "Tümü"], ["active", "Aktif"], ["done", "Biten"]].map(([f, l]) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={[s.segBtn, filter === f && { backgroundColor: C.card }]}>
              <Text style={{ fontWeight: "600", fontSize: 12, color: filter === f ? C.primaryDeep : C.sub }}>{l}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {list.length === 0 ? <Text style={[s.sub, { textAlign: "center", marginVertical: 30 }]}>🌿  Bu gün için görev yok</Text>
        : list.map((t) => <TaskRow key={t.id} {...{ C, s, t, dk: selectedKey, toggleTask, toggleSub, openTask }} />)}
    </View>
  );
}

function TaskRow({ C, s, t, dk, toggleTask, toggleSub, openTask }) {
  const done = isDone(t, dk);
  const subTotal = (t.subtasks || []).length;
  const subN = (t.subtasks || []).filter((x) => subDone(t, dk, x.id)).length;
  return (
    <Pressable onPress={() => openTask(t)} style={[s.taskItem, { borderLeftColor: PRIO[t.priority] }]}>
      <View style={s.row}>
        <Check C={C} checked={done} onPress={() => toggleTask(t.id, dk)} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[{ fontWeight: "600", color: C.text }, done && { textDecorationLine: "line-through", color: C.sub }]}>{t.text}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
            {t.time ? <Tag C={C} text={`🕑 ${t.time}`} color={C.primaryDeep} /> : null}
            {CATS[t.category] ? <Tag C={C} text={`${CATS[t.category].emoji} ${CATS[t.category].label}`} color={CATS[t.category].color} /> : null}
            {t.repeat !== "none" ? <Tag C={C} text={`🔁 ${REPEAT_LABEL[t.repeat]}`} color={C.accent} /> : null}
            {subTotal ? <Tag C={C} text={`☑ ${subN}/${subTotal}`} color={"#34d399"} /> : null}
          </View>
          {subTotal ? (t.subtasks).map((x) => {
            const sd = subDone(t, dk, x.id);
            return (
              <View key={x.id} style={[s.row, { marginTop: 6 }]}>
                <Check C={C} checked={sd} onPress={() => toggleSub(t.id, dk, x.id)} size={17} />
                <Text style={[{ marginLeft: 8, fontSize: 13, color: C.text }, sd && { textDecorationLine: "line-through", color: C.sub }]}>{x.text}</Text>
              </View>
            );
          }) : null}
          {t.note ? <Text style={{ fontSize: 12, color: C.sub, marginTop: 5 }}>{t.note}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}
function Tag({ C, text, color }) {
  return <View style={{ backgroundColor: (color || C.primary) + "22", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6, marginBottom: 4 }}>
    <Text style={{ fontSize: 11, fontWeight: "700", color }}>{text}</Text></View>;
}

/* ---------- Hafta ---------- */
function WeekView({ C, s, data, weekCursor, setWeekCursor, toggleTask, openTask, addOn }) {
  const start = weekCursor, end = addDays(start, 6);
  const title = `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]}`;
  return (
    <View>
      <View style={[s.row, { justifyContent: "space-between", marginBottom: 14 }]}>
        <Pressable style={s.iconBtn} onPress={() => setWeekCursor(addDays(weekCursor, -7))}><Text style={{ color: C.text, fontSize: 18 }}>‹</Text></Pressable>
        <Text style={s.h2}>{title}</Text>
        <Pressable style={s.iconBtn} onPress={() => setWeekCursor(addDays(weekCursor, 7))}><Text style={{ color: C.text, fontSize: 18 }}>›</Text></Pressable>
      </View>
      {Array.from({ length: 7 }).map((_, i) => {
        const d = addDays(start, i), k = keyOf(d), isToday = k === todayKey();
        const tasks = tasksFor(data.todos, k);
        return (
          <View key={k} style={[s.weekDay, isToday && { borderColor: C.primary }]}>
            <View style={[s.row, { justifyContent: "space-between", marginBottom: 8 }]}>
              <Text style={{ fontWeight: "700", color: isToday ? C.primaryDeep : C.text }}>{DOW_LONG[i]} · {d.getDate()} {MONTHS[d.getMonth()]}</Text>
              <Pressable onPress={() => addOn(k)} style={s.smallBtn}><Text style={{ color: C.primaryDeep, fontSize: 16 }}>＋</Text></Pressable>
            </View>
            {tasks.length === 0 ? <Text style={s.sub}>Görev yok</Text> : tasks.map((t) => {
              const done = isDone(t, k);
              return (
                <Pressable key={t.id} onPress={() => openTask(t)} style={[s.mini, { borderLeftColor: PRIO[t.priority] }]}>
                  <Check C={C} checked={done} onPress={() => toggleTask(t.id, k)} size={20} />
                  <Text style={[{ flex: 1, marginLeft: 9, fontWeight: "600", fontSize: 13, color: C.text }, done && { textDecorationLine: "line-through", color: C.sub }]}>
                    {CATS[t.category] ? CATS[t.category].emoji + " " : ""}{t.text}</Text>
                  {t.time ? <Text style={{ fontSize: 11, color: C.sub }}>{t.time}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

/* ---------- Ay ---------- */
function MonthView({ C, s, data, monthCursor, setMonthCursor, selectedKey, onPick }) {
  const y = monthCursor.getFullYear(), m = monthCursor.getMonth();
  const startPad = isoDow(new Date(y, m, 1));
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return (
    <View>
      <View style={[s.row, { justifyContent: "space-between", marginBottom: 12 }]}>
        <Pressable style={s.iconBtn} onPress={() => setMonthCursor(new Date(y, m - 1, 1))}><Text style={{ color: C.text, fontSize: 18 }}>‹</Text></Pressable>
        <Text style={s.h2}>{MONTHS[m]} {y}</Text>
        <Pressable style={s.iconBtn} onPress={() => setMonthCursor(new Date(y, m + 1, 1))}><Text style={{ color: C.text, fontSize: 18 }}>›</Text></Pressable>
      </View>
      <View style={{ flexDirection: "row", marginBottom: 6 }}>
        {DOW.map((d) => <Text key={d} style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: "700", color: C.sub }}>{d}</Text>)}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cells.map((d, idx) => {
          if (!d) return <View key={idx} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
          const k = keyOf(d), isToday = k === todayKey(), sel = k === selectedKey;
          const n = tasksFor(data.todos, k).length;
          return (
            <View key={idx} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 3 }}>
              <Pressable onPress={() => onPick(k)} style={[s.cell, isToday && { borderColor: C.primary }, sel && { backgroundColor: C.primary, borderColor: "transparent" }]}>
                <Text style={{ fontWeight: "600", color: sel ? "#fff" : (isToday ? C.primaryDeep : C.text) }}>{d.getDate()}</Text>
                <View style={{ flexDirection: "row", marginTop: 3 }}>
                  {Array.from({ length: Math.min(n, 3) }).map((_, j) => <View key={j} style={{ width: 4, height: 4, borderRadius: 2, marginHorizontal: 1, backgroundColor: sel ? "#fff" : C.primary }} />)}
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
      <Text style={[s.sub, { textAlign: "center", marginTop: 16 }]}>Görmek için bir güne dokun</Text>
    </View>
  );
}

/* ---------- Notlar ---------- */
function NotesView({ C, s, data, openNote }) {
  const sorted = [...data.notes].sort((a, b) => b.updated - a.updated);
  if (!sorted.length) return <Text style={[s.sub, { textAlign: "center", marginTop: 40 }]}>📝  Henüz not yok</Text>;
  return (
    <View>
      <Text style={[s.h2, { marginBottom: 12 }]}>Not Defteri</Text>
      {sorted.map((n) => (
        <Pressable key={n.id} onPress={() => openNote(n)} style={[s.noteCard, { borderLeftColor: n.color, backgroundColor: n.color + "1f" }]}>
          {n.title ? <Text style={{ fontWeight: "700", color: C.text, marginBottom: 4 }}>{n.title}</Text> : null}
          <Text style={{ color: C.text, fontSize: 13.5 }} numberOfLines={8}>{n.body}</Text>
        </Pressable>
      ))}
    </View>
  );
}

/* ---------- Ağaç ---------- */
function TreeView({ C, s, data }) {
  const p = data.garden.points, i = treeStage(p), st = STAGES[i];
  const next = STAGES[i + 1];
  const prog = next ? Math.max(0, Math.min(1, (p - st.min) / (next.min - st.min))) : 1;
  const sc = streakCurrent(data.streak);
  const todayDone = data.todos.filter((t) => t.state && t.state[todayKey()] && t.state[todayKey()].done).length
    + (data.routineState[todayKey()] ? Object.values(data.routineState[todayKey()]).filter(Boolean).length : 0);
  return (
    <View>
      <View style={s.treeCard}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: C.text }}>{st.name} {st.emoji}</Text>
        <Text style={{ fontSize: 96, marginVertical: 16 }}>{st.emoji}</Text>
        <View style={s.bar}><View style={[s.barFill, { width: `${prog * 100}%` }]} /></View>
        <Text style={[s.sub, { marginTop: 10, textAlign: "center" }]}>{next ? `Sonraki aşama için ${next.min - p} görev daha 🌟` : "Ağacın tamamen büyüdü! 🎉"}</Text>
      </View>
      <View style={[s.row, { marginTop: 14 }]}>
        <Stat C={C} s={s} v={sc} l="🔥 gün seri" />
        <Stat C={C} s={s} v={p} l="büyüme puanı" />
        <Stat C={C} s={s} v={todayDone} l="bugün biten" />
      </View>
      <Text style={[s.sub, { textAlign: "center", marginTop: 16 }]}>
        {data.streak.best > 0 ? `En uzun serin: ${data.streak.best} gün 🏆` : "Her görev ağacını büyütür 🌱"}</Text>
    </View>
  );
}
function Stat({ C, s, v, l }) {
  return <View style={s.stat}><Text style={{ fontSize: 24, fontWeight: "700", color: C.primaryDeep }}>{v}</Text><Text style={{ fontSize: 11, color: C.sub, fontWeight: "600" }}>{l}</Text></View>;
}

/* ===================== Modaller ===================== */
function Sheet({ C, s, children, onClose }) {
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.handle} />
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </View>
    </Modal>
  );
}
function Field({ s, label, children }) {
  return <View style={{ marginBottom: 14 }}><Text style={s.fieldLabel}>{label}</Text>{children}</View>;
}

function TaskEditor({ C, s, taskModal, selectedKey, onClose, onSave, onDelete, onSkip }) {
  const t = taskModal.task;
  const [text, setText] = useState(t ? t.text : "");
  const [date, setDate] = useState(t ? t.date : (taskModal.date || selectedKey));
  const [time, setTime] = useState(t ? t.time || "" : "");
  const [prio, setPrio] = useState(t ? t.priority : "low");
  const [cat, setCat] = useState(t ? t.category || "" : "");
  const [rep, setRep] = useState(t ? t.repeat : "none");
  const [note, setNote] = useState(t ? t.note || "" : "");
  const [subs, setSubs] = useState(t ? (t.subtasks || []).map((x) => ({ ...x })) : []);
  const save = () => { if (!text.trim()) return; onSave({ text: text.trim(), date, time, priority: prio, category: cat, repeat: rep, note: note.trim(), subtasks: subs.filter((x) => x.text.trim()) }, t && t.id); };
  return (
    <Sheet C={C} s={s} onClose={onClose}>
      <Text style={s.sheetTitle}>{t ? "Görevi düzenle" : "Yeni görev"}</Text>
      <Field s={s} label="Görev"><TextInput style={s.input} value={text} onChangeText={setText} placeholder="Ne yapacaksın?" placeholderTextColor={C.sub} /></Field>
      <View style={s.row}>
        <View style={{ flex: 1, marginRight: 8 }}><Field s={s} label="Tarih"><TextInput style={s.input} value={date} onChangeText={setDate} placeholder="YYYY-AA-GG" placeholderTextColor={C.sub} /></Field></View>
        <View style={{ flex: 1, marginLeft: 8 }}><Field s={s} label="Saat"><TextInput style={s.input} value={time} onChangeText={setTime} placeholder="14:30" placeholderTextColor={C.sub} /></Field></View>
      </View>
      <Field s={s} label="Öncelik"><View style={s.row}>{["low", "med", "high"].map((p) => (
        <Pressable key={p} onPress={() => setPrio(p)} style={[s.segBtn, { flex: 1, paddingVertical: 11, marginHorizontal: 2 }, prio === p && { backgroundColor: PRIO[p] }]}>
          <Text style={{ fontWeight: "700", color: prio === p ? "#fff" : C.sub }}>{PRIO_LABEL[p]}</Text></Pressable>))}</View></Field>
      <Field s={s} label="Kategori"><View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Chip C={C} label="Yok" active={cat === ""} onPress={() => setCat("")} />
        {Object.entries(CATS).map(([k, c]) => <Chip key={k} C={C} label={`${c.emoji} ${c.label}`} color={c.color} active={cat === k} onPress={() => setCat(k)} />)}</View></Field>
      <Field s={s} label="Tekrar"><View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {REPEATS.map((r) => <Chip key={r.k} C={C} label={r.label} active={rep === r.k} onPress={() => setRep(r.k)} />)}</View></Field>
      <Field s={s} label="Alt görevler">
        {subs.map((x, idx) => (
          <View key={x.id} style={[s.row, { marginBottom: 8 }]}>
            <TextInput style={[s.input, { flex: 1 }]} value={x.text} placeholder="Alt görev..." placeholderTextColor={C.sub}
              onChangeText={(v) => setSubs(subs.map((y, j) => j === idx ? { ...y, text: v } : y))} />
            <Pressable onPress={() => setSubs(subs.filter((_, j) => j !== idx))} style={s.delBtn}><Text style={{ color: "#fb7185", fontSize: 18 }}>×</Text></Pressable>
          </View>
        ))}
        <Pressable onPress={() => setSubs([...subs, { id: uid(), text: "" }])} style={s.ghostSmall}><Text style={{ color: C.text, fontWeight: "600" }}>＋ Alt görev ekle</Text></Pressable>
      </Field>
      <Field s={s} label="Not"><TextInput style={[s.input, { height: 70, textAlignVertical: "top" }]} value={note} onChangeText={setNote} multiline placeholder="Detay..." placeholderTextColor={C.sub} /></Field>
      <View style={[s.row, { marginTop: 4 }]}>
        {t ? <Pressable onPress={() => onDelete(t.id)} style={[s.ghost, s.danger]}><Text style={{ color: "#fb7185", fontWeight: "600" }}>Sil</Text></Pressable> : null}
        {t && t.repeat !== "none" ? <Pressable onPress={() => onSkip(t.id)} style={[s.ghost, s.danger, { marginLeft: 8 }]}><Text style={{ color: "#fb7185", fontWeight: "600" }}>Atla</Text></Pressable> : null}
        <Pressable onPress={save} style={[s.primaryBtn, { flex: 1, marginLeft: 8 }]}><Text style={s.primaryText}>Kaydet</Text></Pressable>
      </View>
    </Sheet>
  );
}

function NoteEditor({ C, s, noteModal, onClose, onSave, onDelete }) {
  const n = noteModal.note;
  const [title, setTitle] = useState(n ? n.title : "");
  const [body, setBody] = useState(n ? n.body : "");
  const [color, setColor] = useState(n ? n.color : NOTE_COLORS[0]);
  return (
    <Sheet C={C} s={s} onClose={onClose}>
      <Text style={s.sheetTitle}>{n ? "Notu düzenle" : "Yeni not"}</Text>
      <Field s={s} label="Başlık"><TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="Başlık (opsiyonel)" placeholderTextColor={C.sub} /></Field>
      <Field s={s} label="İçerik"><TextInput style={[s.input, { height: 150, textAlignVertical: "top" }]} value={body} onChangeText={setBody} multiline placeholder="Notunu yaz..." placeholderTextColor={C.sub} /></Field>
      <Field s={s} label="Renk"><View style={s.row}>{NOTE_COLORS.map((c) => (
        <Pressable key={c} onPress={() => setColor(c)} style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: c, marginRight: 10, borderWidth: 3, borderColor: color === c ? C.text : "transparent" }} />))}</View></Field>
      <View style={[s.row, { marginTop: 4 }]}>
        {n ? <Pressable onPress={() => onDelete(n.id)} style={[s.ghost, s.danger]}><Text style={{ color: "#fb7185", fontWeight: "600" }}>Sil</Text></Pressable> : null}
        <Pressable onPress={() => { if (title.trim() || body.trim()) onSave({ title: title.trim(), body: body.trim(), color }, n && n.id); else onClose(); }} style={[s.primaryBtn, { flex: 1, marginLeft: 8 }]}><Text style={s.primaryText}>Kaydet</Text></Pressable>
      </View>
    </Sheet>
  );
}

function RoutineEditor({ C, s, data, onClose, onSave }) {
  const [rows, setRows] = useState(data.routines.length ? data.routines.map((r) => ({ ...r })) : [{ id: uid(), text: "" }]);
  return (
    <Sheet C={C} s={s} onClose={onClose}>
      <Text style={s.sheetTitle}>Günlük Rutinler</Text>
      <Text style={[s.sub, { marginBottom: 14 }]}>Her gün tekrar eden alışkanlıkların. Tamamladıkça ağacın büyür 🌱</Text>
      {rows.map((r, idx) => (
        <View key={r.id} style={[s.row, { marginBottom: 8 }]}>
          <TextInput style={[s.input, { flex: 1 }]} value={r.text} placeholder="örn. Su iç, spor yap..." placeholderTextColor={C.sub}
            onChangeText={(v) => setRows(rows.map((y, j) => j === idx ? { ...y, text: v } : y))} />
          <Pressable onPress={() => setRows(rows.filter((_, j) => j !== idx))} style={s.delBtn}><Text style={{ color: "#fb7185", fontSize: 18 }}>×</Text></Pressable>
        </View>
      ))}
      <Pressable onPress={() => setRows([...rows, { id: uid(), text: "" }])} style={s.ghostSmall}><Text style={{ color: C.text, fontWeight: "600" }}>＋ Rutin ekle</Text></Pressable>
      <View style={[s.row, { marginTop: 14 }]}>
        <Pressable onPress={onClose} style={s.ghost}><Text style={{ color: C.text, fontWeight: "600" }}>Vazgeç</Text></Pressable>
        <Pressable onPress={() => onSave(rows.filter((r) => r.text.trim()).map((r) => ({ id: r.id, text: r.text.trim() })))} style={[s.primaryBtn, { flex: 1, marginLeft: 8 }]}><Text style={s.primaryText}>Kaydet</Text></Pressable>
      </View>
    </Sheet>
  );
}

function Pomodoro({ C, s, data, mutate, showToast, onClose }) {
  const [techKey, setTechKey] = useState(data.pomoTech || "pomodoro");
  const [mode, setMode] = useState("focus");
  const tech = TECHNIQUES[techKey];
  const [remaining, setRemaining] = useState(tech.focus * 60);
  const [running, setRunning] = useState(false);
  const intRef = useRef(null);

  useEffect(() => {
    if (!running) { clearInterval(intRef.current); return; }
    intRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intRef.current); setRunning(false);
          if (mode === "focus") { showToast("Odak tamamlandı! Mola zamanı ☕"); setMode("short"); return tech.short * 60; }
          showToast("Mola bitti! Devam 💪"); setMode("focus"); return tech.focus * 60;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, mode, techKey]);

  const setT = (k) => { setRunning(false); setTechKey(k); setMode("focus"); setRemaining(TECHNIQUES[k].focus * 60); mutate((d) => { d.pomoTech = k; }); };
  const setM = (m) => { setRunning(false); setMode(m); setRemaining(tech[m] * 60); };
  const fmt = (sec) => `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;
  const total = tech[mode] * 60;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.centerWrap} pointerEvents="box-none">
        <ScrollView style={{ flexGrow: 0, width: "100%", maxWidth: 380 }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} keyboardShouldPersistTaps="handled">
          <View style={s.pomo}>
            <Text style={s.sheetTitle}>Çalışma Tekniği</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {Object.entries(TECHNIQUES).map(([k, tk]) => (
                <Pressable key={k} onPress={() => setT(k)} style={[s.techOpt, techKey === k && { backgroundColor: C.primary, borderColor: "transparent" }]}>
                  <Text style={{ fontWeight: "600", fontSize: 13, color: techKey === k ? "#fff" : C.text }}>{tk.name}</Text></Pressable>
              ))}
            </View>
            <Text style={[s.sub, { marginBottom: 14 }]}>{tech.desc}</Text>
            <View style={[s.row, s.seg, { marginBottom: 18 }]}>
              <Pressable onPress={() => setM("focus")} style={[s.segBtn, { flex: 1 }, mode === "focus" && { backgroundColor: C.card }]}><Text style={{ fontWeight: "600", color: mode === "focus" ? C.primaryDeep : C.sub }}>Odak·{tech.focus}dk</Text></Pressable>
              <Pressable onPress={() => setM("short")} style={[s.segBtn, { flex: 1 }, mode === "short" && { backgroundColor: C.card }]}><Text style={{ fontWeight: "600", color: mode === "short" ? C.primaryDeep : C.sub }}>Mola·{tech.short}dk</Text></Pressable>
              {tech.longEvery > 0 ? <Pressable onPress={() => setM("long")} style={[s.segBtn, { flex: 1 }, mode === "long" && { backgroundColor: C.card }]}><Text style={{ fontWeight: "600", color: mode === "long" ? C.primaryDeep : C.sub }}>Uzun·{tech.long}dk</Text></Pressable> : null}
            </View>
            <Text style={{ fontSize: 56, fontWeight: "700", color: C.text, textAlign: "center" }}>{fmt(remaining)}</Text>
            <View style={[s.bar, { marginVertical: 16 }]}><View style={[s.barFill, { width: `${(1 - remaining / total) * 100}%`, backgroundColor: mode === "focus" ? C.primary : "#34d399" }]} /></View>
            <View style={s.row}>
              <Pressable onPress={() => setRunning((r) => !r)} style={[s.primaryBtn, { flex: 2 }]}><Text style={s.primaryText}>{running ? "Duraklat" : "Başlat"}</Text></Pressable>
              <Pressable onPress={() => setM(mode)} style={[s.ghost, { flex: 1, marginLeft: 8 }]}><Text style={{ color: C.text, fontWeight: "600", textAlign: "center" }}>Sıfırla</Text></Pressable>
            </View>
            <Pressable onPress={onClose} style={{ marginTop: 14 }}><Text style={[s.sub, { textAlign: "center" }]}>Kapat</Text></Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

/* ===================== Stiller ===================== */
function makeStyles(C) {
  return StyleSheet.create({
    flex: { flex: 1 },
    row: { flexDirection: "row", alignItems: "center" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10 },
    logo: { width: 42, height: 42, borderRadius: 13, backgroundColor: C.primary, alignItems: "center", justifyContent: "center", marginRight: 11 },
    h1: { fontSize: 20, fontWeight: "700", color: C.text },
    h2: { fontSize: 16, fontWeight: "700", color: C.text },
    sub: { fontSize: 12.5, color: C.sub, fontWeight: "500" },
    iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
    progressCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16 },
    ring: { width: 54, height: 54, borderRadius: 27, borderWidth: 5, borderColor: C.primary, alignItems: "center", justifyContent: "center", marginRight: 14 },
    progressTitle: { fontWeight: "700", fontSize: 15, color: C.text },
    dayPill: { width: 50, paddingVertical: 9, borderRadius: 15, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, alignItems: "center", marginRight: 8 },
    dayDow: { fontSize: 10, fontWeight: "700", color: C.sub, textTransform: "uppercase" },
    dayNum: { fontSize: 17, fontWeight: "700", color: C.text, marginTop: 2 },
    routineCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14 },
    smallBtn: { backgroundColor: C.soft, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
    seg: { backgroundColor: C.soft, borderRadius: 12, padding: 4 },
    segBtn: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 9, alignItems: "center" },
    taskItem: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, borderLeftWidth: 4, padding: 14, marginBottom: 10 },
    mini: { flexDirection: "row", alignItems: "center", backgroundColor: C.soft, borderRadius: 11, borderLeftWidth: 3, padding: 9, marginBottom: 7 },
    weekDay: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 13, marginBottom: 12 },
    cell: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, alignItems: "center", justifyContent: "center" },
    noteCard: { borderRadius: 14, borderWidth: 1, borderColor: C.border, borderLeftWidth: 4, padding: 14, marginBottom: 10 },
    treeCard: { backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 18, alignItems: "center" },
    bar: { height: 10, borderRadius: 6, backgroundColor: C.soft, width: "100%", overflow: "hidden" },
    barFill: { height: "100%", borderRadius: 6, backgroundColor: "#34d399" },
    stat: { flex: 1, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 13, alignItems: "center", marginHorizontal: 4 },
    nav: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-around",
      backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 8, paddingBottom: 24 },
    navBtn: { alignItems: "center", paddingHorizontal: 6 },
    navLabel: { fontSize: 11, fontWeight: "600", marginTop: 2 },
    fab: { width: 56, height: 56, borderRadius: 19, backgroundColor: C.primary, alignItems: "center", justifyContent: "center", marginTop: -24,
      shadowColor: C.primary, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
    toast: { position: "absolute", bottom: 100, alignSelf: "center", backgroundColor: C.text, paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14 },
    toastText: { color: C.bg, fontWeight: "700" },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(30,20,55,0.45)" },
    sheet: { position: "absolute", bottom: 0, left: 0, right: 0, maxHeight: "90%", backgroundColor: C.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: 34 },
    handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: C.sub, opacity: 0.4, alignSelf: "center", marginBottom: 14 },
    sheetTitle: { fontSize: 19, fontWeight: "700", color: C.text, marginBottom: 16 },
    fieldLabel: { fontSize: 12.5, fontWeight: "600", color: C.sub, marginBottom: 7 },
    input: { backgroundColor: C.soft, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.text },
    primaryBtn: { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
    primaryText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    ghost: { backgroundColor: C.soft, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, alignItems: "center" },
    ghostSmall: { backgroundColor: C.soft, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, alignSelf: "flex-start" },
    danger: { backgroundColor: "rgba(251,113,133,0.13)" },
    delBtn: { width: 40, height: 40, borderRadius: 11, backgroundColor: "rgba(251,113,133,0.13)", alignItems: "center", justifyContent: "center", marginLeft: 8 },
    centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
    pomo: { width: "100%", backgroundColor: C.card, borderRadius: 26, padding: 22 },
    techOpt: { borderWidth: 1.5, borderColor: C.border, backgroundColor: C.soft, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginRight: 8, marginBottom: 8 },
  });
}

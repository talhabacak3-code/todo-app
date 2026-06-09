/* ==========================================================================
   LinguaWorld — Uygulama Mantığı
   ========================================================================== */
(function () {
  "use strict";
  const { LANGUAGES, TOP_LANGUAGES_INFO, COURSES, GRAMMAR, READINGS, CONVERSATIONS } = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /* ---------- DURUM / KAYIT ---------- */
  const SKEY = "linguaworld.v1";
  const defaultState = () => ({
    lang: "en",
    streak: 0,
    lastDay: null,
    progress: {}, // lang -> { lessonsDone:[], grammarDone:[], readDone:[], convDone:[], xp:int }
  });
  let state = load();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(SKEY));
      if (raw && raw.progress) return raw;
    } catch (e) {}
    return defaultState();
  }
  function save() { localStorage.setItem(SKEY, JSON.stringify(state)); }
  function prog() {
    if (!state.progress[state.lang]) {
      state.progress[state.lang] = { lessonsDone: [], grammarDone: [], readDone: [], convDone: [], xp: 0 };
    }
    return state.progress[state.lang];
  }

  /* Günlük seri güncelle */
  function touchStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastDay === today) return;
    const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    state.streak = state.lastDay === yest ? state.streak + 1 : 1;
    state.lastDay = today;
    save();
  }

  /* ---------- ÜST İSTATİSTİKLER ---------- */
  function renderStats() {
    const L = LANGUAGES[state.lang];
    $("#curFlag").textContent = L.flag;
    $("#curLangName").textContent = L.name;
    $("#statStreak").textContent = state.streak;
    $("#statXp").textContent = prog().xp;
    $("#statHearts").textContent = hearts;
    document.documentElement.style.setProperty("--accent", L.color);
  }

  /* Canlar (oturum içi) */
  let hearts = 5;

  /* ---------- GÖRÜNÜM YÖNLENDİRME ---------- */
  let currentView = "learn";
  function setView(v) {
    currentView = v;
    $$(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    const c = $("#content");
    c.scrollTop = 0;
    ({ learn: renderLearn, grammar: renderGrammar, reading: renderReading, speaking: renderSpeaking, explore: renderExplore }[v] || renderLearn)(c);
  }

  /* ====================================================================
     ÖĞREN — Ders yolu (Duolingo tarzı)
     ==================================================================== */
  function renderLearn(c) {
    const units = COURSES[state.lang] || [];
    const done = prog().lessonsDone;
    c.innerHTML = "";
    c.appendChild(el("h1", "page-title", `${LANGUAGES[state.lang].flag} ${LANGUAGES[state.lang].name} Dersleri`));
    c.appendChild(el("p", "page-sub", "Dersleri sırayla tamamla. Her ders XP kazandırır ve bir sonrakini açar."));

    if (!units.length) { c.appendChild(emptyBox("Bu dil için ders yakında eklenecek.")); return; }

    // tüm derslerin düz listesi (kilit mantığı için)
    const flat = [];
    units.forEach((u) => u.lessons.forEach((l) => flat.push(l.id)));

    units.forEach((u) => {
      const box = el("section", "unit");
      const head = el("div", "unit-head");
      head.style.background = LANGUAGES[state.lang].color;
      head.innerHTML = `<span class="u-icon">${u.icon}</span><div><h3>${u.title}</h3><p>${u.desc}</p></div>`;
      box.appendChild(head);

      const path = el("div", "lesson-path");
      u.lessons.forEach((l) => {
        const idx = flat.indexOf(l.id);
        const isDone = done.includes(l.id);
        const prevDone = idx === 0 || done.includes(flat[idx - 1]);
        const locked = !isDone && !prevDone;
        const isCurrent = !isDone && prevDone;

        const row = el("div", "node-row");
        const btn = el("button", "lesson-node " + (isDone ? "done" : locked ? "locked" : "current") + (isCurrent ? " current" : ""));
        btn.innerHTML = isDone ? `<span>${u.icon}</span><span class="crown">👑</span>` : locked ? "🔒" : "⭐";
        btn.title = l.title;
        if (!locked) btn.onclick = () => startLesson(u, l);
        const wrap = el("div", "", "");
        wrap.style.display = "flex";
        wrap.style.flexDirection = "column";
        wrap.style.alignItems = "center";
        wrap.appendChild(btn);
        wrap.appendChild(el("div", "node-label", l.title));
        row.appendChild(wrap);
        path.appendChild(row);
      });
      box.appendChild(path);
      c.appendChild(box);
    });
  }

  /* ====================================================================
     DERS MOTORU
     ==================================================================== */
  let lessonCtx = null;
  function startLesson(unit, lesson) {
    hearts = 5;
    lessonCtx = { unit, lesson, exercises: lesson.exercises.slice(), i: 0, correct: 0, total: lesson.exercises.length, gained: 0, answered: false };
    $("#lessonOverlay").hidden = false;
    $("#lessonHearts").textContent = hearts;
    renderExercise();
  }
  function closeLesson() { $("#lessonOverlay").hidden = true; lessonCtx = null; renderStats(); setView(currentView); }

  function renderExercise() {
    const ctx = lessonCtx;
    ctx.answered = false;
    ctx.userCorrect = false;
    $("#lessonProgress").style.width = (ctx.i / ctx.total) * 100 + "%";
    $("#lessonHearts").textContent = hearts;
    const body = $("#lessonBody");
    const fb = $("#lessonFeedback"); fb.textContent = ""; fb.className = "feedback";
    const check = $("#lessonCheck");
    check.disabled = true; check.classList.remove("next"); check.textContent = "KONTROL ET";

    if (ctx.i >= ctx.total) return finishLesson();
    const ex = ctx.exercises[ctx.i];
    body.innerHTML = "";
    body.classList.add("pop");
    setTimeout(() => body.classList.remove("pop"), 250);

    ({ choose: exChoose, translate: exTranslate, match: exMatch, fill: exFill }[ex.type] || exChoose)(body, ex);
  }

  /* --- çoktan seçmeli --- */
  function exChoose(body, ex) {
    body.appendChild(el("div", "ex-instr", "Doğru cevabı seç"));
    body.appendChild(el("div", "ex-q", ex.q));
    const wrap = el("div", "choices");
    let sel = null;
    shuffle(ex.options.slice()).forEach((opt) => {
      const b = el("button", "choice", opt);
      b.onclick = () => {
        if (lessonCtx.answered) return;
        $$(".choice", wrap).forEach((x) => x.classList.remove("sel"));
        b.classList.add("sel"); sel = opt;
        $("#lessonCheck").disabled = false;
      };
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
    lessonCtx.evaluate = () => {
      const ok = sel === ex.a;
      $$(".choice", wrap).forEach((x) => {
        if (x.textContent === ex.a) x.classList.add("correct");
        else if (x.textContent === sel && !ok) x.classList.add("wrong");
        x.style.pointerEvents = "none";
      });
      return { ok, answer: ex.a };
    };
  }

  /* --- boşluk doldurma (seçenekli) --- */
  function exFill(body, ex) {
    body.appendChild(el("div", "ex-instr", "Boşluğu doldur"));
    body.appendChild(el("div", "ex-q", ex.q));
    const wrap = el("div", "choices");
    let sel = null;
    shuffle(ex.options.slice()).forEach((opt) => {
      const b = el("button", "choice", opt);
      b.onclick = () => {
        if (lessonCtx.answered) return;
        $$(".choice", wrap).forEach((x) => x.classList.remove("sel"));
        b.classList.add("sel"); sel = opt;
        $("#lessonCheck").disabled = false;
      };
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
    lessonCtx.evaluate = () => {
      const ok = sel === ex.a;
      $$(".choice", wrap).forEach((x) => {
        if (x.textContent === ex.a) x.classList.add("correct");
        else if (x.textContent === sel && !ok) x.classList.add("wrong");
        x.style.pointerEvents = "none";
      });
      return { ok, answer: ex.a };
    };
  }

  /* --- çeviri (kelime bankası) --- */
  function exTranslate(body, ex) {
    body.appendChild(el("div", "ex-instr", "Bu cümleyi çevir"));
    body.appendChild(el("div", "ex-q", ex.q));
    const answer = el("div", "answer-area");
    const bank = el("div", "bank-area");
    body.appendChild(answer);
    body.appendChild(bank);
    const picked = [];

    shuffle(ex.bank.slice()).forEach((w) => {
      const chip = el("button", "word-chip", w);
      chip.onclick = () => {
        if (lessonCtx.answered) return;
        if (chip.classList.contains("used")) return;
        chip.classList.add("used");
        const a = el("button", "word-chip", w);
        a.onclick = () => {
          if (lessonCtx.answered) return;
          a.remove(); chip.classList.remove("used");
          const j = picked.indexOf(a); if (j > -1) picked.splice(j, 1);
          $("#lessonCheck").disabled = picked.length === 0;
        };
        picked.push(a); answer.appendChild(a);
        $("#lessonCheck").disabled = false;
      };
      bank.appendChild(chip);
    });

    lessonCtx.evaluate = () => {
      const got = picked.map((c) => c.textContent).join(" ").trim();
      const ok = norm(got) === norm(ex.a);
      return { ok, answer: ex.a };
    };
  }

  /* --- eşleştirme --- */
  function exMatch(body, ex) {
    body.appendChild(el("div", "ex-instr", "Eşleştir"));
    body.appendChild(el("div", "ex-q", "Kelimeleri anlamlarıyla eşleştir"));
    const grid = el("div", "match-grid");
    const left = el("div", "match-col");
    const right = el("div", "match-col");
    const lefts = ex.pairs.map((p) => p[0]);
    const rights = shuffle(ex.pairs.map((p) => p[1]));
    const map = {}; ex.pairs.forEach((p) => (map[p[0]] = p[1]));

    let selL = null, selR = null, matched = 0;
    const mkItem = (txt, side) => {
      const b = el("button", "match-item", txt);
      b.dataset.side = side; b.dataset.txt = txt;
      b.onclick = () => {
        if (b.classList.contains("matched")) return;
        if (side === "L") { $$(".match-item[data-side=L]", grid).forEach((x) => x.classList.remove("sel")); selL = b; }
        else { $$(".match-item[data-side=R]", grid).forEach((x) => x.classList.remove("sel")); selR = b; }
        b.classList.add("sel");
        if (selL && selR) {
          if (map[selL.dataset.txt] === selR.dataset.txt) {
            selL.classList.add("matched"); selR.classList.add("matched");
            selL.classList.remove("sel"); selR.classList.remove("sel");
            matched++;
            if (matched === ex.pairs.length) { $("#lessonCheck").disabled = false; $("#lessonCheck").textContent = "DEVAM"; }
          } else {
            const a = selL, b2 = selR;
            a.classList.add("miss"); b2.classList.add("miss");
            setTimeout(() => { a.classList.remove("miss", "sel"); b2.classList.remove("miss", "sel"); }, 500);
          }
          selL = null; selR = null;
        }
      };
      return b;
    };
    lefts.forEach((t) => left.appendChild(mkItem(t, "L")));
    rights.forEach((t) => right.appendChild(mkItem(t, "R")));
    grid.appendChild(left); grid.appendChild(right);
    body.appendChild(grid);
    // eşleştirmede "kontrol" gerekmiyor; tamamlanınca direkt doğru say
    lessonCtx.evaluate = () => ({ ok: true, answer: "", silent: true });
  }

  /* --- kontrol et / devam --- */
  function onCheck() {
    const ctx = lessonCtx;
    const check = $("#lessonCheck");
    if (!ctx.answered) {
      const res = ctx.evaluate();
      ctx.answered = true;
      ctx.userCorrect = res.ok;
      const fb = $("#lessonFeedback");
      if (res.silent) { ctx.i++; ctx.correct++; return renderExercise(); }
      if (res.ok) {
        ctx.correct++;
        fb.textContent = "✔ Harika! Doğru.";
        fb.className = "feedback ok";
        playTone(660, 0.12);
      } else {
        hearts = Math.max(0, hearts - 1);
        $("#lessonHearts").textContent = hearts;
        fb.innerHTML = `✘ Doğrusu: <b>${res.answer}</b>`;
        fb.className = "feedback no";
        playTone(180, 0.18);
      }
      check.textContent = ctx.i + 1 >= ctx.total ? "BİTİR" : "DEVAM";
      check.classList.add("next");
      check.disabled = false;
      if (hearts === 0) { setTimeout(() => failLesson(), 700); }
    } else {
      ctx.i++;
      renderExercise();
    }
  }

  function failLesson() {
    const body = $("#lessonBody");
    body.innerHTML = `<div class="lesson-end"><div class="big">💔</div><h2>Canların bitti!</h2>
      <p class="page-sub">Sorun değil — tekrar dene, her seferinde daha iyi olacaksın.</p></div>`;
    $("#lessonFeedback").textContent = "";
    const check = $("#lessonCheck");
    check.textContent = "TEKRAR DENE"; check.classList.remove("next"); check.disabled = false;
    check.onclick = () => { startLesson(lessonCtx.unit, lessonCtx.lesson); };
  }

  function finishLesson() {
    const ctx = lessonCtx;
    const xpGain = 10 + ctx.correct * 2;
    const p = prog();
    if (!p.lessonsDone.includes(ctx.lesson.id)) p.lessonsDone.push(ctx.lesson.id);
    p.xp += xpGain;
    touchStreak();
    save();
    playTone(523, 0.1); setTimeout(() => playTone(784, 0.18), 120);
    $("#lessonProgress").style.width = "100%";
    const body = $("#lessonBody");
    const acc = Math.round((ctx.correct / ctx.total) * 100);
    body.innerHTML = `
      <div class="lesson-end">
        <div class="big">🎉</div>
        <h2>Ders tamamlandı!</h2>
        <div class="end-stats">
          <div class="end-stat" style="color:var(--yellow)">+${xpGain}<small>XP</small></div>
          <div class="end-stat" style="color:var(--green-d)">${acc}%<small>Doğruluk</small></div>
          <div class="end-stat" style="color:var(--orange)">🔥 ${state.streak}<small>Seri</small></div>
        </div>
      </div>`;
    $("#lessonFeedback").textContent = "";
    const check = $("#lessonCheck");
    check.textContent = "DEVAM ET"; check.classList.remove("next"); check.disabled = false;
    check.onclick = () => { check.onclick = null; closeLesson(); };
  }

  /* ====================================================================
     GRAMER
     ==================================================================== */
  function renderGrammar(c) {
    const list = GRAMMAR[state.lang] || [];
    c.innerHTML = "";
    c.appendChild(el("h1", "page-title", "📐 Gramer"));
    c.appendChild(el("p", "page-sub", "Konu anlatımları, tablolar ve örnek cümlelerle adım adım dilbilgisi."));
    if (!list.length) { c.appendChild(emptyBox("Bu dil için gramer konuları yakında.")); return; }
    const grid = el("div", "card-grid");
    list.forEach((g) => {
      const done = prog().grammarDone.includes(g.id);
      const card = el("div", "card" + (done ? " complete" : ""));
      card.innerHTML = `<div class="c-top"><span class="c-icon">📘</span><div><h4>${g.title}</h4><span class="badge lvl">${g.level}</span></div></div><p>${g.summary}</p>`;
      card.onclick = () => openGrammar(g);
      grid.appendChild(card);
    });
    c.appendChild(grid);
  }
  function openGrammar(g) {
    const c = $("#content"); c.scrollTop = 0;
    const d = el("div", "detail");
    d.innerHTML = `<button class="back">← Gramer konuları</button>
      <h2>${g.title}</h2><div class="lead">${g.summary} • Seviye ${g.level}</div>
      <div class="g-body">${g.body}</div>
      <div class="examples"><h3>Örnek Cümleler</h3>${g.examples.map(([en, tr]) => `<div class="ex-row"><span class="en">${en}</span><span class="tr">${tr}</span></div>`).join("")}</div>
      <div style="margin-top:24px"><button class="btn-check" id="gDone">${prog().grammarDone.includes(g.id) ? "✓ OKUDUM" : "OKUDUM OLARAK İŞARETLE"}</button></div>`;
    c.innerHTML = ""; c.appendChild(d);
    $(".back", d).onclick = () => setView("grammar");
    $("#gDone").onclick = () => {
      const p = prog();
      if (!p.grammarDone.includes(g.id)) { p.grammarDone.push(g.id); p.xp += 5; save(); toast("+5 XP — konu tamamlandı!"); renderStats(); }
      $("#gDone").textContent = "✓ OKUDUM";
    };
  }

  /* ====================================================================
     OKUMA
     ==================================================================== */
  function renderReading(c) {
    const list = READINGS[state.lang] || [];
    c.innerHTML = "";
    c.appendChild(el("h1", "page-title", "📖 Okuma"));
    c.appendChild(el("p", "page-sub", "Seviyene uygun kısa hikayeler. Cümleye dokununca Türkçesi açılır."));
    if (!list.length) { c.appendChild(emptyBox("Bu dil için okuma metinleri yakında.")); return; }
    const grid = el("div", "card-grid");
    list.forEach((r) => {
      const done = prog().readDone.includes(r.id);
      const card = el("div", "card" + (done ? " complete" : ""));
      card.innerHTML = `<div class="c-top"><span class="c-icon">${r.cover}</span><div><h4>${r.title}</h4><span class="badge lvl">${r.level}</span></div></div><p>${r.desc}</p><div class="c-meta"><span class="badge">⏱ ${r.minutes} dk</span><span class="badge">${r.paragraphs.length} cümle</span></div>`;
      card.onclick = () => openReading(r);
      grid.appendChild(card);
    });
    c.appendChild(grid);
  }
  function openReading(r) {
    const c = $("#content"); c.scrollTop = 0;
    const d = el("div", "reader");
    d.innerHTML = `<button class="back" style="background:none;border:none;color:var(--blue-d);font-family:inherit;font-weight:800;cursor:pointer;font-size:14px;margin-bottom:8px">← Tüm metinler</button>
      <div class="r-cover">${r.cover}</div>
      <h2>${r.title}</h2>
      <div class="r-meta">Seviye ${r.level} • ${r.minutes} dk okuma</div>
      <div class="read-controls">
        <button class="toggle-tr" id="allTr">Tüm çevirileri göster</button>
      </div>
      <div id="paras"></div>
      <div class="vocab-box"><h3>📌 Kelimeler</h3><div class="vocab-list">${r.vocab.map(([w, t]) => `<span class="vocab-item"><b>${w}</b> — ${t}</span>`).join("")}</div></div>
      <div style="text-align:center;margin-top:24px"><button class="btn-check" id="rDone">${prog().readDone.includes(r.id) ? "✓ OKUNDU" : "OKUDUM (+8 XP)"}</button></div>`;
    c.innerHTML = ""; c.appendChild(d);
    const paras = $("#paras", d);
    r.paragraphs.forEach(([s, tr]) => {
      const p = el("div", "r-para");
      p.innerHTML = `<span class="sentence">${s}</span><span class="sent-tr">↳ ${tr}</span>`;
      p.onclick = () => p.classList.toggle("show-tr");
      paras.appendChild(p);
    });
    $(".back", d).onclick = () => setView("reading");
    let allOn = false;
    $("#allTr").onclick = () => {
      allOn = !allOn;
      $("#allTr").classList.toggle("on", allOn);
      $("#allTr").textContent = allOn ? "Çevirileri gizle" : "Tüm çevirileri göster";
      $$(".r-para", paras).forEach((p) => p.classList.toggle("show-tr", allOn));
    };
    $("#rDone").onclick = () => {
      const p = prog();
      if (!p.readDone.includes(r.id)) { p.readDone.push(r.id); p.xp += 8; touchStreak(); save(); toast("+8 XP — okuma tamamlandı!"); renderStats(); }
      $("#rDone").textContent = "✓ OKUNDU";
    };
  }

  /* ====================================================================
     KONUŞMA
     ==================================================================== */
  function renderSpeaking(c) {
    const list = CONVERSATIONS[state.lang] || [];
    c.innerHTML = "";
    c.appendChild(el("h1", "page-title", "💬 Konuşma Pratiği"));
    c.appendChild(el("p", "page-sub", "Gerçek hayat senaryoları. Doğru cevabı seçerek diyaloğu ilerlet."));
    if (!list.length) { c.appendChild(emptyBox("Bu dil için konuşma senaryoları yakında.")); return; }
    const grid = el("div", "card-grid");
    list.forEach((cv) => {
      const done = prog().convDone.includes(cv.id);
      const card = el("div", "card" + (done ? " complete" : ""));
      card.innerHTML = `<div class="c-top"><span class="c-icon">${cv.icon}</span><div><h4>${cv.title}</h4><span class="badge lvl">${cv.level}</span></div></div><p>${cv.desc}</p>`;
      card.onclick = () => openConversation(cv);
      grid.appendChild(card);
    });
    c.appendChild(grid);
  }
  function openConversation(cv) {
    const c = $("#content"); c.scrollTop = 0;
    const chat = el("div", "chat");
    chat.innerHTML = `<div class="chat-head"><span class="c-icon">${cv.icon}</span><div><h4 style="font-weight:900;font-size:17px">${cv.title}</h4><span class="badge lvl">${cv.level}</span></div>
      <button class="back" style="margin-left:auto;background:none;border:none;color:var(--blue-d);font-family:inherit;font-weight:800;cursor:pointer">✕</button></div>
      <div class="chat-stream" id="stream"></div>
      <div class="chat-options" id="opts"></div>`;
    c.innerHTML = ""; c.appendChild(chat);
    $(".back", chat).onclick = () => setView("speaking");

    let step = 0;
    const stream = $("#stream", chat);
    const opts = $("#opts", chat);

    function addBubble(side, text, tr) {
      const b = el("div", "bubble " + side);
      b.innerHTML = `${text}${tr ? `<span class="b-tr">${tr}</span>` : ""}`;
      stream.appendChild(b);
      stream.scrollTop = stream.scrollHeight;
    }
    function next() {
      opts.innerHTML = "";
      if (step >= cv.steps.length) return finishConv();
      const s = cv.steps[step];
      // "You" konuşan adımları kullanıcı tarafı sayılır ama burada hep them gösteriyoruz
      if (s.speaker === "You") {
        addBubble("me", s.text, s.tr);
        step++; return next();
      }
      addBubble("them", `<b style="font-size:12px;opacity:.6;display:block">${s.speaker}</b>${s.text}`, s.tr);
      shuffle(s.options.slice()).forEach((o) => {
        const b = el("button", "opt-btn", `${o.text}${o.tr ? `<span class="o-tr">${o.tr}</span>` : ""}`);
        b.onclick = () => {
          if (o.correct) {
            addBubble("me", o.text, o.tr);
            playTone(660, 0.1);
            step++; next();
          } else {
            b.classList.add("wrong");
            playTone(180, 0.15);
          }
        };
        opts.appendChild(b);
      });
    }
    function finishConv() {
      const p = prog();
      let gained = 0;
      if (!p.convDone.includes(cv.id)) { p.convDone.push(cv.id); gained = 12; p.xp += gained; touchStreak(); save(); renderStats(); }
      opts.innerHTML = "";
      const done = el("div", "chat-done");
      done.innerHTML = `<div class="big">🎊</div><h2 style="font-weight:900;font-size:22px">Diyalog tamamlandı!</h2>
        <p class="page-sub">${gained ? "+" + gained + " XP kazandın." : "Tekrar pratiğin de faydası var!"}</p>
        <button class="btn-check" id="convBack">SENARYOLARA DÖN</button>`;
      stream.appendChild(done);
      stream.scrollTop = stream.scrollHeight;
      $("#convBack").onclick = () => setView("speaking");
    }
    next();
  }

  /* ====================================================================
     DİLLER (EXPLORE)
     ==================================================================== */
  function renderExplore(c) {
    c.innerHTML = "";
    c.appendChild(el("h1", "page-title", "🌐 Diller"));
    c.appendChild(el("p", "page-sub", "Öğrenmek istediğin dili seç ve dünyanın en çok konuşulan dillerini keşfet."));

    const grid = el("div", "world-grid");
    Object.entries(LANGUAGES).forEach(([code, L]) => {
      const card = el("div", "lang-card" + (code === state.lang ? " active-lang" : ""));
      card.style.borderBottomColor = L.color;
      const p = state.progress[code];
      const xp = p ? p.xp : 0;
      card.innerHTML = `<div class="flag">${L.flag}</div><h4>${L.name}</h4><div class="nat">${L.nativeName}</div>
        <span class="spk">${L.speakers}</span><p>${L.desc}</p>
        <div style="margin-top:10px;font-weight:800;font-size:13px;color:var(--muted)">${code === state.lang ? "✓ Aktif dil" : `⭐ ${xp} XP`}</div>`;
      card.onclick = () => { switchLang(code); setView("learn"); };
      grid.appendChild(card);
    });
    c.appendChild(grid);

    c.appendChild(el("h2", "page-title", "🏆 Dünyada En Çok Konuşulan Diller"));
    c.appendChild(el("p", "page-sub", "Toplam konuşan sayısına göre (ana dili + ikinci dil olarak)."));
    const table = el("table", "rank-table");
    table.innerHTML = `<tr><th>#</th><th></th><th>Dil</th><th>Toplam</th><th>Ana dili</th><th>Not</th></tr>` +
      TOP_LANGUAGES_INFO.map((r) => `<tr><td class="r-rank">${r.rank}</td><td class="r-flag">${r.flag}</td><td><b>${r.name}</b></td><td>${r.total}</td><td>${r.native}</td><td class="muted">${r.note}</td></tr>`).join("");
    c.appendChild(table);
  }

  /* ---------- DİL DEĞİŞTİR ---------- */
  function switchLang(code) {
    state.lang = code; save(); renderStats();
    toast(`${LANGUAGES[code].flag} ${LANGUAGES[code].name} seçildi`);
  }
  function openLangModal() {
    const grid = $("#langGrid"); grid.innerHTML = "";
    Object.entries(LANGUAGES).forEach(([code, L]) => {
      const b = el("button", "lang-pick" + (code === state.lang ? " active" : ""));
      b.innerHTML = `<span class="pf">${L.flag}</span><div><div class="pn">${L.name}</div><div class="pnn">${L.nativeName}</div></div>`;
      b.onclick = () => { switchLang(code); $("#langOverlay").hidden = true; setView("learn"); };
      grid.appendChild(b);
    });
    $("#langOverlay").hidden = false;
  }

  /* ---------- YARDIMCILAR ---------- */
  function emptyBox(msg) { return el("div", "detail", `<p class="muted" style="text-align:center;padding:30px 0">${msg}</p>`); }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function norm(s) { return s.toLowerCase().replace(/[.,!?'"]/g, "").replace(/\s+/g, " ").trim(); }
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2200); }

  /* Web Audio — basit ses geri bildirimi */
  let audioCtx;
  function playTone(freq, dur) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + dur + 0.02);
    } catch (e) {}
  }

  /* ---------- OLAYLAR ---------- */
  $$(".nav-btn").forEach((b) => (b.onclick = () => setView(b.dataset.view)));
  $("#brandHome").onclick = () => setView("learn");
  $("#langSwitch").onclick = openLangModal;
  $("#langCancel").onclick = () => ($("#langOverlay").hidden = true);
  $("#langOverlay").onclick = (e) => { if (e.target.id === "langOverlay") $("#langOverlay").hidden = true; };
  $("#lessonClose").onclick = () => { if (confirm("Dersten çıkmak istediğine emin misin? İlerlemen kaydedilmez.")) closeLesson(); };
  $("#lessonCheck").onclick = onCheck;

  /* ---------- BAŞLAT ---------- */
  renderStats();
  setView("learn");
})();

/* ==========================================================================
   LinguaWorld — İçerik Verisi
   Diller, dersler (Duolingo tarzı), gramer, okuma ve konuşma içerikleri.
   Her dil için: units (üniteler) -> lessons -> exercises
   ========================================================================== */

const LANGUAGES = {
  en: {
    name: "İngilizce",
    nativeName: "English",
    flag: "🇬🇧",
    color: "#1cb0f6",
    speakers: "1.5 milyar konuşan",
    desc: "Dünyanın ortak dili. İş, bilim, internet ve seyahatte birinci sıra.",
  },
  es: {
    name: "İspanyolca",
    nativeName: "Español",
    flag: "🇪🇸",
    color: "#ff9600",
    speakers: "560 milyon konuşan",
    desc: "20+ ülkenin resmi dili. Latin Amerika ve İspanya'nın dili.",
  },
  de: {
    name: "Almanca",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    color: "#ce82ff",
    speakers: "130 milyon konuşan",
    desc: "Avrupa'nın en güçlü ekonomisinin dili. Mühendislik ve felsefe.",
  },
  fr: {
    name: "Fransızca",
    nativeName: "Français",
    flag: "🇫🇷",
    color: "#ff4b4b",
    speakers: "310 milyon konuşan",
    desc: "Diplomasinin ve sanatın dili. 5 kıtada konuşulur.",
  },
  it: {
    name: "İtalyanca",
    nativeName: "Italiano",
    flag: "🇮🇹",
    color: "#58cc02",
    speakers: "85 milyon konuşan",
    desc: "Müzik, sanat ve mutfağın dili. Melodik ve öğrenmesi keyifli.",
  },
  zh: {
    name: "Çince (Mandarin)",
    nativeName: "中文",
    flag: "🇨🇳",
    color: "#ff6f3c",
    speakers: "1.1 milyar konuşan",
    desc: "Dünyada ana dili en çok konuşulan dil. Pinyin ile başlangıç.",
  },
};

/* Dünya çapında en çok konuşulan diller (bilgi kartı için) */
const TOP_LANGUAGES_INFO = [
  { rank: 1, flag: "🇬🇧", name: "İngilizce", total: "1.5 milyar", native: "380 milyon", note: "Toplam konuşan sayısında 1. sırada." },
  { rank: 2, flag: "🇨🇳", name: "Mandarin Çincesi", total: "1.1 milyar", native: "940 milyon", note: "Ana dili en çok konuşulan dil." },
  { rank: 3, flag: "🇮🇳", name: "Hintçe", total: "610 milyon", native: "345 milyon", note: "Hindistan'ın en yaygın dili." },
  { rank: 4, flag: "🇪🇸", name: "İspanyolca", total: "560 milyon", native: "485 milyon", note: "20+ ülkede resmi dil." },
  { rank: 5, flag: "🇸🇦", name: "Arapça", total: "420 milyon", native: "315 milyon", note: "25+ ülkede konuşulur." },
  { rank: 6, flag: "🇫🇷", name: "Fransızca", total: "310 milyon", native: "80 milyon", note: "5 kıtada yaygın." },
  { rank: 7, flag: "🇧🇩", name: "Bengalce", total: "270 milyon", native: "230 milyon", note: "Bangladeş ve Hindistan." },
  { rank: 8, flag: "🇵🇹", name: "Portekizce", total: "260 milyon", native: "235 milyon", note: "Brezilya'nın dili." },
  { rank: 9, flag: "🇷🇺", name: "Rusça", total: "255 milyon", native: "150 milyon", note: "Avrasya'nın ortak dili." },
  { rank: 10, flag: "🇩🇪", name: "Almanca", total: "130 milyon", native: "75 milyon", note: "AB'nin en çok ana dili." },
];

/* ==========================================================================
   DERSLER (Üniteler) — Egzersiz tipleri:
   - choose: çoktan seçmeli (soru + seçenekler + doğru cevap)
   - translate: cümle çeviri (kelime bloklarından)
   - match: kelime eşleştirme (çiftler)
   - fill: boşluk doldurma
   - listen: dinleme (metin okunur, kullanıcı seçer)
   ========================================================================== */

const COURSES = {
  en: [
    {
      id: "en-u1",
      title: "Temel Tanışma",
      icon: "👋",
      desc: "Selamlaşma ve kendini tanıtma",
      lessons: [
        {
          id: "en-u1-l1",
          title: "Selamlaşma",
          exercises: [
            { type: "choose", q: "“Hello” ne demek?", a: "Merhaba", options: ["Merhaba", "Güle güle", "Teşekkürler", "Lütfen"] },
            { type: "choose", q: "“Good morning” ne demek?", a: "Günaydın", options: ["İyi geceler", "Günaydın", "İyi akşamlar", "Hoşça kal"] },
            { type: "match", pairs: [["Hello", "Merhaba"], ["Goodbye", "Hoşça kal"], ["Thanks", "Teşekkürler"], ["Please", "Lütfen"]] },
            { type: "translate", q: "Merhaba, nasılsın?", a: "Hello how are you", bank: ["Hello", "how", "are", "you", "name", "good"] },
            { type: "choose", q: "Birine “Nasılsın?” diye nasıl sorarsın?", a: "How are you?", options: ["What is your name?", "How are you?", "Where are you?", "Who are you?"] },
            { type: "fill", q: "Good ___ (Akşam selamı)", a: "evening", options: ["morning", "evening", "night", "day"] },
          ],
        },
        {
          id: "en-u1-l2",
          title: "Kendini Tanıtma",
          exercises: [
            { type: "choose", q: "“My name is John” ne demek?", a: "Benim adım John", options: ["Ben John'ı tanıyorum", "Benim adım John", "John nerede?", "John bir isim"] },
            { type: "translate", q: "Benim adım Ali.", a: "My name is Ali", bank: ["My", "name", "is", "Ali", "your", "the"] },
            { type: "choose", q: "“Nice to meet you” ne anlama gelir?", a: "Tanıştığımıza memnun oldum", options: ["Görüşürüz", "Tanıştığımıza memnun oldum", "Adın ne?", "Nasılsın?"] },
            { type: "match", pairs: [["I", "Ben"], ["You", "Sen"], ["He", "O (erkek)"], ["She", "O (kadın)"]] },
            { type: "fill", q: "___ name is Maria.", a: "My", options: ["My", "You", "He", "Is"] },
            { type: "translate", q: "Sen nerelisin?", a: "Where are you from", bank: ["Where", "are", "you", "from", "is", "name"] },
          ],
        },
      ],
    },
    {
      id: "en-u2",
      title: "Günlük Hayat",
      icon: "☕",
      desc: "Aile, yemek ve sayılar",
      lessons: [
        {
          id: "en-u2-l1",
          title: "Aile",
          exercises: [
            { type: "match", pairs: [["Mother", "Anne"], ["Father", "Baba"], ["Sister", "Kız kardeş"], ["Brother", "Erkek kardeş"]] },
            { type: "choose", q: "“This is my family” ne demek?", a: "Bu benim ailem", options: ["Bu benim evim", "Bu benim ailem", "Aileyi seviyorum", "Ailem büyük"] },
            { type: "translate", q: "O benim annem.", a: "She is my mother", bank: ["She", "is", "my", "mother", "father", "he"] },
            { type: "fill", q: "He is my ___ (baba).", a: "father", options: ["mother", "father", "sister", "brother"] },
            { type: "choose", q: "“Daughter” ne demek?", a: "Kız evlat", options: ["Oğul", "Kız evlat", "Teyze", "Amca"] },
          ],
        },
        {
          id: "en-u2-l2",
          title: "Yemek & İçecek",
          exercises: [
            { type: "match", pairs: [["Water", "Su"], ["Bread", "Ekmek"], ["Apple", "Elma"], ["Coffee", "Kahve"]] },
            { type: "choose", q: "“I am hungry” ne demek?", a: "Açım", options: ["Susadım", "Açım", "Yorgunum", "Mutluyum"] },
            { type: "translate", q: "Su istiyorum.", a: "I want water", bank: ["I", "want", "water", "bread", "the", "eat"] },
            { type: "fill", q: "I drink ___ in the morning. (kahve)", a: "coffee", options: ["coffee", "water", "bread", "apple"] },
            { type: "choose", q: "Lokantada hesabı nasıl istersin?", a: "The bill, please", options: ["The menu, please", "The bill, please", "A table, please", "The door, please"] },
          ],
        },
        {
          id: "en-u2-l3",
          title: "Sayılar",
          exercises: [
            { type: "match", pairs: [["One", "Bir"], ["Two", "İki"], ["Three", "Üç"], ["Four", "Dört"]] },
            { type: "choose", q: "“Ten” kaçtır?", a: "10", options: ["2", "7", "10", "12"] },
            { type: "fill", q: "Five plus three is ___.", a: "eight", options: ["six", "seven", "eight", "nine"] },
            { type: "choose", q: "“Twenty” kaçtır?", a: "20", options: ["12", "20", "200", "2"] },
            { type: "translate", q: "Üç elmam var.", a: "I have three apples", bank: ["I", "have", "three", "apples", "two", "want"] },
          ],
        },
      ],
    },
    {
      id: "en-u3",
      title: "Hareket Halinde",
      icon: "🧭",
      desc: "Yön sorma, zaman ve fiiller",
      lessons: [
        {
          id: "en-u3-l1",
          title: "Yön Sorma",
          exercises: [
            { type: "choose", q: "“Where is the station?” ne demek?", a: "İstasyon nerede?", options: ["İstasyon uzak mı?", "İstasyon nerede?", "İstasyona git", "Bu istasyon"] },
            { type: "match", pairs: [["Left", "Sol"], ["Right", "Sağ"], ["Straight", "Düz"], ["Near", "Yakın"]] },
            { type: "translate", q: "Tuvalet nerede?", a: "Where is the toilet", bank: ["Where", "is", "the", "toilet", "near", "go"] },
            { type: "fill", q: "Turn ___ at the corner. (sol)", a: "left", options: ["left", "right", "near", "stop"] },
          ],
        },
        {
          id: "en-u3-l2",
          title: "Zaman & Günler",
          exercises: [
            { type: "match", pairs: [["Monday", "Pazartesi"], ["Today", "Bugün"], ["Tomorrow", "Yarın"], ["Now", "Şimdi"]] },
            { type: "choose", q: "“What time is it?” ne demek?", a: "Saat kaç?", options: ["Bugün günlerden ne?", "Saat kaç?", "Ne zaman?", "Kaç gün?"] },
            { type: "translate", q: "Yarın görüşürüz.", a: "See you tomorrow", bank: ["See", "you", "tomorrow", "today", "now", "go"] },
            { type: "fill", q: "I work ___ Monday to Friday.", a: "from", options: ["from", "in", "at", "on"] },
          ],
        },
      ],
    },
  ],

  es: [
    {
      id: "es-u1",
      title: "Lo Básico",
      icon: "👋",
      desc: "Selamlaşma ve temel kelimeler",
      lessons: [
        {
          id: "es-u1-l1",
          title: "Selamlaşma",
          exercises: [
            { type: "choose", q: "“Hola” ne demek?", a: "Merhaba", options: ["Merhaba", "Güle güle", "Teşekkürler", "Evet"] },
            { type: "match", pairs: [["Hola", "Merhaba"], ["Adiós", "Hoşça kal"], ["Gracias", "Teşekkürler"], ["Por favor", "Lütfen"]] },
            { type: "choose", q: "“Buenos días” ne demek?", a: "Günaydın", options: ["İyi geceler", "Günaydın", "İyi akşamlar", "Hoşça kal"] },
            { type: "translate", q: "Adın ne?", a: "Cómo te llamas", bank: ["Cómo", "te", "llamas", "estás", "soy", "gracias"] },
            { type: "fill", q: "Me ___ Carlos. (adım)", a: "llamo", options: ["llamo", "gracias", "hola", "bien"] },
          ],
        },
        {
          id: "es-u1-l2",
          title: "Temel Kelimeler",
          exercises: [
            { type: "match", pairs: [["Sí", "Evet"], ["No", "Hayır"], ["Agua", "Su"], ["Pan", "Ekmek"]] },
            { type: "choose", q: "“¿Cómo estás?” ne demek?", a: "Nasılsın?", options: ["Adın ne?", "Nasılsın?", "Nerelisin?", "Kaç yaşındasın?"] },
            { type: "translate", q: "İyiyim, teşekkürler.", a: "Estoy bien gracias", bank: ["Estoy", "bien", "gracias", "mal", "soy", "hola"] },
            { type: "fill", q: "Quiero ___ , por favor. (su)", a: "agua", options: ["agua", "pan", "hola", "sí"] },
          ],
        },
      ],
    },
    {
      id: "es-u2",
      title: "Vida Diaria",
      icon: "☕",
      desc: "Aile ve sayılar",
      lessons: [
        {
          id: "es-u2-l1",
          title: "Aile & Sayılar",
          exercises: [
            { type: "match", pairs: [["Madre", "Anne"], ["Padre", "Baba"], ["Uno", "Bir"], ["Dos", "İki"]] },
            { type: "choose", q: "“Tres” kaçtır?", a: "3", options: ["1", "2", "3", "4"] },
            { type: "translate", q: "Bu benim ailem.", a: "Esta es mi familia", bank: ["Esta", "es", "mi", "familia", "padre", "casa"] },
            { type: "fill", q: "Tengo ___ hermanos. (iki)", a: "dos", options: ["uno", "dos", "tres", "agua"] },
          ],
        },
      ],
    },
  ],

  de: [
    {
      id: "de-u1",
      title: "Grundlagen",
      icon: "👋",
      desc: "Selamlaşma ve tanışma",
      lessons: [
        {
          id: "de-u1-l1",
          title: "Selamlaşma",
          exercises: [
            { type: "choose", q: "“Hallo” ne demek?", a: "Merhaba", options: ["Merhaba", "Güle güle", "Teşekkürler", "Evet"] },
            { type: "match", pairs: [["Hallo", "Merhaba"], ["Tschüss", "Hoşça kal"], ["Danke", "Teşekkürler"], ["Bitte", "Lütfen"]] },
            { type: "choose", q: "“Guten Morgen” ne demek?", a: "Günaydın", options: ["İyi geceler", "Günaydın", "İyi akşamlar", "Hoşça kal"] },
            { type: "translate", q: "Benim adım Anna.", a: "Ich heiße Anna", bank: ["Ich", "heiße", "Anna", "bin", "danke", "du"] },
            { type: "fill", q: "Wie ___ du? (-sın: nasıl)", a: "geht's", options: ["geht's", "heiße", "danke", "bitte"] },
          ],
        },
        {
          id: "de-u1-l2",
          title: "Temel Kelimeler",
          exercises: [
            { type: "match", pairs: [["Ja", "Evet"], ["Nein", "Hayır"], ["Wasser", "Su"], ["Brot", "Ekmek"]] },
            { type: "choose", q: "“Ich bin müde” ne demek?", a: "Yorgunum", options: ["Açım", "Yorgunum", "Mutluyum", "Susadım"] },
            { type: "translate", q: "Su istiyorum.", a: "Ich möchte Wasser", bank: ["Ich", "möchte", "Wasser", "Brot", "bin", "du"] },
            { type: "fill", q: "Das ist meine ___. (aile)", a: "Familie", options: ["Familie", "Wasser", "Brot", "Danke"] },
          ],
        },
      ],
    },
  ],

  fr: [
    {
      id: "fr-u1",
      title: "Les Bases",
      icon: "👋",
      desc: "Selamlaşma ve tanışma",
      lessons: [
        {
          id: "fr-u1-l1",
          title: "Selamlaşma",
          exercises: [
            { type: "choose", q: "“Bonjour” ne demek?", a: "Merhaba / İyi günler", options: ["Merhaba / İyi günler", "Güle güle", "Teşekkürler", "Evet"] },
            { type: "match", pairs: [["Bonjour", "Merhaba"], ["Au revoir", "Hoşça kal"], ["Merci", "Teşekkürler"], ["S'il vous plaît", "Lütfen"]] },
            { type: "choose", q: "“Comment ça va?” ne demek?", a: "Nasılsın?", options: ["Adın ne?", "Nasılsın?", "Nerelisin?", "Kaç yaşındasın?"] },
            { type: "translate", q: "Benim adım Marie.", a: "Je m'appelle Marie", bank: ["Je", "m'appelle", "Marie", "suis", "merci", "tu"] },
            { type: "fill", q: "Je vais ___. (iyi)", a: "bien", options: ["bien", "merci", "non", "eau"] },
          ],
        },
        {
          id: "fr-u1-l2",
          title: "Temel Kelimeler",
          exercises: [
            { type: "match", pairs: [["Oui", "Evet"], ["Non", "Hayır"], ["Eau", "Su"], ["Pain", "Ekmek"]] },
            { type: "choose", q: "“J'ai faim” ne demek?", a: "Açım", options: ["Susadım", "Açım", "Yorgunum", "Mutluyum"] },
            { type: "translate", q: "Su istiyorum lütfen.", a: "Je veux de l'eau", bank: ["Je", "veux", "de", "l'eau", "pain", "non"] },
            { type: "fill", q: "C'est ma ___. (aile)", a: "famille", options: ["famille", "eau", "pain", "merci"] },
          ],
        },
      ],
    },
  ],

  it: [
    {
      id: "it-u1",
      title: "Le Basi",
      icon: "👋",
      desc: "Selamlaşma ve tanışma",
      lessons: [
        {
          id: "it-u1-l1",
          title: "Selamlaşma",
          exercises: [
            { type: "choose", q: "“Ciao” ne demek?", a: "Merhaba / Hoşça kal", options: ["Merhaba / Hoşça kal", "Teşekkürler", "Lütfen", "Evet"] },
            { type: "match", pairs: [["Ciao", "Merhaba"], ["Arrivederci", "Hoşça kal"], ["Grazie", "Teşekkürler"], ["Per favore", "Lütfen"]] },
            { type: "choose", q: "“Buongiorno” ne demek?", a: "Günaydın / İyi günler", options: ["İyi geceler", "Günaydın / İyi günler", "Hoşça kal", "Teşekkürler"] },
            { type: "translate", q: "Benim adım Luca.", a: "Mi chiamo Luca", bank: ["Mi", "chiamo", "Luca", "sono", "grazie", "tu"] },
            { type: "fill", q: "Come ___? (nasılsın)", a: "stai", options: ["stai", "grazie", "ciao", "bene"] },
          ],
        },
      ],
    },
  ],

  zh: [
    {
      id: "zh-u1",
      title: "基础 (Temeller)",
      icon: "👋",
      desc: "Pinyin ile selamlaşma",
      lessons: [
        {
          id: "zh-u1-l1",
          title: "Selamlaşma",
          exercises: [
            { type: "choose", q: "“你好 (Nǐ hǎo)” ne demek?", a: "Merhaba", options: ["Merhaba", "Güle güle", "Teşekkürler", "Evet"] },
            { type: "match", pairs: [["你好 Nǐ hǎo", "Merhaba"], ["谢谢 Xièxie", "Teşekkürler"], ["再见 Zàijiàn", "Hoşça kal"], ["是 Shì", "Evet"]] },
            { type: "choose", q: "“谢谢 (Xièxie)” ne demek?", a: "Teşekkürler", options: ["Lütfen", "Teşekkürler", "Merhaba", "Hayır"] },
            { type: "fill", q: "Ben = 我 (___)", a: "Wǒ", options: ["Wǒ", "Nǐ", "Tā", "Shì"] },
          ],
        },
      ],
    },
  ],
};

/* ==========================================================================
   GRAMER KONULARI
   ========================================================================== */

const GRAMMAR = {
  en: [
    {
      id: "en-g1",
      level: "A1",
      title: "to be (am / is / are)",
      summary: "İngilizcenin en temel fiili. “olmak” anlamına gelir.",
      body: `
        <p><b>to be</b> fiili özneye göre değişir:</p>
        <table class="g-table">
          <tr><th>Özne</th><th>Fiil</th><th>Örnek</th></tr>
          <tr><td>I</td><td>am</td><td>I <b>am</b> a student. (Ben öğranciyim.)</td></tr>
          <tr><td>He / She / It</td><td>is</td><td>She <b>is</b> happy. (O mutlu.)</td></tr>
          <tr><td>You / We / They</td><td>are</td><td>They <b>are</b> here. (Onlar burada.)</td></tr>
        </table>
        <p><b>Olumsuz:</b> I am <u>not</u> tired. / He is <u>not</u> (isn't) ready.</p>
        <p><b>Soru:</b> <u>Are</u> you ok? / <u>Is</u> she a doctor?</p>
        <div class="g-tip">💡 Konuşmada kısaltılır: I'm, he's, she's, you're, they're.</div>
      `,
      examples: [
        ["I am from Turkey.", "Ben Türkiye'denim."],
        ["You are my friend.", "Sen benim arkadaşımsın."],
        ["It is cold today.", "Bugün hava soğuk."],
      ],
    },
    {
      id: "en-g2",
      level: "A1",
      title: "Geniş Zaman (Present Simple)",
      summary: "Alışkanlıklar, genel doğrular ve rutinler için kullanılır.",
      body: `
        <p>Tekrar eden eylemler için kullanılır: <i>her gün, genellikle, asla...</i></p>
        <p><b>Olumlu:</b> I/You/We/They <b>work</b>. — He/She/It <b>works</b> (<u>-s</u> takısı!)</p>
        <table class="g-table">
          <tr><th>Özne</th><th>Fiil</th></tr>
          <tr><td>I / You / We / They</td><td>play, go, eat</td></tr>
          <tr><td>He / She / It</td><td>play<b>s</b>, go<b>es</b>, eat<b>s</b></td></tr>
        </table>
        <p><b>Olumsuz:</b> I <u>don't</u> like coffee. / She <u>doesn't</u> like tea.</p>
        <p><b>Soru:</b> <u>Do</u> you speak English? / <u>Does</u> he live here?</p>
        <div class="g-tip">💡 3. tekil şahısta (he/she/it) fiile -s eklemeyi unutma!</div>
      `,
      examples: [
        ["I drink water every day.", "Her gün su içerim."],
        ["She works in a bank.", "O bir bankada çalışır."],
        ["Do you like music?", "Müziği sever misin?"],
      ],
    },
    {
      id: "en-g3",
      level: "A2",
      title: "Şimdiki Zaman (Present Continuous)",
      summary: "Tam şu anda olan eylemler için: am/is/are + fiil-ing.",
      body: `
        <p><b>Yapı:</b> özne + (am/is/are) + fiil<b>-ing</b></p>
        <p>I <b>am reading</b> a book. (Şu an kitap okuyorum.)</p>
        <p>They <b>are playing</b> football. (Onlar futbol oynuyor.)</p>
        <p><b>Olumsuz:</b> She <u>isn't</u> sleeping.</p>
        <p><b>Soru:</b> <u>Are</u> you listening?</p>
        <div class="g-tip">💡 “now, right now, at the moment” bu zamanın işaretleridir.</div>
      `,
      examples: [
        ["I am learning English.", "İngilizce öğreniyorum."],
        ["It is raining now.", "Şu an yağmur yağıyor."],
        ["What are you doing?", "Ne yapıyorsun?"],
      ],
    },
    {
      id: "en-g4",
      level: "A2",
      title: "Geçmiş Zaman (Past Simple)",
      summary: "Geçmişte bitmiş eylemler. Düzenli fiillere -ed eklenir.",
      body: `
        <p><b>Düzenli fiiller:</b> work → work<b>ed</b>, play → play<b>ed</b></p>
        <p><b>Düzensiz fiiller</b> ezberlenir: go → <b>went</b>, eat → <b>ate</b>, see → <b>saw</b></p>
        <p><b>Olumsuz:</b> I <u>didn't</u> go. (Tüm özneler için “didn't + yalın fiil”)</p>
        <p><b>Soru:</b> <u>Did</u> you see it?</p>
        <div class="g-tip">💡 yesterday, last week, in 2010, ago → geçmiş zaman işaretleri.</div>
      `,
      examples: [
        ["I watched a movie yesterday.", "Dün bir film izledim."],
        ["She went to school.", "O okula gitti."],
        ["Did you call me?", "Beni aradın mı?"],
      ],
    },
    {
      id: "en-g5",
      level: "B1",
      title: "Gelecek Zaman (will / going to)",
      summary: "Tahminler için 'will', planlar için 'going to'.",
      body: `
        <p><b>will:</b> anlık kararlar ve tahminler → I <b>will</b> help you.</p>
        <p><b>be going to:</b> önceden yapılmış planlar → I <b>am going to</b> travel.</p>
        <p><b>Olumsuz:</b> I <u>won't</u> (will not) come.</p>
        <div class="g-tip">💡 “I think, maybe, probably” genelde 'will' ile kullanılır.</div>
      `,
      examples: [
        ["I will call you tomorrow.", "Seni yarın arayacağım."],
        ["We are going to buy a car.", "Bir araba alacağız (planlı)."],
        ["It will rain tonight.", "Bu gece yağmur yağacak."],
      ],
    },
  ],
  es: [
    {
      id: "es-g1",
      level: "A1",
      title: "ser ve estar (olmak)",
      summary: "İspanyolcada 'olmak' için iki fiil vardır.",
      body: `
        <p><b>ser</b> → kalıcı özellikler (kimlik, meslek, milliyet): Soy estudiante. (Öğranciyim.)</p>
        <p><b>estar</b> → geçici durumlar ve yer: Estoy cansado. (Yorgunum.) / Estoy en casa. (Evdeyim.)</p>
        <table class="g-table">
          <tr><th>Özne</th><th>ser</th><th>estar</th></tr>
          <tr><td>yo (ben)</td><td>soy</td><td>estoy</td></tr>
          <tr><td>tú (sen)</td><td>eres</td><td>estás</td></tr>
          <tr><td>él/ella (o)</td><td>es</td><td>está</td></tr>
        </table>
        <div class="g-tip">💡 Duygu ve yer → estar, kimlik → ser.</div>
      `,
      examples: [
        ["Soy de Turquía.", "Türkiye'denim."],
        ["Estoy bien.", "İyiyim."],
        ["Ella es médica.", "O bir doktor."],
      ],
    },
    {
      id: "es-g2",
      level: "A1",
      title: "İsimlerde Cinsiyet (el / la)",
      summary: "İspanyolcada her isim eril veya dişildir.",
      body: `
        <p><b>el</b> → eril isimler (genelde -o): <b>el</b> libro (kitap)</p>
        <p><b>la</b> → dişil isimler (genelde -a): <b>la</b> casa (ev)</p>
        <p>Çoğul: <b>los</b> libros / <b>las</b> casas</p>
        <div class="g-tip">💡 İstisnalar vardır: el día (gün) erildir.</div>
      `,
      examples: [
        ["el coche", "araba"],
        ["la mesa", "masa"],
        ["los amigos", "arkadaşlar"],
      ],
    },
  ],
  de: [
    {
      id: "de-g1",
      level: "A1",
      title: "Artikeller (der / die / das)",
      summary: "Almancada her ismin bir cinsiyeti (artikeli) vardır.",
      body: `
        <p><b>der</b> → eril: der Mann (adam)</p>
        <p><b>die</b> → dişil: die Frau (kadın)</p>
        <p><b>das</b> → nötr: das Kind (çocuk)</p>
        <p>Çoğulda hepsi <b>die</b> olur: die Männer, die Frauen.</p>
        <div class="g-tip">💡 Artikeli kelimeyle birlikte ezberle — tahmin etmek zordur.</div>
      `,
      examples: [
        ["der Tisch", "masa"],
        ["die Lampe", "lamba"],
        ["das Buch", "kitap"],
      ],
    },
    {
      id: "de-g2",
      level: "A1",
      title: "sein (olmak)",
      summary: "Almancanın en temel fiili.",
      body: `
        <table class="g-table">
          <tr><th>Özne</th><th>sein</th></tr>
          <tr><td>ich (ben)</td><td>bin</td></tr>
          <tr><td>du (sen)</td><td>bist</td></tr>
          <tr><td>er/sie/es (o)</td><td>ist</td></tr>
          <tr><td>wir (biz)</td><td>sind</td></tr>
        </table>
        <div class="g-tip">💡 Ich bin müde = Yorgunum.</div>
      `,
      examples: [
        ["Ich bin Student.", "Öğranciyim."],
        ["Du bist nett.", "Sen naziksin."],
        ["Er ist hier.", "O burada."],
      ],
    },
  ],
  fr: [
    {
      id: "fr-g1",
      level: "A1",
      title: "être (olmak)",
      summary: "Fransızcanın temel fiili.",
      body: `
        <table class="g-table">
          <tr><th>Özne</th><th>être</th></tr>
          <tr><td>je (ben)</td><td>suis</td></tr>
          <tr><td>tu (sen)</td><td>es</td></tr>
          <tr><td>il/elle (o)</td><td>est</td></tr>
          <tr><td>nous (biz)</td><td>sommes</td></tr>
        </table>
        <div class="g-tip">💡 Je suis fatigué = Yorgunum.</div>
      `,
      examples: [
        ["Je suis étudiant.", "Öğranciyim."],
        ["Tu es gentil.", "Sen naziksin."],
        ["Elle est ici.", "O burada."],
      ],
    },
    {
      id: "fr-g2",
      level: "A1",
      title: "Tanımlıklar (le / la / les)",
      summary: "Fransızcada isimlerin cinsiyeti vardır.",
      body: `
        <p><b>le</b> → eril: le livre (kitap)</p>
        <p><b>la</b> → dişil: la maison (ev)</p>
        <p><b>les</b> → çoğul: les livres</p>
        <p>Ünlüden önce → <b>l'</b>: l'ami (arkadaş)</p>
        <div class="g-tip">💡 Cinsiyeti kelimeyle birlikte öğren.</div>
      `,
      examples: [
        ["le chat", "kedi"],
        ["la table", "masa"],
        ["les enfants", "çocuklar"],
      ],
    },
  ],
  it: [
    {
      id: "it-g1",
      level: "A1",
      title: "essere (olmak)",
      summary: "İtalyancanın temel fiili.",
      body: `
        <table class="g-table">
          <tr><th>Özne</th><th>essere</th></tr>
          <tr><td>io (ben)</td><td>sono</td></tr>
          <tr><td>tu (sen)</td><td>sei</td></tr>
          <tr><td>lui/lei (o)</td><td>è</td></tr>
          <tr><td>noi (biz)</td><td>siamo</td></tr>
        </table>
        <div class="g-tip">💡 Sono stanco = Yorgunum.</div>
      `,
      examples: [
        ["Sono italiano.", "İtalyanım."],
        ["Tu sei simpatico.", "Sen sevimlisin."],
        ["Lei è qui.", "O burada."],
      ],
    },
  ],
  zh: [
    {
      id: "zh-g1",
      level: "A1",
      title: "Tonlar (4 Ton)",
      summary: "Mandarin'de aynı hece farklı tonlarda farklı anlamlar taşır.",
      body: `
        <p>Mandarin'de <b>4 ton</b> + nötr ton vardır. Örnek hece: <b>ma</b></p>
        <table class="g-table">
          <tr><th>Ton</th><th>İşaret</th><th>Anlam</th></tr>
          <tr><td>1. (düz)</td><td>mā 妈</td><td>anne</td></tr>
          <tr><td>2. (yükselen)</td><td>má 麻</td><td>kenevir</td></tr>
          <tr><td>3. (inip çıkan)</td><td>mǎ 马</td><td>at</td></tr>
          <tr><td>4. (düşen)</td><td>mà 骂</td><td>azarlamak</td></tr>
        </table>
        <div class="g-tip">💡 Ton yanlışsa kelime tamamen değişir — bu yüzden çok önemli.</div>
      `,
      examples: [
        ["你好 Nǐ hǎo", "Merhaba"],
        ["我 Wǒ", "Ben"],
        ["谢谢 Xièxie", "Teşekkürler"],
      ],
    },
  ],
};

/* ==========================================================================
   OKUMA METİNLERİ (kitap / hikaye) — seviyeli, çeviri ve kelime listesiyle
   ========================================================================== */

const READINGS = {
  en: [
    {
      id: "en-r1",
      level: "A1",
      title: "A New Day",
      cover: "🌅",
      minutes: 2,
      desc: "Basit bir sabah rutini hikayesi.",
      paragraphs: [
        ["Tom wakes up early.", "Tom erken uyanır."],
        ["He opens the window and looks outside.", "Pencereyi açar ve dışarı bakar."],
        ["The sun is bright and the birds are singing.", "Güneş parlak ve kuşlar ötüyor."],
        ["He drinks a cup of coffee and eats some bread.", "Bir fincan kahve içer ve biraz ekmek yer."],
        ["“Today is a good day,” he says with a smile.", "“Bugün güzel bir gün,” der gülümseyerek."],
      ],
      vocab: [["wake up", "uyanmak"], ["window", "pencere"], ["bright", "parlak"], ["smile", "gülümseme"]],
    },
    {
      id: "en-r2",
      level: "A2",
      title: "The Lost Key",
      cover: "🔑",
      minutes: 3,
      desc: "Anahtarını kaybeden bir kadının kısa hikayesi.",
      paragraphs: [
        ["Sarah cannot find her key.", "Sarah anahtarını bulamıyor."],
        ["She looks in her bag, but it is not there.", "Çantasına bakar ama orada değil."],
        ["She checks her pockets and the table.", "Ceplerini ve masayı kontrol eder."],
        ["Suddenly, she remembers something.", "Birden bir şey hatırlar."],
        ["The key was in the door the whole time!", "Anahtar bütün zaman kapıdaymış!"],
        ["She laughs and finally goes inside.", "Güler ve sonunda içeri girer."],
      ],
      vocab: [["lost", "kayıp"], ["pocket", "cep"], ["suddenly", "birden"], ["remember", "hatırlamak"]],
    },
    {
      id: "en-r3",
      level: "B1",
      title: "The Old Bookstore",
      cover: "📚",
      minutes: 4,
      desc: "Şehirdeki gizemli bir kitapçı hakkında.",
      paragraphs: [
        ["At the end of a narrow street, there was an old bookstore.", "Dar bir sokağın sonunda eski bir kitapçı vardı."],
        ["Few people knew about it, but those who did never forgot it.", "Çok az kişi onu bilirdi ama bilenler asla unutmazdı."],
        ["The owner, an elderly man, seemed to know exactly what each visitor needed.", "Yaşlı bir adam olan sahibi, her ziyaretçinin tam olarak neye ihtiyacı olduğunu bilir gibiydi."],
        ["“Books find their readers,” he often said.", "“Kitaplar okurlarını bulur,” derdi sık sık."],
        ["One rainy afternoon, a young woman walked in, looking for nothing in particular.", "Yağmurlu bir öğleden sonra, özel bir şey aramayan genç bir kadın içeri girdi."],
        ["She left with a book that would change her life.", "Hayatını değiştirecek bir kitapla ayrıldı."],
      ],
      vocab: [["narrow", "dar"], ["owner", "sahip"], ["elderly", "yaşlı"], ["in particular", "özellikle"]],
    },
  ],
  es: [
    {
      id: "es-r1",
      level: "A1",
      title: "Un Día en el Parque",
      cover: "🌳",
      minutes: 2,
      desc: "Parkta geçen basit bir gün.",
      paragraphs: [
        ["María va al parque.", "María parka gider."],
        ["Hace sol y hace calor.", "Güneşli ve sıcak."],
        ["Ella come una manzana.", "O bir elma yer."],
        ["Los niños juegan con un perro.", "Çocuklar bir köpekle oynar."],
        ["Es un día feliz.", "Mutlu bir gün."],
      ],
      vocab: [["parque", "park"], ["sol", "güneş"], ["manzana", "elma"], ["feliz", "mutlu"]],
    },
    {
      id: "es-r2",
      level: "A2",
      title: "El Café de la Esquina",
      cover: "☕",
      minutes: 3,
      desc: "Köşedeki kafe hakkında bir hikaye.",
      paragraphs: [
        ["Todas las mañanas, Pablo va al café de la esquina.", "Her sabah Pablo köşedeki kafeye gider."],
        ["Pide un café con leche y un pan dulce.", "Sütlü kahve ve tatlı bir ekmek ister."],
        ["La camarera ya conoce su nombre.", "Garson kız artık onun adını biliyor."],
        ["“Lo de siempre, Pablo?”, pregunta ella.", "“Her zamanki gibi mi, Pablo?” diye sorar."],
        ["Él sonríe y dice que sí.", "O gülümser ve evet der."],
      ],
      vocab: [["esquina", "köşe"], ["pedir", "istemek"], ["camarera", "garson (kadın)"], ["siempre", "her zaman"]],
    },
  ],
  de: [
    {
      id: "de-r1",
      level: "A1",
      title: "Im Supermarkt",
      cover: "🛒",
      minutes: 2,
      desc: "Markette geçen basit bir sahne.",
      paragraphs: [
        ["Anna geht in den Supermarkt.", "Anna markete gider."],
        ["Sie kauft Brot, Milch und Äpfel.", "Ekmek, süt ve elma alır."],
        ["Das Brot ist frisch.", "Ekmek taze."],
        ["Sie bezahlt an der Kasse.", "Kasada öder."],
        ["Dann geht sie nach Hause.", "Sonra eve gider."],
      ],
      vocab: [["kaufen", "satın almak"], ["Brot", "ekmek"], ["frisch", "taze"], ["bezahlen", "ödemek"]],
    },
  ],
  fr: [
    {
      id: "fr-r1",
      level: "A1",
      title: "Le Petit Déjeuner",
      cover: "🥐",
      minutes: 2,
      desc: "Bir Fransız kahvaltısı.",
      paragraphs: [
        ["Le matin, Claire prend son petit déjeuner.", "Sabahları Claire kahvaltısını yapar."],
        ["Elle mange un croissant.", "Bir kruvasan yer."],
        ["Elle boit un café au lait.", "Sütlü kahve içer."],
        ["Le croissant est délicieux.", "Kruvasan çok lezzetli."],
        ["Elle est prête pour la journée.", "Güne hazır."],
      ],
      vocab: [["matin", "sabah"], ["manger", "yemek"], ["boire", "içmek"], ["délicieux", "lezzetli"]],
    },
  ],
  it: [
    {
      id: "it-r1",
      level: "A1",
      title: "La Pizza",
      cover: "🍕",
      minutes: 2,
      desc: "Basit bir akşam yemeği hikayesi.",
      paragraphs: [
        ["Marco fa una pizza a casa.", "Marco evde pizza yapar."],
        ["Mette pomodoro e formaggio.", "Domates ve peynir koyar."],
        ["La pizza è molto buona.", "Pizza çok güzel."],
        ["La famiglia mangia insieme.", "Aile birlikte yer."],
        ["Tutti sono contenti.", "Herkes memnun."],
      ],
      vocab: [["fare", "yapmak"], ["formaggio", "peynir"], ["insieme", "birlikte"], ["contento", "memnun"]],
    },
  ],
  zh: [
    {
      id: "zh-r1",
      level: "A1",
      title: "我的家 (Benim Ailem)",
      cover: "🏠",
      minutes: 2,
      desc: "Pinyin ile basit aile tanıtımı.",
      paragraphs: [
        ["我有一个家。 Wǒ yǒu yí ge jiā.", "Bir ailem var."],
        ["我爱我的家人。 Wǒ ài wǒ de jiārén.", "Aileme sevgiliyim (aramı seviyorum)."],
        ["我们很开心。 Wǒmen hěn kāixīn.", "Biz çok mutluyuz."],
      ],
      vocab: [["家 jiā", "ev / aile"], ["爱 ài", "sevmek"], ["开心 kāixīn", "mutlu"], ["我们 wǒmen", "biz"]],
    },
  ],
};

/* ==========================================================================
   KONUŞMA PRATİĞİ (senaryolar) — sırayla diyalog, kullanıcı cevap seçer
   ========================================================================== */

const CONVERSATIONS = {
  en: [
    {
      id: "en-c1",
      title: "Kafede Sipariş",
      icon: "☕",
      level: "A1",
      desc: "Bir kafede kahve sipariş et.",
      steps: [
        { speaker: "Barista", text: "Hi! What can I get for you?", tr: "Merhaba! Size ne getirebilirim?",
          options: [
            { text: "I'd like a coffee, please.", correct: true, tr: "Bir kahve istiyorum lütfen." },
            { text: "Where is the bank?", correct: false, tr: "Banka nerede?" },
            { text: "I am fine, thanks.", correct: false, tr: "İyiyim, teşekkürler." },
          ] },
        { speaker: "Barista", text: "Sure! Small or large?", tr: "Tabii! Küçük mü büyük mü?",
          options: [
            { text: "Large, please.", correct: true, tr: "Büyük, lütfen." },
            { text: "Yes, I am.", correct: false, tr: "Evet, öyleyim." },
            { text: "Good morning.", correct: false, tr: "Günaydın." },
          ] },
        { speaker: "Barista", text: "That's three dollars. Anything else?", tr: "Üç dolar. Başka bir şey?",
          options: [
            { text: "No, thank you. Here you are.", correct: true, tr: "Hayır, teşekkürler. Buyurun." },
            { text: "I don't know him.", correct: false, tr: "Onu tanımıyorum." },
            { text: "It is raining.", correct: false, tr: "Yağmur yağıyor." },
          ] },
      ],
    },
    {
      id: "en-c2",
      title: "Yol Sorma",
      icon: "🗺️",
      level: "A2",
      desc: "Bir yabancıya yol sor.",
      steps: [
        { speaker: "You", text: "Excuse me, how do I get to the station?", tr: "Affedersiniz, istasyona nasıl giderim?",
          options: [
            { text: "(Devam et)", correct: true, tr: "" },
          ] },
        { speaker: "Stranger", text: "Go straight and turn left at the lights.", tr: "Düz git ve ışıklarda sola dön.",
          options: [
            { text: "Is it far from here?", correct: true, tr: "Buraya uzak mı?" },
            { text: "I am hungry.", correct: false, tr: "Açım." },
            { text: "Goodbye!", correct: false, tr: "Hoşça kal!" },
          ] },
        { speaker: "Stranger", text: "No, just a five-minute walk.", tr: "Hayır, sadece beş dakikalık yürüyüş.",
          options: [
            { text: "Thank you so much!", correct: true, tr: "Çok teşekkür ederim!" },
            { text: "What is your name?", correct: false, tr: "Adın ne?" },
            { text: "I like tea.", correct: false, tr: "Çayı severim." },
          ] },
      ],
    },
  ],
  es: [
    {
      id: "es-c1",
      title: "En el Restaurante",
      icon: "🍽️",
      level: "A1",
      desc: "Restoranda sipariş ver.",
      steps: [
        { speaker: "Camarero", text: "Buenas tardes, ¿qué desea?", tr: "İyi günler, ne arzu edersiniz?",
          options: [
            { text: "Quiero una pizza, por favor.", correct: true, tr: "Bir pizza istiyorum lütfen." },
            { text: "¿Dónde está el baño?", correct: false, tr: "Tuvalet nerede?" },
            { text: "Me llamo Ana.", correct: false, tr: "Benim adım Ana." },
          ] },
        { speaker: "Camarero", text: "¿Y para beber?", tr: "İçecek olarak?",
          options: [
            { text: "Agua, por favor.", correct: true, tr: "Su, lütfen." },
            { text: "Tengo sueño.", correct: false, tr: "Uykum var." },
            { text: "Hasta luego.", correct: false, tr: "Görüşürüz." },
          ] },
      ],
    },
  ],
  de: [
    {
      id: "de-c1",
      title: "Im Hotel",
      icon: "🏨",
      level: "A1",
      desc: "Otelde check-in yap.",
      steps: [
        { speaker: "Rezeption", text: "Guten Tag! Haben Sie eine Reservierung?", tr: "İyi günler! Rezervasyonunuz var mı?",
          options: [
            { text: "Ja, auf den Namen Schmidt.", correct: true, tr: "Evet, Schmidt adına." },
            { text: "Ich bin müde.", correct: false, tr: "Yorgunum." },
            { text: "Wo ist das Brot?", correct: false, tr: "Ekmek nerede?" },
          ] },
        { speaker: "Rezeption", text: "Hier ist Ihr Schlüssel. Zimmer 12.", tr: "İşte anahtarınız. Oda 12.",
          options: [
            { text: "Vielen Dank!", correct: true, tr: "Çok teşekkürler!" },
            { text: "Ich heiße Anna.", correct: false, tr: "Benim adım Anna." },
            { text: "Es regnet.", correct: false, tr: "Yağmur yağıyor." },
          ] },
      ],
    },
  ],
  fr: [
    {
      id: "fr-c1",
      title: "À la Boulangerie",
      icon: "🥖",
      level: "A1",
      desc: "Fırından ekmek al.",
      steps: [
        { speaker: "Boulanger", text: "Bonjour ! Vous désirez ?", tr: "Merhaba! Ne arzu edersiniz?",
          options: [
            { text: "Une baguette, s'il vous plaît.", correct: true, tr: "Bir baget, lütfen." },
            { text: "Je suis fatigué.", correct: false, tr: "Yorgunum." },
            { text: "Où est la gare ?", correct: false, tr: "İstasyon nerede?" },
          ] },
        { speaker: "Boulanger", text: "Voilà. Un euro vingt.", tr: "Buyurun. Bir euro yirmi.",
          options: [
            { text: "Merci, au revoir !", correct: true, tr: "Teşekkürler, hoşça kalın!" },
            { text: "Comment ça va ?", correct: false, tr: "Nasılsın?" },
            { text: "J'ai faim.", correct: false, tr: "Açım." },
          ] },
      ],
    },
  ],
  it: [
    {
      id: "it-c1",
      title: "Al Bar",
      icon: "☕",
      level: "A1",
      desc: "İtalyan barında kahve iste.",
      steps: [
        { speaker: "Barista", text: "Buongiorno! Cosa prende?", tr: "Günaydın! Ne alırsınız?",
          options: [
            { text: "Un caffè, per favore.", correct: true, tr: "Bir kahve, lütfen." },
            { text: "Dov'è il bagno?", correct: false, tr: "Tuvalet nerede?" },
            { text: "Sono stanco.", correct: false, tr: "Yorgunum." },
          ] },
        { speaker: "Barista", text: "Ecco a lei. Un euro.", tr: "Buyurun. Bir euro.",
          options: [
            { text: "Grazie mille!", correct: true, tr: "Çok teşekkürler!" },
            { text: "Mi chiamo Luca.", correct: false, tr: "Benim adım Luca." },
            { text: "Piove.", correct: false, tr: "Yağmur yağıyor." },
          ] },
      ],
    },
  ],
  zh: [
    {
      id: "zh-c1",
      title: "买东西 (Alışveriş)",
      icon: "🛍️",
      level: "A1",
      desc: "Bir şeyin fiyatını sor.",
      steps: [
        { speaker: "店员", text: "你好！你要什么？ Nǐ hǎo! Nǐ yào shénme?", tr: "Merhaba! Ne istiyorsunuz?",
          options: [
            { text: "我要这个。 Wǒ yào zhège.", correct: true, tr: "Bunu istiyorum." },
            { text: "再见。 Zàijiàn.", correct: false, tr: "Hoşça kal." },
            { text: "谢谢。 Xièxie.", correct: false, tr: "Teşekkürler." },
          ] },
        { speaker: "店员", text: "十块钱。 Shí kuài qián.", tr: "On yuan.",
          options: [
            { text: "好的，谢谢。 Hǎo de, xièxie.", correct: true, tr: "Tamam, teşekkürler." },
            { text: "我叫李。 Wǒ jiào Lǐ.", correct: false, tr: "Benim adım Li." },
            { text: "下雨了。 Xià yǔ le.", correct: false, tr: "Yağmur yağıyor." },
          ] },
      ],
    },
  ],
};

window.DATA = { LANGUAGES, TOP_LANGUAGES_INFO, COURSES, GRAMMAR, READINGS, CONVERSATIONS };

/* ==========================================================================
   LinguaWorld — İçerik Verisi
   Diller, CEFR seviyeleri (A1-C1), seviye tespit sınavı, dersler (Duolingo
   tarzı), gramer, okuma ve konuşma içerikleri.
   ========================================================================== */

const LANGUAGES = {
  en: { name: "İngilizce", nativeName: "English", flag: "🇬🇧", color: "#1cb0f6", speakers: "1.5 milyar konuşan", desc: "Dünyanın ortak dili. İş, bilim, internet ve seyahatte birinci sıra." },
  es: { name: "İspanyolca", nativeName: "Español", flag: "🇪🇸", color: "#ff9600", speakers: "560 milyon konuşan", desc: "20+ ülkenin resmi dili. Latin Amerika ve İspanya'nın dili." },
  de: { name: "Almanca", nativeName: "Deutsch", flag: "🇩🇪", color: "#ce82ff", speakers: "130 milyon konuşan", desc: "Avrupa'nın en güçlü ekonomisinin dili. Mühendislik ve felsefe." },
  fr: { name: "Fransızca", nativeName: "Français", flag: "🇫🇷", color: "#ff4b4b", speakers: "310 milyon konuşan", desc: "Diplomasinin ve sanatın dili. 5 kıtada konuşulur." },
  it: { name: "İtalyanca", nativeName: "Italiano", flag: "🇮🇹", color: "#58cc02", speakers: "85 milyon konuşan", desc: "Müzik, sanat ve mutfağın dili. Melodik ve öğrenmesi keyifli." },
  zh: { name: "Çince (Mandarin)", nativeName: "中文", flag: "🇨🇳", color: "#ff6f3c", speakers: "1.1 milyar konuşan", desc: "Dünyada ana dili en çok konuşulan dil. Pinyin ile başlangıç." },
};

/* CEFR seviyeleri */
const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const LEVEL_INFO = {
  A1: { name: "Başlangıç", desc: "Temel kelimeler, basit cümleler, günlük selamlaşma.", color: "#58cc02", icon: "🌱" },
  A2: { name: "Temel", desc: "Geçmiş/gelecek zaman, alışveriş, basit sohbet.", color: "#1cb0f6", icon: "🌿" },
  B1: { name: "Orta", desc: "Fikir belirtme, deneyim anlatma, iş & eğitim.", color: "#ce82ff", icon: "🌳" },
  B2: { name: "Orta-Üstü", desc: "Tartışma, ikna, soyut konular, akıcı ifade.", color: "#ff9600", icon: "🔥" },
  C1: { name: "İleri", desc: "Deyimler, nüanslar, akademik ve karmaşık dil.", color: "#ff4b4b", icon: "🏆" },
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
   SEVİYE TESPİT SINAVI — her seviyeden sorular (kolaydan zora).
   Bir seviyeyi "geçmek" için o seviyedeki soruların çoğunu doğru yapmalı.
   ========================================================================== */
const PLACEMENT = {
  en: [
    // A1
    { id: "p1", level: "A1", q: "I ___ a student.", a: "am", options: ["am", "is", "are", "be"] },
    { id: "p2", level: "A1", q: "“Apple” ne demek?", a: "Elma", options: ["Elma", "Armut", "Portakal", "Üzüm"] },
    { id: "p3", level: "A1", q: "She ___ to school every day.", a: "goes", options: ["go", "goes", "going", "went"] },
    // A2
    { id: "p4", level: "A2", q: "Yesterday I ___ a film.", a: "watched", options: ["watch", "watched", "watching", "watches"] },
    { id: "p5", level: "A2", q: "There ___ some milk in the fridge.", a: "is", options: ["is", "are", "am", "be"] },
    { id: "p6", level: "A2", q: "I'm going ___ visit my aunt tomorrow.", a: "to", options: ["to", "for", "at", "in"] },
    // B1
    { id: "p7", level: "B1", q: "If it rains, we ___ at home.", a: "will stay", options: ["will stay", "stay", "stayed", "would stayed"] },
    { id: "p8", level: "B1", q: "I have lived here ___ 2015.", a: "since", options: ["since", "for", "from", "during"] },
    { id: "p9", level: "B1", q: "This is the ___ film I've ever seen.", a: "best", options: ["best", "better", "good", "more good"] },
    // B2
    { id: "p10", level: "B2", q: "By next year, she ___ her degree.", a: "will have finished", options: ["will have finished", "will finish", "finishes", "has finished"] },
    { id: "p11", level: "B2", q: "He suggested ___ a break.", a: "taking", options: ["taking", "to take", "take", "took"] },
    { id: "p12", level: "B2", q: "I'd rather you ___ smoke here.", a: "didn't", options: ["didn't", "don't", "won't", "aren't"] },
    // C1
    { id: "p13", level: "C1", q: "Not only ___ late, but he also forgot the documents.", a: "was he", options: ["was he", "he was", "did he", "he is"] },
    { id: "p14", level: "C1", q: "“To bite the bullet” deyiminin anlamı:", a: "Zor bir durumla cesurca yüzleşmek", options: ["Zor bir durumla cesurca yüzleşmek", "Çok acıkmak", "Birine kızmak", "Çabuk yemek yemek"] },
    { id: "p15", level: "C1", q: "Had I known, I ___ differently.", a: "would have acted", options: ["would have acted", "would act", "will act", "had acted"] },
  ],
};

/* ==========================================================================
   DERSLER — Üniteler seviyelere (level) göre etiketli.
   Egzersiz tipleri: choose | translate | match | fill
   ========================================================================== */

const COURSES = {
  en: [
    /* ===================== A1 ===================== */
    {
      id: "en-u1", level: "A1", title: "Temel Tanışma", icon: "👋", desc: "Selamlaşma ve kendini tanıtma",
      lessons: [
        { id: "en-u1-l1", title: "Selamlaşma", exercises: [
          { type: "choose", q: "“Hello” ne demek?", a: "Merhaba", options: ["Merhaba", "Güle güle", "Teşekkürler", "Lütfen"] },
          { type: "choose", q: "“Good morning” ne demek?", a: "Günaydın", options: ["İyi geceler", "Günaydın", "İyi akşamlar", "Hoşça kal"] },
          { type: "match", pairs: [["Hello", "Merhaba"], ["Goodbye", "Hoşça kal"], ["Thanks", "Teşekkürler"], ["Please", "Lütfen"]] },
          { type: "translate", q: "Merhaba, nasılsın?", a: "Hello how are you", bank: ["Hello", "how", "are", "you", "name", "good"] },
          { type: "choose", q: "Birine “Nasılsın?” diye nasıl sorarsın?", a: "How are you?", options: ["What is your name?", "How are you?", "Where are you?", "Who are you?"] },
          { type: "fill", q: "Good ___ (Akşam selamı)", a: "evening", options: ["morning", "evening", "night", "day"] },
        ]},
        { id: "en-u1-l2", title: "Kendini Tanıtma", exercises: [
          { type: "choose", q: "“My name is John” ne demek?", a: "Benim adım John", options: ["Ben John'ı tanıyorum", "Benim adım John", "John nerede?", "John bir isim"] },
          { type: "translate", q: "Benim adım Ali.", a: "My name is Ali", bank: ["My", "name", "is", "Ali", "your", "the"] },
          { type: "choose", q: "“Nice to meet you” ne anlama gelir?", a: "Tanıştığımıza memnun oldum", options: ["Görüşürüz", "Tanıştığımıza memnun oldum", "Adın ne?", "Nasılsın?"] },
          { type: "match", pairs: [["I", "Ben"], ["You", "Sen"], ["He", "O (erkek)"], ["She", "O (kadın)"]] },
          { type: "fill", q: "___ name is Maria.", a: "My", options: ["My", "You", "He", "Is"] },
          { type: "translate", q: "Sen nerelisin?", a: "Where are you from", bank: ["Where", "are", "you", "from", "is", "name"] },
        ]},
      ],
    },
    {
      id: "en-u2", level: "A1", title: "Günlük Hayat", icon: "☕", desc: "Aile, yemek ve sayılar",
      lessons: [
        { id: "en-u2-l1", title: "Aile", exercises: [
          { type: "match", pairs: [["Mother", "Anne"], ["Father", "Baba"], ["Sister", "Kız kardeş"], ["Brother", "Erkek kardeş"]] },
          { type: "choose", q: "“This is my family” ne demek?", a: "Bu benim ailem", options: ["Bu benim evim", "Bu benim ailem", "Aileyi seviyorum", "Ailem büyük"] },
          { type: "translate", q: "O benim annem.", a: "She is my mother", bank: ["She", "is", "my", "mother", "father", "he"] },
          { type: "fill", q: "He is my ___ (baba).", a: "father", options: ["mother", "father", "sister", "brother"] },
          { type: "choose", q: "“Daughter” ne demek?", a: "Kız evlat", options: ["Oğul", "Kız evlat", "Teyze", "Amca"] },
        ]},
        { id: "en-u2-l2", title: "Yemek & İçecek", exercises: [
          { type: "match", pairs: [["Water", "Su"], ["Bread", "Ekmek"], ["Apple", "Elma"], ["Coffee", "Kahve"]] },
          { type: "choose", q: "“I am hungry” ne demek?", a: "Açım", options: ["Susadım", "Açım", "Yorgunum", "Mutluyum"] },
          { type: "translate", q: "Su istiyorum.", a: "I want water", bank: ["I", "want", "water", "bread", "the", "eat"] },
          { type: "fill", q: "I drink ___ in the morning. (kahve)", a: "coffee", options: ["coffee", "water", "bread", "apple"] },
          { type: "choose", q: "Lokantada hesabı nasıl istersin?", a: "The bill, please", options: ["The menu, please", "The bill, please", "A table, please", "The door, please"] },
        ]},
        { id: "en-u2-l3", title: "Sayılar", exercises: [
          { type: "match", pairs: [["One", "Bir"], ["Two", "İki"], ["Three", "Üç"], ["Four", "Dört"]] },
          { type: "choose", q: "“Ten” kaçtır?", a: "10", options: ["2", "7", "10", "12"] },
          { type: "fill", q: "Five plus three is ___.", a: "eight", options: ["six", "seven", "eight", "nine"] },
          { type: "choose", q: "“Twenty” kaçtır?", a: "20", options: ["12", "20", "200", "2"] },
          { type: "translate", q: "Üç elmam var.", a: "I have three apples", bank: ["I", "have", "three", "apples", "two", "want"] },
        ]},
      ],
    },
    {
      id: "en-u3", level: "A1", title: "Hareket Halinde", icon: "🧭", desc: "Yön sorma, zaman ve günler",
      lessons: [
        { id: "en-u3-l1", title: "Yön Sorma", exercises: [
          { type: "choose", q: "“Where is the station?” ne demek?", a: "İstasyon nerede?", options: ["İstasyon uzak mı?", "İstasyon nerede?", "İstasyona git", "Bu istasyon"] },
          { type: "match", pairs: [["Left", "Sol"], ["Right", "Sağ"], ["Straight", "Düz"], ["Near", "Yakın"]] },
          { type: "translate", q: "Tuvalet nerede?", a: "Where is the toilet", bank: ["Where", "is", "the", "toilet", "near", "go"] },
          { type: "fill", q: "Turn ___ at the corner. (sol)", a: "left", options: ["left", "right", "near", "stop"] },
        ]},
        { id: "en-u3-l2", title: "Zaman & Günler", exercises: [
          { type: "match", pairs: [["Monday", "Pazartesi"], ["Today", "Bugün"], ["Tomorrow", "Yarın"], ["Now", "Şimdi"]] },
          { type: "choose", q: "“What time is it?” ne demek?", a: "Saat kaç?", options: ["Bugün günlerden ne?", "Saat kaç?", "Ne zaman?", "Kaç gün?"] },
          { type: "translate", q: "Yarın görüşürüz.", a: "See you tomorrow", bank: ["See", "you", "tomorrow", "today", "now", "go"] },
          { type: "fill", q: "I work ___ Monday to Friday.", a: "from", options: ["from", "in", "at", "on"] },
        ]},
      ],
    },

    /* ===================== A2 ===================== */
    {
      id: "en-u4", level: "A2", title: "Geçmişi Anlatma", icon: "🕰️", desc: "Geçmiş zaman ve geçen olaylar",
      lessons: [
        { id: "en-u4-l1", title: "Geçen Hafta", exercises: [
          { type: "fill", q: "Yesterday I ___ (watch) a film.", a: "watched", options: ["watch", "watched", "watches", "watching"] },
          { type: "choose", q: "“go” fiilinin geçmiş hali nedir?", a: "went", options: ["goed", "went", "gone", "going"] },
          { type: "translate", q: "Dün okula gittim.", a: "I went to school yesterday", bank: ["I", "went", "to", "school", "yesterday", "go", "tomorrow"] },
          { type: "fill", q: "She ___ (not / like) the food.", a: "didn't like", options: ["didn't like", "doesn't like", "not liked", "don't like"] },
          { type: "choose", q: "“Did you see it?” ne demek?", a: "Onu gördün mü?", options: ["Onu görüyor musun?", "Onu gördün mü?", "Onu görecek misin?", "Onu görmedin"] },
          { type: "match", pairs: [["bought", "satın aldı"], ["saw", "gördü"], ["ate", "yedi"], ["made", "yaptı"]] },
        ]},
        { id: "en-u4-l2", title: "Tatil", exercises: [
          { type: "translate", q: "Geçen yıl İtalya'ya gittik.", a: "We went to Italy last year", bank: ["We", "went", "to", "Italy", "last", "year", "go", "next"] },
          { type: "choose", q: "“It was amazing!” ne demek?", a: "Harikaydı!", options: ["Harika olacak!", "Harikaydı!", "Harika değil", "Harika mı?"] },
          { type: "fill", q: "We ___ (stay) at a nice hotel.", a: "stayed", options: ["stayed", "stay", "staying", "stays"] },
          { type: "choose", q: "“How was your trip?” ne demek?", a: "Yolculuğun nasıldı?", options: ["Yolculuğun nasıl?", "Yolculuğun nasıldı?", "Nereye gidiyorsun?", "Ne zaman gittin?"] },
        ]},
      ],
    },
    {
      id: "en-u5", level: "A2", title: "Gelecek & Planlar", icon: "📅", desc: "Planlar, niyetler ve hava durumu",
      lessons: [
        { id: "en-u5-l1", title: "Planlar", exercises: [
          { type: "fill", q: "I ___ going to call her later.", a: "am", options: ["am", "is", "are", "be"] },
          { type: "translate", q: "Yarın seni arayacağım.", a: "I will call you tomorrow", bank: ["I", "will", "call", "you", "tomorrow", "called", "yesterday"] },
          { type: "choose", q: "Anlık karar için hangisi? “I ___ help you.”", a: "will", options: ["will", "am going", "was", "would"] },
          { type: "choose", q: "“We are going to travel” ne demek?", a: "Seyahat edeceğiz (planlı)", options: ["Seyahat ettik", "Seyahat edeceğiz (planlı)", "Seyahat ediyoruz", "Seyahat etmeyiz"] },
          { type: "match", pairs: [["next week", "gelecek hafta"], ["soon", "yakında"], ["later", "sonra"], ["tonight", "bu gece"]] },
        ]},
        { id: "en-u5-l2", title: "Hava Durumu", exercises: [
          { type: "match", pairs: [["sunny", "güneşli"], ["rainy", "yağmurlu"], ["cold", "soğuk"], ["windy", "rüzgarlı"]] },
          { type: "choose", q: "“It will rain tomorrow” ne demek?", a: "Yarın yağmur yağacak", options: ["Dün yağmur yağdı", "Yarın yağmur yağacak", "Yağmur yağıyor", "Yağmur yağmaz"] },
          { type: "fill", q: "It's very ___ today, take a jacket. (soğuk)", a: "cold", options: ["cold", "sunny", "warm", "hot"] },
        ]},
      ],
    },
    {
      id: "en-u6", level: "A2", title: "Şehirde", icon: "🛍️", desc: "Alışveriş, fiyatlar ve tarifler",
      lessons: [
        { id: "en-u6-l1", title: "Alışveriş", exercises: [
          { type: "choose", q: "“How much is it?” ne demek?", a: "Ne kadar?", options: ["Kaç tane?", "Ne kadar?", "Nerede?", "Hangisi?"] },
          { type: "translate", q: "Bu gömleği deneyebilir miyim?", a: "Can I try this shirt", bank: ["Can", "I", "try", "this", "shirt", "buy", "the"] },
          { type: "match", pairs: [["expensive", "pahalı"], ["cheap", "ucuz"], ["size", "beden"], ["receipt", "fiş"]] },
          { type: "fill", q: "Do you have this in a bigger ___? (beden)", a: "size", options: ["size", "color", "price", "shop"] },
        ]},
      ],
    },

    /* ===================== B1 ===================== */
    {
      id: "en-u7", level: "B1", title: "Fikirler & Duygular", icon: "💭", desc: "Görüş bildirme ve karşılaştırma",
      lessons: [
        { id: "en-u7-l1", title: "Görüş Bildirme", exercises: [
          { type: "choose", q: "“In my opinion” ne demek?", a: "Bence / Bana göre", options: ["Eminim ki", "Bence / Bana göre", "Belki", "Aslında"] },
          { type: "translate", q: "Bence bu film harika.", a: "I think this film is great", bank: ["I", "think", "this", "film", "is", "great", "was", "are"] },
          { type: "fill", q: "I ___ agree with you. (tamamen)", a: "totally", options: ["totally", "total", "totaly", "too"] },
          { type: "choose", q: "“I'm not sure about that” ne demek?", a: "Bundan emin değilim", options: ["Buna katılıyorum", "Bundan emin değilim", "Bu doğru", "Hiç bilmiyorum"] },
          { type: "match", pairs: [["agree", "katılmak"], ["disagree", "katılmamak"], ["maybe", "belki"], ["actually", "aslında"]] },
        ]},
        { id: "en-u7-l2", title: "Karşılaştırma", exercises: [
          { type: "fill", q: "This car is ___ than mine. (daha hızlı)", a: "faster", options: ["faster", "fast", "fastest", "more fast"] },
          { type: "choose", q: "“the most beautiful” ne demek?", a: "en güzel", options: ["daha güzel", "en güzel", "güzel", "çok güzel"] },
          { type: "translate", q: "Bu en iyi karar.", a: "This is the best decision", bank: ["This", "is", "the", "best", "decision", "better", "good"] },
          { type: "fill", q: "She is as tall ___ her brother. (kadar)", a: "as", options: ["as", "than", "like", "so"] },
        ]},
      ],
    },
    {
      id: "en-u8", level: "B1", title: "İş & Okul", icon: "💼", desc: "İş görüşmesi ve eğitim",
      lessons: [
        { id: "en-u8-l1", title: "İş Görüşmesi", exercises: [
          { type: "choose", q: "“I have five years of experience” ne demek?", a: "Beş yıllık deneyimim var", options: ["Beş yıl çalışacağım", "Beş yıllık deneyimim var", "Beş yıl önce başladım", "Beş işim var"] },
          { type: "translate", q: "Bu pozisyonla ilgileniyorum.", a: "I am interested in this position", bank: ["I", "am", "interested", "in", "this", "position", "work", "the"] },
          { type: "match", pairs: [["skill", "beceri"], ["salary", "maaş"], ["deadline", "son tarih"], ["meeting", "toplantı"]] },
          { type: "fill", q: "I'm good ___ working in a team. (-de/-da)", a: "at", options: ["at", "in", "on", "for"] },
        ]},
        { id: "en-u8-l2", title: "Eğitim", exercises: [
          { type: "choose", q: "“I'm studying engineering” ne demek?", a: "Mühendislik okuyorum", options: ["Mühendislik okudum", "Mühendislik okuyorum", "Mühendis olacağım", "Mühendisi tanıyorum"] },
          { type: "translate", q: "Sınavı geçmek için çok çalıştım.", a: "I studied hard to pass the exam", bank: ["I", "studied", "hard", "to", "pass", "the", "exam", "study", "fail"] },
          { type: "match", pairs: [["degree", "diploma"], ["lecture", "ders (anlatım)"], ["research", "araştırma"], ["assignment", "ödev"]] },
        ]},
      ],
    },

    /* ===================== B2 ===================== */
    {
      id: "en-u9", level: "B2", title: "Tartışma & İkna", icon: "⚖️", desc: "Sebep-sonuç ve ikna dili",
      lessons: [
        { id: "en-u9-l1", title: "İkna Etme", exercises: [
          { type: "choose", q: "“Despite the rain, we went out” yapısında 'despite' ne demek?", a: "-e rağmen", options: ["çünkü", "-e rağmen", "yüzünden", "eğer"] },
          { type: "translate", q: "Yorgun olmasına rağmen çalışmaya devam etti.", a: "Although he was tired he kept working", bank: ["Although", "he", "was", "tired", "he", "kept", "working", "because", "so"] },
          { type: "fill", q: "We cancelled the trip ___ the storm. (yüzünden)", a: "because of", options: ["because of", "because", "although", "despite"] },
          { type: "choose", q: "“On the other hand” ne anlama gelir?", a: "Öte yandan / Diğer taraftan", options: ["Bu yüzden", "Öte yandan / Diğer taraftan", "Örneğin", "Sonuç olarak"] },
          { type: "match", pairs: [["therefore", "bu nedenle"], ["however", "ancak"], ["moreover", "üstelik"], ["for instance", "örneğin"]] },
        ]},
        { id: "en-u9-l2", title: "Koşullu Cümleler", exercises: [
          { type: "fill", q: "If I ___ rich, I would travel the world. (2. koşul)", a: "were", options: ["were", "am", "will be", "was being"] },
          { type: "translate", q: "Daha erken kalksaydım, otobüsü kaçırmazdım.", a: "If I had got up earlier I would not have missed the bus", bank: ["If", "I", "had", "got", "up", "earlier", "I", "would", "not", "have", "missed", "the", "bus", "will"] },
          { type: "choose", q: "“I wish I had studied more” ne demek?", a: "Keşke daha çok çalışsaydım", options: ["Keşke daha çok çalışsam", "Keşke daha çok çalışsaydım", "Daha çok çalışacağım", "Daha çok çalışıyorum"] },
        ]},
      ],
    },
    {
      id: "en-u10", level: "B2", title: "Modern Dünya", icon: "🌐", desc: "Teknoloji, çevre ve medya",
      lessons: [
        { id: "en-u10-l1", title: "Teknoloji & Çevre", exercises: [
          { type: "match", pairs: [["sustainable", "sürdürülebilir"], ["device", "cihaz"], ["pollution", "kirlilik"], ["renewable", "yenilenebilir"]] },
          { type: "choose", q: "“This problem must be addressed” ne demek?", a: "Bu sorun ele alınmalı", options: ["Bu sorun çözüldü", "Bu sorun ele alınmalı", "Bu sorun küçük", "Bu sorunu çözdüm"] },
          { type: "fill", q: "Social media ___ changed how we communicate. (etken: tamamladı)", a: "has", options: ["has", "have", "is", "was"] },
          { type: "translate", q: "Bu uygulama milyonlarca insan tarafından kullanılıyor.", a: "This app is used by millions of people", bank: ["This", "app", "is", "used", "by", "millions", "of", "people", "use", "uses"] },
        ]},
      ],
    },

    /* ===================== C1 ===================== */
    {
      id: "en-u11", level: "C1", title: "İleri İfade", icon: "🎭", desc: "Deyimler, nüanslar ve doğal dil",
      lessons: [
        { id: "en-u11-l1", title: "Deyimler", exercises: [
          { type: "choose", q: "“It's a piece of cake” ne demek?", a: "Çok kolay", options: ["Çok kolay", "Çok pahalı", "Çok lezzetli", "Çok zor"] },
          { type: "choose", q: "“To break the ice” deyimi:", a: "Ortamı yumuşatmak / buzları eritmek", options: ["Bir şeyi kırmak", "Ortamı yumuşatmak / buzları eritmek", "Üşümek", "Acele etmek"] },
          { type: "match", pairs: [["hit the books", "ders çalışmaya koyulmak"], ["under the weather", "keyifsiz/hasta"], ["call it a day", "günü tamamlamak"], ["on the same page", "aynı fikirde"]] },
          { type: "choose", q: "“Bear with me” ne anlama gelir?", a: "Biraz sabredin / bekleyin", options: ["Benimle gel", "Biraz sabredin / bekleyin", "Ayıya dikkat", "Bana katıl"] },
        ]},
        { id: "en-u11-l2", title: "Vurgu & Devrik Yapı", exercises: [
          { type: "fill", q: "Not only ___ he arrive late, but he also forgot the keys.", a: "did", options: ["did", "was", "had", "does"] },
          { type: "translate", q: "Bunu daha önce hiç görmemiştim.", a: "Never had I seen this before", bank: ["Never", "had", "I", "seen", "this", "before", "did", "have"] },
          { type: "choose", q: "“Hardly had I sat down when the phone rang” yapısı neyi vurgular?", a: "Bir olay olur olmaz diğerinin olması", options: ["Geç kalmayı", "Bir olay olur olmaz diğerinin olması", "Geçmiş alışkanlık", "Gelecek plan"] },
        ]},
      ],
    },
    {
      id: "en-u12", level: "C1", title: "Akademik Dil", icon: "🎓", desc: "Soyut ve resmi ifadeler",
      lessons: [
        { id: "en-u12-l1", title: "Resmi İfade", exercises: [
          { type: "match", pairs: [["nevertheless", "yine de"], ["consequently", "sonuç olarak"], ["albeit", "her ne kadar ... olsa da"], ["notwithstanding", "-e rağmen"]] },
          { type: "choose", q: "Resmi yazıda “to sum up” yerine hangisi kullanılır?", a: "In conclusion", options: ["In conclusion", "So yeah", "Anyway", "By the way"] },
          { type: "translate", q: "Bulgular hipotezi desteklemektedir.", a: "The findings support the hypothesis", bank: ["The", "findings", "support", "the", "hypothesis", "results", "deny"] },
          { type: "fill", q: "The results are, ___ , inconclusive. (bununla birlikte)", a: "however", options: ["however", "because", "so", "therefore"] },
        ]},
      ],
    },
  ],

  es: [
    { id: "es-u1", level: "A1", title: "Lo Básico", icon: "👋", desc: "Selamlaşma ve temel kelimeler",
      lessons: [
        { id: "es-u1-l1", title: "Selamlaşma", exercises: [
          { type: "choose", q: "“Hola” ne demek?", a: "Merhaba", options: ["Merhaba", "Güle güle", "Teşekkürler", "Evet"] },
          { type: "match", pairs: [["Hola", "Merhaba"], ["Adiós", "Hoşça kal"], ["Gracias", "Teşekkürler"], ["Por favor", "Lütfen"]] },
          { type: "choose", q: "“Buenos días” ne demek?", a: "Günaydın", options: ["İyi geceler", "Günaydın", "İyi akşamlar", "Hoşça kal"] },
          { type: "translate", q: "Adın ne?", a: "Cómo te llamas", bank: ["Cómo", "te", "llamas", "estás", "soy", "gracias"] },
          { type: "fill", q: "Me ___ Carlos. (adım)", a: "llamo", options: ["llamo", "gracias", "hola", "bien"] },
        ]},
        { id: "es-u1-l2", title: "Temel Kelimeler", exercises: [
          { type: "match", pairs: [["Sí", "Evet"], ["No", "Hayır"], ["Agua", "Su"], ["Pan", "Ekmek"]] },
          { type: "choose", q: "“¿Cómo estás?” ne demek?", a: "Nasılsın?", options: ["Adın ne?", "Nasılsın?", "Nerelisin?", "Kaç yaşındasın?"] },
          { type: "translate", q: "İyiyim, teşekkürler.", a: "Estoy bien gracias", bank: ["Estoy", "bien", "gracias", "mal", "soy", "hola"] },
          { type: "fill", q: "Quiero ___ , por favor. (su)", a: "agua", options: ["agua", "pan", "hola", "sí"] },
        ]},
      ],
    },
    { id: "es-u2", level: "A2", title: "Vida Diaria", icon: "☕", desc: "Aile ve sayılar",
      lessons: [
        { id: "es-u2-l1", title: "Aile & Sayılar", exercises: [
          { type: "match", pairs: [["Madre", "Anne"], ["Padre", "Baba"], ["Uno", "Bir"], ["Dos", "İki"]] },
          { type: "choose", q: "“Tres” kaçtır?", a: "3", options: ["1", "2", "3", "4"] },
          { type: "translate", q: "Bu benim ailem.", a: "Esta es mi familia", bank: ["Esta", "es", "mi", "familia", "padre", "casa"] },
          { type: "fill", q: "Tengo ___ hermanos. (iki)", a: "dos", options: ["uno", "dos", "tres", "agua"] },
        ]},
      ],
    },
  ],

  de: [
    { id: "de-u1", level: "A1", title: "Grundlagen", icon: "👋", desc: "Selamlaşma ve tanışma",
      lessons: [
        { id: "de-u1-l1", title: "Selamlaşma", exercises: [
          { type: "choose", q: "“Hallo” ne demek?", a: "Merhaba", options: ["Merhaba", "Güle güle", "Teşekkürler", "Evet"] },
          { type: "match", pairs: [["Hallo", "Merhaba"], ["Tschüss", "Hoşça kal"], ["Danke", "Teşekkürler"], ["Bitte", "Lütfen"]] },
          { type: "choose", q: "“Guten Morgen” ne demek?", a: "Günaydın", options: ["İyi geceler", "Günaydın", "İyi akşamlar", "Hoşça kal"] },
          { type: "translate", q: "Benim adım Anna.", a: "Ich heiße Anna", bank: ["Ich", "heiße", "Anna", "bin", "danke", "du"] },
          { type: "fill", q: "Wie ___ du? (nasılsın)", a: "geht's", options: ["geht's", "heiße", "danke", "bitte"] },
        ]},
        { id: "de-u1-l2", title: "Temel Kelimeler", exercises: [
          { type: "match", pairs: [["Ja", "Evet"], ["Nein", "Hayır"], ["Wasser", "Su"], ["Brot", "Ekmek"]] },
          { type: "choose", q: "“Ich bin müde” ne demek?", a: "Yorgunum", options: ["Açım", "Yorgunum", "Mutluyum", "Susadım"] },
          { type: "translate", q: "Su istiyorum.", a: "Ich möchte Wasser", bank: ["Ich", "möchte", "Wasser", "Brot", "bin", "du"] },
          { type: "fill", q: "Das ist meine ___. (aile)", a: "Familie", options: ["Familie", "Wasser", "Brot", "Danke"] },
        ]},
      ],
    },
  ],

  fr: [
    { id: "fr-u1", level: "A1", title: "Les Bases", icon: "👋", desc: "Selamlaşma ve tanışma",
      lessons: [
        { id: "fr-u1-l1", title: "Selamlaşma", exercises: [
          { type: "choose", q: "“Bonjour” ne demek?", a: "Merhaba / İyi günler", options: ["Merhaba / İyi günler", "Güle güle", "Teşekkürler", "Evet"] },
          { type: "match", pairs: [["Bonjour", "Merhaba"], ["Au revoir", "Hoşça kal"], ["Merci", "Teşekkürler"], ["S'il vous plaît", "Lütfen"]] },
          { type: "choose", q: "“Comment ça va?” ne demek?", a: "Nasılsın?", options: ["Adın ne?", "Nasılsın?", "Nerelisin?", "Kaç yaşındasın?"] },
          { type: "translate", q: "Benim adım Marie.", a: "Je m'appelle Marie", bank: ["Je", "m'appelle", "Marie", "suis", "merci", "tu"] },
          { type: "fill", q: "Je vais ___. (iyi)", a: "bien", options: ["bien", "merci", "non", "eau"] },
        ]},
        { id: "fr-u1-l2", title: "Temel Kelimeler", exercises: [
          { type: "match", pairs: [["Oui", "Evet"], ["Non", "Hayır"], ["Eau", "Su"], ["Pain", "Ekmek"]] },
          { type: "choose", q: "“J'ai faim” ne demek?", a: "Açım", options: ["Susadım", "Açım", "Yorgunum", "Mutluyum"] },
          { type: "translate", q: "Su istiyorum lütfen.", a: "Je veux de l'eau", bank: ["Je", "veux", "de", "l'eau", "pain", "non"] },
          { type: "fill", q: "C'est ma ___. (aile)", a: "famille", options: ["famille", "eau", "pain", "merci"] },
        ]},
      ],
    },
  ],

  it: [
    { id: "it-u1", level: "A1", title: "Le Basi", icon: "👋", desc: "Selamlaşma ve tanışma",
      lessons: [
        { id: "it-u1-l1", title: "Selamlaşma", exercises: [
          { type: "choose", q: "“Ciao” ne demek?", a: "Merhaba / Hoşça kal", options: ["Merhaba / Hoşça kal", "Teşekkürler", "Lütfen", "Evet"] },
          { type: "match", pairs: [["Ciao", "Merhaba"], ["Arrivederci", "Hoşça kal"], ["Grazie", "Teşekkürler"], ["Per favore", "Lütfen"]] },
          { type: "choose", q: "“Buongiorno” ne demek?", a: "Günaydın / İyi günler", options: ["İyi geceler", "Günaydın / İyi günler", "Hoşça kal", "Teşekkürler"] },
          { type: "translate", q: "Benim adım Luca.", a: "Mi chiamo Luca", bank: ["Mi", "chiamo", "Luca", "sono", "grazie", "tu"] },
          { type: "fill", q: "Come ___? (nasılsın)", a: "stai", options: ["stai", "grazie", "ciao", "bene"] },
        ]},
      ],
    },
  ],

  zh: [
    { id: "zh-u1", level: "A1", title: "基础 (Temeller)", icon: "👋", desc: "Pinyin ile selamlaşma",
      lessons: [
        { id: "zh-u1-l1", title: "Selamlaşma", exercises: [
          { type: "choose", q: "“你好 (Nǐ hǎo)” ne demek?", a: "Merhaba", options: ["Merhaba", "Güle güle", "Teşekkürler", "Evet"] },
          { type: "match", pairs: [["你好 Nǐ hǎo", "Merhaba"], ["谢谢 Xièxie", "Teşekkürler"], ["再见 Zàijiàn", "Hoşça kal"], ["是 Shì", "Evet"]] },
          { type: "choose", q: "“谢谢 (Xièxie)” ne demek?", a: "Teşekkürler", options: ["Lütfen", "Teşekkürler", "Merhaba", "Hayır"] },
          { type: "fill", q: "Ben = 我 (___)", a: "Wǒ", options: ["Wǒ", "Nǐ", "Tā", "Shì"] },
        ]},
      ],
    },
  ],
};

/* ==========================================================================
   GRAMER KONULARI (seviyeye göre)
   ========================================================================== */

const GRAMMAR = {
  en: [
    { id: "en-g1", level: "A1", title: "to be (am / is / are)", summary: "İngilizcenin en temel fiili. “olmak” anlamına gelir.",
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
        <div class="g-tip">💡 Konuşmada kısaltılır: I'm, he's, she's, you're, they're.</div>`,
      examples: [["I am from Turkey.", "Ben Türkiye'denim."], ["You are my friend.", "Sen benim arkadaşımsın."], ["It is cold today.", "Bugün hava soğuk."]],
    },
    { id: "en-g2", level: "A1", title: "Geniş Zaman (Present Simple)", summary: "Alışkanlıklar, genel doğrular ve rutinler için kullanılır.",
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
        <div class="g-tip">💡 3. tekil şahısta (he/she/it) fiile -s eklemeyi unutma!</div>`,
      examples: [["I drink water every day.", "Her gün su içerim."], ["She works in a bank.", "O bir bankada çalışır."], ["Do you like music?", "Müziği sever misin?"]],
    },
    { id: "en-g3", level: "A2", title: "Şimdiki Zaman (Present Continuous)", summary: "Tam şu anda olan eylemler için: am/is/are + fiil-ing.",
      body: `
        <p><b>Yapı:</b> özne + (am/is/are) + fiil<b>-ing</b></p>
        <p>I <b>am reading</b> a book. (Şu an kitap okuyorum.)</p>
        <p>They <b>are playing</b> football. (Onlar futbol oynuyor.)</p>
        <p><b>Olumsuz:</b> She <u>isn't</u> sleeping.</p>
        <p><b>Soru:</b> <u>Are</u> you listening?</p>
        <div class="g-tip">💡 “now, right now, at the moment” bu zamanın işaretleridir.</div>`,
      examples: [["I am learning English.", "İngilizce öğreniyorum."], ["It is raining now.", "Şu an yağmur yağıyor."], ["What are you doing?", "Ne yapıyorsun?"]],
    },
    { id: "en-g4", level: "A2", title: "Geçmiş Zaman (Past Simple)", summary: "Geçmişte bitmiş eylemler. Düzenli fiillere -ed eklenir.",
      body: `
        <p><b>Düzenli fiiller:</b> work → work<b>ed</b>, play → play<b>ed</b></p>
        <p><b>Düzensiz fiiller</b> ezberlenir: go → <b>went</b>, eat → <b>ate</b>, see → <b>saw</b></p>
        <p><b>Olumsuz:</b> I <u>didn't</u> go. (Tüm özneler için “didn't + yalın fiil”)</p>
        <p><b>Soru:</b> <u>Did</u> you see it?</p>
        <div class="g-tip">💡 yesterday, last week, in 2010, ago → geçmiş zaman işaretleri.</div>`,
      examples: [["I watched a movie yesterday.", "Dün bir film izledim."], ["She went to school.", "O okula gitti."], ["Did you call me?", "Beni aradın mı?"]],
    },
    { id: "en-g5", level: "B1", title: "Gelecek Zaman (will / going to)", summary: "Tahminler için 'will', planlar için 'going to'.",
      body: `
        <p><b>will:</b> anlık kararlar ve tahminler → I <b>will</b> help you.</p>
        <p><b>be going to:</b> önceden yapılmış planlar → I <b>am going to</b> travel.</p>
        <p><b>Olumsuz:</b> I <u>won't</u> (will not) come.</p>
        <div class="g-tip">💡 “I think, maybe, probably” genelde 'will' ile kullanılır.</div>`,
      examples: [["I will call you tomorrow.", "Seni yarın arayacağım."], ["We are going to buy a car.", "Bir araba alacağız (planlı)."], ["It will rain tonight.", "Bu gece yağmur yağacak."]],
    },
    { id: "en-g6", level: "B1", title: "Present Perfect (have/has + V3)", summary: "Geçmişte olup şimdiyle bağlantısı süren olaylar.",
      body: `
        <p><b>Yapı:</b> have/has + fiilin 3. hali (past participle).</p>
        <p>I <b>have visited</b> London. (Londra'ya gittim — ne zaman önemli değil.)</p>
        <p><b>just / already / yet:</b> She has <u>just</u> arrived. / Have you finished <u>yet</u>?</p>
        <p><b>since / for:</b> I've lived here <u>since</u> 2015 / <u>for</u> 8 years.</p>
        <div class="g-tip">💡 Belirli geçmiş zaman (yesterday) varsa Past Simple kullan, Present Perfect değil.</div>`,
      examples: [["I have never been to Japan.", "Hiç Japonya'ya gitmedim."], ["She has finished her homework.", "Ödevini bitirdi."], ["We have known each other for years.", "Yıllardır birbirimizi tanıyoruz."]],
    },
    { id: "en-g7", level: "B2", title: "Koşul Cümleleri (Conditionals)", summary: "If cümleleri: 1., 2. ve 3. tip koşullar.",
      body: `
        <p><b>1. tip (gerçek/olası):</b> If it rains, I <b>will stay</b> home.</p>
        <p><b>2. tip (hayali/şimdi):</b> If I <b>were</b> rich, I <b>would</b> travel.</p>
        <p><b>3. tip (geçmiş pişmanlık):</b> If I <b>had studied</b>, I <b>would have passed</b>.</p>
        <table class="g-table">
          <tr><th>Tip</th><th>if kısmı</th><th>ana kısım</th></tr>
          <tr><td>1</td><td>present</td><td>will + V1</td></tr>
          <tr><td>2</td><td>past</td><td>would + V1</td></tr>
          <tr><td>3</td><td>had + V3</td><td>would have + V3</td></tr>
        </table>
        <div class="g-tip">💡 2. tipte “I were” kullanmak daha doğrudur (was değil).</div>`,
      examples: [["If you heat ice, it melts.", "Buzu ısıtırsan erir."], ["If I had a car, I would drive.", "Arabam olsa sürerdim."], ["If she had called, I would have answered.", "Arasaydı cevap verirdim."]],
    },
    { id: "en-g8", level: "B2", title: "Edilgen Çatı (Passive Voice)", summary: "Eylemi yapandan çok eylemin kendisi önemliyse.",
      body: `
        <p><b>Yapı:</b> to be + fiilin 3. hali (V3).</p>
        <p>Active: They <b>built</b> the bridge. → Passive: The bridge <b>was built</b>.</p>
        <p>Eylemi yapan önemliyse <b>by</b> eklenir: The book was written <u>by</u> Orwell.</p>
        <div class="g-tip">💡 Haber dili ve akademik metinlerde çok kullanılır.</div>`,
      examples: [["English is spoken here.", "Burada İngilizce konuşulur."], ["The car was repaired yesterday.", "Araba dün tamir edildi."], ["This app is used by millions.", "Bu uygulama milyonlarca kişi tarafından kullanılır."]],
    },
    { id: "en-g9", level: "C1", title: "Devrik Yapı (Inversion)", summary: "Vurgu için özne-yardımcı fiil yer değiştirir.",
      body: `
        <p>Olumsuz/sınırlayıcı zarflar cümle başına gelince devrik yapı kullanılır:</p>
        <p><b>Never</b> have I seen such a thing. (Hiç böyle bir şey görmedim.)</p>
        <p><b>Not only</b> did he apologize, <b>but</b> he also paid.</p>
        <p><b>Hardly</b> had I arrived <b>when</b> it started to rain.</p>
        <div class="g-tip">💡 Resmi ve edebî dilde etkileyici bir vurgu sağlar.</div>`,
      examples: [["Rarely do we see such talent.", "Nadiren böyle yetenek görürüz."], ["Little did she know the truth.", "Gerçeği hiç bilmiyordu."], ["No sooner had he left than she called.", "O gider gitmez kadın aradı."]],
    },
  ],
  es: [
    { id: "es-g1", level: "A1", title: "ser ve estar (olmak)", summary: "İspanyolcada 'olmak' için iki fiil vardır.",
      body: `
        <p><b>ser</b> → kalıcı özellikler (kimlik, meslek, milliyet): Soy estudiante. (Öğranciyim.)</p>
        <p><b>estar</b> → geçici durumlar ve yer: Estoy cansado. (Yorgunum.) / Estoy en casa. (Evdeyim.)</p>
        <table class="g-table">
          <tr><th>Özne</th><th>ser</th><th>estar</th></tr>
          <tr><td>yo (ben)</td><td>soy</td><td>estoy</td></tr>
          <tr><td>tú (sen)</td><td>eres</td><td>estás</td></tr>
          <tr><td>él/ella (o)</td><td>es</td><td>está</td></tr>
        </table>
        <div class="g-tip">💡 Duygu ve yer → estar, kimlik → ser.</div>`,
      examples: [["Soy de Turquía.", "Türkiye'denim."], ["Estoy bien.", "İyiyim."], ["Ella es médica.", "O bir doktor."]],
    },
    { id: "es-g2", level: "A2", title: "İsimlerde Cinsiyet (el / la)", summary: "İspanyolcada her isim eril veya dişildir.",
      body: `
        <p><b>el</b> → eril isimler (genelde -o): <b>el</b> libro (kitap)</p>
        <p><b>la</b> → dişil isimler (genelde -a): <b>la</b> casa (ev)</p>
        <p>Çoğul: <b>los</b> libros / <b>las</b> casas</p>
        <div class="g-tip">💡 İstisnalar vardır: el día (gün) erildir.</div>`,
      examples: [["el coche", "araba"], ["la mesa", "masa"], ["los amigos", "arkadaşlar"]],
    },
  ],
  de: [
    { id: "de-g1", level: "A1", title: "Artikeller (der / die / das)", summary: "Almancada her ismin bir cinsiyeti (artikeli) vardır.",
      body: `
        <p><b>der</b> → eril: der Mann (adam)</p>
        <p><b>die</b> → dişil: die Frau (kadın)</p>
        <p><b>das</b> → nötr: das Kind (çocuk)</p>
        <p>Çoğulda hepsi <b>die</b> olur: die Männer, die Frauen.</p>
        <div class="g-tip">💡 Artikeli kelimeyle birlikte ezberle — tahmin etmek zordur.</div>`,
      examples: [["der Tisch", "masa"], ["die Lampe", "lamba"], ["das Buch", "kitap"]],
    },
    { id: "de-g2", level: "A1", title: "sein (olmak)", summary: "Almancanın en temel fiili.",
      body: `
        <table class="g-table">
          <tr><th>Özne</th><th>sein</th></tr>
          <tr><td>ich (ben)</td><td>bin</td></tr>
          <tr><td>du (sen)</td><td>bist</td></tr>
          <tr><td>er/sie/es (o)</td><td>ist</td></tr>
          <tr><td>wir (biz)</td><td>sind</td></tr>
        </table>
        <div class="g-tip">💡 Ich bin müde = Yorgunum.</div>`,
      examples: [["Ich bin Student.", "Öğranciyim."], ["Du bist nett.", "Sen naziksin."], ["Er ist hier.", "O burada."]],
    },
  ],
  fr: [
    { id: "fr-g1", level: "A1", title: "être (olmak)", summary: "Fransızcanın temel fiili.",
      body: `
        <table class="g-table">
          <tr><th>Özne</th><th>être</th></tr>
          <tr><td>je (ben)</td><td>suis</td></tr>
          <tr><td>tu (sen)</td><td>es</td></tr>
          <tr><td>il/elle (o)</td><td>est</td></tr>
          <tr><td>nous (biz)</td><td>sommes</td></tr>
        </table>
        <div class="g-tip">💡 Je suis fatigué = Yorgunum.</div>`,
      examples: [["Je suis étudiant.", "Öğranciyim."], ["Tu es gentil.", "Sen naziksin."], ["Elle est ici.", "O burada."]],
    },
    { id: "fr-g2", level: "A2", title: "Tanımlıklar (le / la / les)", summary: "Fransızcada isimlerin cinsiyeti vardır.",
      body: `
        <p><b>le</b> → eril: le livre (kitap)</p>
        <p><b>la</b> → dişil: la maison (ev)</p>
        <p><b>les</b> → çoğul: les livres</p>
        <p>Ünlüden önce → <b>l'</b>: l'ami (arkadaş)</p>
        <div class="g-tip">💡 Cinsiyeti kelimeyle birlikte öğren.</div>`,
      examples: [["le chat", "kedi"], ["la table", "masa"], ["les enfants", "çocuklar"]],
    },
  ],
  it: [
    { id: "it-g1", level: "A1", title: "essere (olmak)", summary: "İtalyancanın temel fiili.",
      body: `
        <table class="g-table">
          <tr><th>Özne</th><th>essere</th></tr>
          <tr><td>io (ben)</td><td>sono</td></tr>
          <tr><td>tu (sen)</td><td>sei</td></tr>
          <tr><td>lui/lei (o)</td><td>è</td></tr>
          <tr><td>noi (biz)</td><td>siamo</td></tr>
        </table>
        <div class="g-tip">💡 Sono stanco = Yorgunum.</div>`,
      examples: [["Sono italiano.", "İtalyanım."], ["Tu sei simpatico.", "Sen sevimlisin."], ["Lei è qui.", "O burada."]],
    },
  ],
  zh: [
    { id: "zh-g1", level: "A1", title: "Tonlar (4 Ton)", summary: "Mandarin'de aynı hece farklı tonlarda farklı anlamlar taşır.",
      body: `
        <p>Mandarin'de <b>4 ton</b> + nötr ton vardır. Örnek hece: <b>ma</b></p>
        <table class="g-table">
          <tr><th>Ton</th><th>İşaret</th><th>Anlam</th></tr>
          <tr><td>1. (düz)</td><td>mā 妈</td><td>anne</td></tr>
          <tr><td>2. (yükselen)</td><td>má 麻</td><td>kenevir</td></tr>
          <tr><td>3. (inip çıkan)</td><td>mǎ 马</td><td>at</td></tr>
          <tr><td>4. (düşen)</td><td>mà 骂</td><td>azarlamak</td></tr>
        </table>
        <div class="g-tip">💡 Ton yanlışsa kelime tamamen değişir — bu yüzden çok önemli.</div>`,
      examples: [["你好 Nǐ hǎo", "Merhaba"], ["我 Wǒ", "Ben"], ["谢谢 Xièxie", "Teşekkürler"]],
    },
  ],
};

/* ==========================================================================
   OKUMA METİNLERİ — seviyeli
   ========================================================================== */

const READINGS = {
  en: [
    { id: "en-r1", level: "A1", title: "A New Day", cover: "🌅", minutes: 2, desc: "Basit bir sabah rutini hikayesi.",
      paragraphs: [["Tom wakes up early.", "Tom erken uyanır."], ["He opens the window and looks outside.", "Pencereyi açar ve dışarı bakar."], ["The sun is bright and the birds are singing.", "Güneş parlak ve kuşlar ötüyor."], ["He drinks a cup of coffee and eats some bread.", "Bir fincan kahve içer ve biraz ekmek yer."], ["“Today is a good day,” he says with a smile.", "“Bugün güzel bir gün,” der gülümseyerek."]],
      vocab: [["wake up", "uyanmak"], ["window", "pencere"], ["bright", "parlak"], ["smile", "gülümseme"]] },
    { id: "en-r2", level: "A2", title: "The Lost Key", cover: "🔑", minutes: 3, desc: "Anahtarını kaybeden bir kadının kısa hikayesi.",
      paragraphs: [["Sarah cannot find her key.", "Sarah anahtarını bulamıyor."], ["She looks in her bag, but it is not there.", "Çantasına bakar ama orada değil."], ["She checks her pockets and the table.", "Ceplerini ve masayı kontrol eder."], ["Suddenly, she remembers something.", "Birden bir şey hatırlar."], ["The key was in the door the whole time!", "Anahtar bütün zaman kapıdaymış!"], ["She laughs and finally goes inside.", "Güler ve sonunda içeri girer."]],
      vocab: [["lost", "kayıp"], ["pocket", "cep"], ["suddenly", "birden"], ["remember", "hatırlamak"]] },
    { id: "en-r3", level: "B1", title: "The Old Bookstore", cover: "📚", minutes: 4, desc: "Şehirdeki gizemli bir kitapçı hakkında.",
      paragraphs: [["At the end of a narrow street, there was an old bookstore.", "Dar bir sokağın sonunda eski bir kitapçı vardı."], ["Few people knew about it, but those who did never forgot it.", "Çok az kişi onu bilirdi ama bilenler asla unutmazdı."], ["The owner, an elderly man, seemed to know exactly what each visitor needed.", "Yaşlı bir adam olan sahibi, her ziyaretçinin tam olarak neye ihtiyacı olduğunu bilir gibiydi."], ["“Books find their readers,” he often said.", "“Kitaplar okurlarını bulur,” derdi sık sık."], ["One rainy afternoon, a young woman walked in, looking for nothing in particular.", "Yağmurlu bir öğleden sonra, özel bir şey aramayan genç bir kadın içeri girdi."], ["She left with a book that would change her life.", "Hayatını değiştirecek bir kitapla ayrıldı."]],
      vocab: [["narrow", "dar"], ["owner", "sahip"], ["elderly", "yaşlı"], ["in particular", "özellikle"]] },
    { id: "en-r4", level: "B2", title: "The Interview", cover: "💼", minutes: 5, desc: "Önemli bir iş görüşmesi ve beklenmedik bir soru.",
      paragraphs: [["Daniel had prepared for the interview for weeks.", "Daniel görüşmeye haftalardır hazırlanmıştı."], ["Despite his confidence, his hands were shaking slightly.", "Özgüvenine rağmen elleri hafifçe titriyordu."], ["The manager looked up and asked an unexpected question.", "Müdür başını kaldırdı ve beklenmedik bir soru sordu."], ["“Tell me about a time you failed,” she said calmly.", "“Bana başarısız olduğun bir anı anlat,” dedi sakince."], ["Daniel paused, then decided to be completely honest.", "Daniel durdu, sonra tamamen dürüst olmaya karar verdi."], ["To his surprise, honesty was exactly what they were looking for.", "Şaşırtıcı şekilde, aradıkları şey tam da dürüstlüktü."]],
      vocab: [["confidence", "özgüven"], ["unexpected", "beklenmedik"], ["pause", "duraksamak"], ["honesty", "dürüstlük"]] },
    { id: "en-r5", level: "C1", title: "The Weight of Silence", cover: "🌫️", minutes: 6, desc: "Hafıza ve seçimler üzerine düşündürücü bir parça.",
      paragraphs: [["There are decisions we make in an instant that quietly shape the rest of our lives.", "Bir anda verdiğimiz ve hayatımızın geri kalanını sessizce şekillendiren kararlar vardır."], ["Margaret had carried one such choice with her for forty years.", "Margaret böyle bir seçimi kırk yıldır taşıyordu."], ["It was not guilt, exactly, but a persistent awareness of a path not taken.", "Tam olarak suçluluk değildi, ama gidilmemiş bir yolun ısrarlı bir farkındalığıydı."], ["Now, standing before the house she had once fled, she felt the weight of silence lift.", "Şimdi, bir zamanlar kaçtığı evin önünde dururken, sessizliğin ağırlığının kalktığını hissetti."], ["Some doors, she realized, are never truly closed; they merely wait.", "Bazı kapıların asla gerçekten kapanmadığını fark etti; yalnızca beklerler."]],
      vocab: [["instant", "an"], ["persistent", "ısrarlı/sürekli"], ["flee (fled)", "kaçmak"], ["merely", "yalnızca"]] },
  ],
  es: [
    { id: "es-r1", level: "A1", title: "Un Día en el Parque", cover: "🌳", minutes: 2, desc: "Parkta geçen basit bir gün.",
      paragraphs: [["María va al parque.", "María parka gider."], ["Hace sol y hace calor.", "Güneşli ve sıcak."], ["Ella come una manzana.", "O bir elma yer."], ["Los niños juegan con un perro.", "Çocuklar bir köpekle oynar."], ["Es un día feliz.", "Mutlu bir gün."]],
      vocab: [["parque", "park"], ["sol", "güneş"], ["manzana", "elma"], ["feliz", "mutlu"]] },
    { id: "es-r2", level: "A2", title: "El Café de la Esquina", cover: "☕", minutes: 3, desc: "Köşedeki kafe hakkında bir hikaye.",
      paragraphs: [["Todas las mañanas, Pablo va al café de la esquina.", "Her sabah Pablo köşedeki kafeye gider."], ["Pide un café con leche y un pan dulce.", "Sütlü kahve ve tatlı bir ekmek ister."], ["La camarera ya conoce su nombre.", "Garson kız artık onun adını biliyor."], ["“Lo de siempre, Pablo?”, pregunta ella.", "“Her zamanki gibi mi, Pablo?” diye sorar."], ["Él sonríe y dice que sí.", "O gülümser ve evet der."]],
      vocab: [["esquina", "köşe"], ["pedir", "istemek"], ["camarera", "garson (kadın)"], ["siempre", "her zaman"]] },
  ],
  de: [
    { id: "de-r1", level: "A1", title: "Im Supermarkt", cover: "🛒", minutes: 2, desc: "Markette geçen basit bir sahne.",
      paragraphs: [["Anna geht in den Supermarkt.", "Anna markete gider."], ["Sie kauft Brot, Milch und Äpfel.", "Ekmek, süt ve elma alır."], ["Das Brot ist frisch.", "Ekmek taze."], ["Sie bezahlt an der Kasse.", "Kasada öder."], ["Dann geht sie nach Hause.", "Sonra eve gider."]],
      vocab: [["kaufen", "satın almak"], ["Brot", "ekmek"], ["frisch", "taze"], ["bezahlen", "ödemek"]] },
  ],
  fr: [
    { id: "fr-r1", level: "A1", title: "Le Petit Déjeuner", cover: "🥐", minutes: 2, desc: "Bir Fransız kahvaltısı.",
      paragraphs: [["Le matin, Claire prend son petit déjeuner.", "Sabahları Claire kahvaltısını yapar."], ["Elle mange un croissant.", "Bir kruvasan yer."], ["Elle boit un café au lait.", "Sütlü kahve içer."], ["Le croissant est délicieux.", "Kruvasan çok lezzetli."], ["Elle est prête pour la journée.", "Güne hazır."]],
      vocab: [["matin", "sabah"], ["manger", "yemek"], ["boire", "içmek"], ["délicieux", "lezzetli"]] },
  ],
  it: [
    { id: "it-r1", level: "A1", title: "La Pizza", cover: "🍕", minutes: 2, desc: "Basit bir akşam yemeği hikayesi.",
      paragraphs: [["Marco fa una pizza a casa.", "Marco evde pizza yapar."], ["Mette pomodoro e formaggio.", "Domates ve peynir koyar."], ["La pizza è molto buona.", "Pizza çok güzel."], ["La famiglia mangia insieme.", "Aile birlikte yer."], ["Tutti sono contenti.", "Herkes memnun."]],
      vocab: [["fare", "yapmak"], ["formaggio", "peynir"], ["insieme", "birlikte"], ["contento", "memnun"]] },
  ],
  zh: [
    { id: "zh-r1", level: "A1", title: "我的家 (Benim Ailem)", cover: "🏠", minutes: 2, desc: "Pinyin ile basit aile tanıtımı.",
      paragraphs: [["我有一个家。 Wǒ yǒu yí ge jiā.", "Bir ailem var."], ["我爱我的家人。 Wǒ ài wǒ de jiārén.", "Ailemi seviyorum."], ["我们很开心。 Wǒmen hěn kāixīn.", "Biz çok mutluyuz."]],
      vocab: [["家 jiā", "ev / aile"], ["爱 ài", "sevmek"], ["开心 kāixīn", "mutlu"], ["我们 wǒmen", "biz"]] },
  ],
};

/* ==========================================================================
   KONUŞMA PRATİĞİ — seviyeli senaryolar
   ========================================================================== */

const CONVERSATIONS = {
  en: [
    { id: "en-c1", title: "Kafede Sipariş", icon: "☕", level: "A1", desc: "Bir kafede kahve sipariş et.",
      steps: [
        { speaker: "Barista", text: "Hi! What can I get for you?", tr: "Merhaba! Size ne getirebilirim?",
          options: [{ text: "I'd like a coffee, please.", correct: true, tr: "Bir kahve istiyorum lütfen." }, { text: "Where is the bank?", correct: false, tr: "Banka nerede?" }, { text: "I am fine, thanks.", correct: false, tr: "İyiyim, teşekkürler." }] },
        { speaker: "Barista", text: "Sure! Small or large?", tr: "Tabii! Küçük mü büyük mü?",
          options: [{ text: "Large, please.", correct: true, tr: "Büyük, lütfen." }, { text: "Yes, I am.", correct: false, tr: "Evet, öyleyim." }, { text: "Good morning.", correct: false, tr: "Günaydın." }] },
        { speaker: "Barista", text: "That's three dollars. Anything else?", tr: "Üç dolar. Başka bir şey?",
          options: [{ text: "No, thank you. Here you are.", correct: true, tr: "Hayır, teşekkürler. Buyurun." }, { text: "I don't know him.", correct: false, tr: "Onu tanımıyorum." }, { text: "It is raining.", correct: false, tr: "Yağmur yağıyor." }] },
      ] },
    { id: "en-c2", title: "Yol Sorma", icon: "🗺️", level: "A2", desc: "Bir yabancıya yol sor.",
      steps: [
        { speaker: "You", text: "Excuse me, how do I get to the station?", tr: "Affedersiniz, istasyona nasıl giderim?", options: [{ text: "(Devam et)", correct: true, tr: "" }] },
        { speaker: "Stranger", text: "Go straight and turn left at the lights.", tr: "Düz git ve ışıklarda sola dön.",
          options: [{ text: "Is it far from here?", correct: true, tr: "Buraya uzak mı?" }, { text: "I am hungry.", correct: false, tr: "Açım." }, { text: "Goodbye!", correct: false, tr: "Hoşça kal!" }] },
        { speaker: "Stranger", text: "No, just a five-minute walk.", tr: "Hayır, sadece beş dakikalık yürüyüş.",
          options: [{ text: "Thank you so much!", correct: true, tr: "Çok teşekkür ederim!" }, { text: "What is your name?", correct: false, tr: "Adın ne?" }, { text: "I like tea.", correct: false, tr: "Çayı severim." }] },
      ] },
    { id: "en-c3", title: "İş Görüşmesi", icon: "💼", level: "B1", desc: "Bir iş görüşmesinde kendini tanıt.",
      steps: [
        { speaker: "Interviewer", text: "So, tell me a little about yourself.", tr: "Peki, bize biraz kendinden bahset.",
          options: [{ text: "I have three years of experience in marketing.", correct: true, tr: "Pazarlamada üç yıllık deneyimim var." }, { text: "I am hungry right now.", correct: false, tr: "Şu an açım." }, { text: "Where is the office?", correct: false, tr: "Ofis nerede?" }] },
        { speaker: "Interviewer", text: "Why do you want to work here?", tr: "Neden burada çalışmak istiyorsun?",
          options: [{ text: "I admire your company's vision and want to grow with it.", correct: true, tr: "Şirketinizin vizyonuna hayranım ve onunla büyümek istiyorum." }, { text: "Because I need money.", correct: false, tr: "Çünkü paraya ihtiyacım var." }, { text: "I don't know.", correct: false, tr: "Bilmiyorum." }] },
        { speaker: "Interviewer", text: "Great. Do you have any questions for us?", tr: "Harika. Bize bir sorunuz var mı?",
          options: [{ text: "Yes, what does a typical day look like?", correct: true, tr: "Evet, tipik bir gün nasıl geçiyor?" }, { text: "No. Bye.", correct: false, tr: "Hayır. Güle güle." }, { text: "Can I sleep here?", correct: false, tr: "Burada uyuyabilir miyim?" }] },
      ] },
    { id: "en-c4", title: "Fikir Tartışması", icon: "⚖️", level: "B2", desc: "Bir konuda kibarca farklı düşün.",
      steps: [
        { speaker: "Colleague", text: "I think we should launch the product immediately.", tr: "Bence ürünü hemen piyasaya sürmeliyiz.",
          options: [{ text: "I see your point, but I think we need more testing.", correct: true, tr: "Ne demek istediğini anlıyorum ama bence daha fazla teste ihtiyacımız var." }, { text: "You are wrong.", correct: false, tr: "Yanılıyorsun." }, { text: "I like pizza.", correct: false, tr: "Pizzayı severim." }] },
        { speaker: "Colleague", text: "But waiting could cost us the market lead.", tr: "Ama beklemek bize pazar liderliğini kaybettirebilir.",
          options: [{ text: "That's a fair concern. Perhaps a limited release could balance both.", correct: true, tr: "Bu haklı bir endişe. Belki sınırlı bir lansman ikisini de dengeler." }, { text: "No, never.", correct: false, tr: "Hayır, asla." }, { text: "I have to go.", correct: false, tr: "Gitmem lazım." }] },
      ] },
  ],
  es: [
    { id: "es-c1", title: "En el Restaurante", icon: "🍽️", level: "A1", desc: "Restoranda sipariş ver.",
      steps: [
        { speaker: "Camarero", text: "Buenas tardes, ¿qué desea?", tr: "İyi günler, ne arzu edersiniz?",
          options: [{ text: "Quiero una pizza, por favor.", correct: true, tr: "Bir pizza istiyorum lütfen." }, { text: "¿Dónde está el baño?", correct: false, tr: "Tuvalet nerede?" }, { text: "Me llamo Ana.", correct: false, tr: "Benim adım Ana." }] },
        { speaker: "Camarero", text: "¿Y para beber?", tr: "İçecek olarak?",
          options: [{ text: "Agua, por favor.", correct: true, tr: "Su, lütfen." }, { text: "Tengo sueño.", correct: false, tr: "Uykum var." }, { text: "Hasta luego.", correct: false, tr: "Görüşürüz." }] },
      ] },
  ],
  de: [
    { id: "de-c1", title: "Im Hotel", icon: "🏨", level: "A1", desc: "Otelde check-in yap.",
      steps: [
        { speaker: "Rezeption", text: "Guten Tag! Haben Sie eine Reservierung?", tr: "İyi günler! Rezervasyonunuz var mı?",
          options: [{ text: "Ja, auf den Namen Schmidt.", correct: true, tr: "Evet, Schmidt adına." }, { text: "Ich bin müde.", correct: false, tr: "Yorgunum." }, { text: "Wo ist das Brot?", correct: false, tr: "Ekmek nerede?" }] },
        { speaker: "Rezeption", text: "Hier ist Ihr Schlüssel. Zimmer 12.", tr: "İşte anahtarınız. Oda 12.",
          options: [{ text: "Vielen Dank!", correct: true, tr: "Çok teşekkürler!" }, { text: "Ich heiße Anna.", correct: false, tr: "Benim adım Anna." }, { text: "Es regnet.", correct: false, tr: "Yağmur yağıyor." }] },
      ] },
  ],
  fr: [
    { id: "fr-c1", title: "À la Boulangerie", icon: "🥖", level: "A1", desc: "Fırından ekmek al.",
      steps: [
        { speaker: "Boulanger", text: "Bonjour ! Vous désirez ?", tr: "Merhaba! Ne arzu edersiniz?",
          options: [{ text: "Une baguette, s'il vous plaît.", correct: true, tr: "Bir baget, lütfen." }, { text: "Je suis fatigué.", correct: false, tr: "Yorgunum." }, { text: "Où est la gare ?", correct: false, tr: "İstasyon nerede?" }] },
        { speaker: "Boulanger", text: "Voilà. Un euro vingt.", tr: "Buyurun. Bir euro yirmi.",
          options: [{ text: "Merci, au revoir !", correct: true, tr: "Teşekkürler, hoşça kalın!" }, { text: "Comment ça va ?", correct: false, tr: "Nasılsın?" }, { text: "J'ai faim.", correct: false, tr: "Açım." }] },
      ] },
  ],
  it: [
    { id: "it-c1", title: "Al Bar", icon: "☕", level: "A1", desc: "İtalyan barında kahve iste.",
      steps: [
        { speaker: "Barista", text: "Buongiorno! Cosa prende?", tr: "Günaydın! Ne alırsınız?",
          options: [{ text: "Un caffè, per favore.", correct: true, tr: "Bir kahve, lütfen." }, { text: "Dov'è il bagno?", correct: false, tr: "Tuvalet nerede?" }, { text: "Sono stanco.", correct: false, tr: "Yorgunum." }] },
        { speaker: "Barista", text: "Ecco a lei. Un euro.", tr: "Buyurun. Bir euro.",
          options: [{ text: "Grazie mille!", correct: true, tr: "Çok teşekkürler!" }, { text: "Mi chiamo Luca.", correct: false, tr: "Benim adım Luca." }, { text: "Piove.", correct: false, tr: "Yağmur yağıyor." }] },
      ] },
  ],
  zh: [
    { id: "zh-c1", title: "买东西 (Alışveriş)", icon: "🛍️", level: "A1", desc: "Bir şeyin fiyatını sor.",
      steps: [
        { speaker: "店员", text: "你好！你要什么？ Nǐ hǎo! Nǐ yào shénme?", tr: "Merhaba! Ne istiyorsunuz?",
          options: [{ text: "我要这个。 Wǒ yào zhège.", correct: true, tr: "Bunu istiyorum." }, { text: "再见。 Zàijiàn.", correct: false, tr: "Hoşça kal." }, { text: "谢谢。 Xièxie.", correct: false, tr: "Teşekkürler." }] },
        { speaker: "店员", text: "十块钱。 Shí kuài qián.", tr: "On yuan.",
          options: [{ text: "好的，谢谢。 Hǎo de, xièxie.", correct: true, tr: "Tamam, teşekkürler." }, { text: "我叫李。 Wǒ jiào Lǐ.", correct: false, tr: "Benim adım Li." }, { text: "下雨了。 Xià yǔ le.", correct: false, tr: "Yağmur yağıyor." }] },
      ] },
  ],
};

window.DATA = { LANGUAGES, LEVELS, LEVEL_INFO, TOP_LANGUAGES_INFO, PLACEMENT, COURSES, GRAMMAR, READINGS, CONVERSATIONS };

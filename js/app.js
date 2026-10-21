// Pranith Kumar portfolio interactions. Frontend demo: connect a backend for real private messages/auth.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const translations = {
  en: {
    home: "Home", about: "About", projects: "Projects", skills: "Skills", contact: "Contact",
    heroText: "I’m Pranith Kumar — an aspiring Full Stack Java Developer who enjoys turning ideas into clean, useful web experiences.",
    explore: "Explore my work", letsTalk: "Let’s talk",
    aboutText: "I’m a Computer Science graduate building my skills across Java, Spring Boot, HTML, CSS, JavaScript and MySQL. I enjoy creating practical projects, learning from every challenge, and connecting thoughtful design with reliable functionality."
  },
  te: {
    home: "హోమ్", about: "నా గురించి", projects: "ప్రాజెక్టులు", skills: "నైపుణ్యాలు", contact: "సంప్రదించండి",
    heroText: "నేను ప్రణిత్ కుమార్ — Java, Spring Boot మరియు వెబ్ టెక్నాలజీలతో ఉపయోగకరమైన వెబ్ అనుభవాలను నిర్మించడం ఇష్టపడే Full Stack Developer.",
    explore: "నా ప్రాజెక్టులు చూడండి", letsTalk: "మాట్లాడుదాం",
    aboutText: "నేను Computer Science గ్రాడ్యుయేట్‌ని. Java, Spring Boot, HTML, CSS, JavaScript మరియు MySQL నేర్చుకుంటూ ప్రాక్టికల్ ప్రాజెక్టులు నిర్మిస్తున్నాను. ప్రతి ప్రాజెక్ట్ ద్వారా కొత్త విషయాలు నేర్చుకోవడం నాకు ఇష్టం."
  }
};

const langButton = $("#langSwitch");
if (langButton) {
  langButton.addEventListener("click", () => {
    const next = document.documentElement.lang === "en" ? "te" : "en";
    document.documentElement.lang = next;
    $$("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (translations[next][key]) el.textContent = translations[next][key];
    });
    langButton.textContent = next === "en" ? "తెలుగు" : "English";
  });
}

const menuToggle = $("#menuToggle");
if (menuToggle) menuToggle.addEventListener("click", () => $("#mainNav")?.classList.toggle("open"));
$$('#mainNav a').forEach(a => a.addEventListener("click", () => $("#mainNav")?.classList.remove("open")));

const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

const projectSearch = $("#projectSearch");
if (projectSearch) {
  const cards = $$(".project-card");
  const count = $("#projectCount");
  const empty = $("#noProjects");
  projectSearch.addEventListener("input", () => {
    const query = projectSearch.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const show = (card.dataset.name + " " + card.innerText).toLowerCase().includes(query);
      card.hidden = !show;
      if (show) visible++;
    });
    count.textContent = `${visible} project${visible === 1 ? "" : "s"}`;
    empty.hidden = visible !== 0;
  });
}

const avatarStage = $("#avatarStage");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (avatarStage && !reduceMotion) {
  avatarStage.addEventListener("pointermove", event => {
    const rect = avatarStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    avatarStage.style.animation = "none";
    avatarStage.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg) translateZ(12px)`;
  });
  avatarStage.addEventListener("pointerleave", () => {
    avatarStage.style.transform = "";
    avatarStage.style.animation = "";
  });
}

$$(".project-card").forEach(card => {
  if (reduceMotion) return;
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

$$(".skill-chip").forEach((chip, i) => {
  if (reduceMotion) return;
  chip.addEventListener("pointermove", e => {
    const r = chip.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    chip.style.transform = `perspective(500px) rotateY(${x * 20}deg) rotateX(${-y * 18}deg) translateZ(12px)`;
  });
  chip.addEventListener("pointerleave", () => chip.style.transform = "");
});

const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 }) : null;
$$(".reveal").forEach(el => observer ? observer.observe(el) : el.classList.add("in-view"));

const backToTop = $("#backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => backToTop.classList.toggle("visible", window.scrollY > 450));
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const contactForm = $("#contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(contactForm);
    const message = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      message: String(form.get("message") || "").trim(),
      createdAt: new Date().toISOString()
    };
    if (!message.name || !message.email || !message.message) return;
    // Demo only: this saves on the same browser. It does NOT send email or notify the owner.
    const saved = JSON.parse(localStorage.getItem("portfolioDemoMessages") || "[]");
    saved.push(message);
    localStorage.setItem("portfolioDemoMessages", JSON.stringify(saved));
    $("#contactStatus").textContent = "Thanks! Demo message saved in this browser only. Connect a backend to deliver it to Pranith.";
    contactForm.reset();
  });
}

const registerForm = $("#registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(registerForm);
    const status = $("#registerStatus");
    // Never store raw passwords in localStorage. This demo does not create an actual account.
    status.textContent = "Demo only — account not created. Connect Spring Boot authentication to register securely.";
  });
}

const loginForm = $("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    $("#loginStatus").textContent = "Demo only — no login session created. Real authentication must be checked by a secure backend.";
  });
}

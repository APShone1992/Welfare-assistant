// -------------------------------
// Welfare Support – Chat Engine
// -------------------------------

const SETTINGS = {
  minConfidence: 0.18,
  topSuggestions: 3,
  boostSubstring: 0.12,
  greeting:
    "Hi! I’m the <b>Welfare Support Assistant</b>. Ask me about opening times, how to contact support, or where we’re located."
};

let FAQS = [];
let faqsLoaded = false;

// Ensure the FAQ path matches repo structure (/public/config/faqs.json)
fetch("public/config/faqs.json")
  .then(res => res.json())
  .then(data => {
    FAQS = data || [];
    faqsLoaded = true;
  })
  .catch(() => {
    // Keep empty FAQs but allow UI to function
    faqsLoaded = true;
  });

// ---------- Matching helpers ----------
const normalize = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")  // accents
    .replace(/[“”‘’]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const tokenSet = (s) => new Set(normalize(s).split(" ").filter(Boolean));

const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  const inter = new Set([...a].filter(x => b.has(x)));
  return inter.size / new Set([...a, ...b]).size;
};

function matchFAQ(query) {
  const qNorm = normalize(query);
  const qTokens = tokenSet(query);
  const results = [];

  for (const item of FAQS) {
    const qField = normalize(item.question || "");
    const syns = (item.synonyms || []).map(normalize);
    const tags = (item.tags || []).map(normalize);

    const scoreQ = jaccard(qTokens, tokenSet(item.question || ""));
    const scoreSyn = syns.length ? Math.max(...syns.map(s => jaccard(qTokens, tokenSet(s)))) : 0;
    const scoreTags = tags.length ? Math.max(...tags.map(t => jaccard(qTokens, tokenSet(t)))) : 0;

    const anyField = [qField, ...syns, ...tags].join(" ");
    const boost = anyField.includes(qNorm) ? (SETTINGS.boostSubstring || 0) : 0;

    const score = 0.65 * scoreQ + 0.25 * scoreSyn + 0.10 * scoreTags + boost;
    results.push({ item, score });
  }

  results.sort((a, b) => b.score - a.score);
  const top = results[0];

  if (!top || top.score < SETTINGS.minConfidence) {
    return {
      matched: false,
      suggestions: results.slice(0, SETTINGS.topSuggestions).map(r => r.item.question)
    };
  }

  return { matched: true, answerHTML: top.item.answer, question: top.item.question };
}

// ---------- UI ----------
const chatWindow = document.getElementById("chatWindow");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

function addBubble(text, type = "bot", isHTML = false) {
  const div = document.createElement("div");
  div.className = "bubble " + type;
  if (isHTML) div.innerHTML = text;
  else div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "bubble bot";
  div.setAttribute("data-typing", "true");
  div.innerHTML = `Typing <span class="typing"><span></span><span></span><span></span></span>`;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTyping() {
  const t = chatWindow.querySelector('[data-typing="true"]');
  if (t) t.remove();
}

function handleUserMessage(text) {
  if (!text) return;

  addBubble(text, "user");
  input.value = "";

  // Show typing for a tiny bit
  addTyping();

  setTimeout(() => {
    removeTyping();

    if (!faqsLoaded) {
      addBubble("Loading knowledge base… please try again in a second.", "bot");
      return;
    }

    const res = matchFAQ(text);

    if (res.matched) {
      addBubble(res.answerHTML, "bot", true);
    } else {
      const suggestions = res.suggestions && res.suggestions.length
        ? "<br>• " + res.suggestions.join("<br>• ")
        : "";
      addBubble("I’m not sure. Did you mean:" + suggestions, "bot", true);
    }
  }, 350);
}

function sendChat() {
  handleUserMessage(input.value.trim());
}

// Enter key to send
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendChat();
  }
});

// Button click
sendBtn.addEventListener("click", sendChat);

// Initial greeting
window.addEventListener("DOMContentLoaded", () => {
  addBubble(SETTINGS.greeting, "bot", true);
});

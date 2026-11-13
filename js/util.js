/* Shared helpers: money formatting, parsing, randomness, DOM shortcuts. */
const U = (() => {
  const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

  // $AUD formatting: always 2 decimal places, thousands separators.
  function money(v) {
    const neg = v < 0;
    const s = Math.abs(round2(v)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (neg ? "−$" : "$") + s;
  }
  // Short money for speech/labels: "$12" instead of "$12.00" when whole dollars.
  function moneyShort(v) {
    const r = round2(v);
    return Number.isInteger(r) ? money(r).replace(".00", "") : money(r);
  }

  // Accepts "12.5", "$12.50", "1,200", " 7 ", "90c" (90 cents → 0.90).
  function parseAnswer(str) {
    if (str == null) return NaN;
    let s = String(str).trim().toLowerCase().replace(/[$,\s]/g, "").replace(/aud$/, "");
    if (s === "") return NaN;
    let cents = false;
    if (/^-?\d*\.?\d+c$/.test(s)) { cents = true; s = s.slice(0, -1); }
    if (!/^-?\d*\.?\d+$/.test(s)) return NaN;
    const v = parseFloat(s);
    return cents ? round2(v / 100) : v;
  }

  const near = (a, b, tol = 0.005) => Math.abs(a - b) < tol;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const $ = (id) => document.getElementById(id);
  function el(tag, attrs = {}, html = "") {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v; else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
    }
    if (html) e.innerHTML = html;
    return e;
  }
  let toastTimer;
  function toast(msg, ms = 2500) {
    const t = $("toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), ms);
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  return { round2, money, moneyShort, parseAnswer, near, rnd, pick, shuffle, $, el, toast, esc };
})();

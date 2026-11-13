/* Stage 4 — Real OC mock exam: 10 questions, 15 minutes, 5 options (A–E), no hints or voice.
   Every wrong option is tagged with the trap it represents, so the report can diagnose habits. */
const Exam = (() => {
  // o: [text, trapType|null]; the first option listed is always the correct one (options are shuffled at start).
  const BANK = [
    { text: "Apples cost $3.60 per kilogram and bananas cost 45c each. Lily buys 2.5 kg of apples and 6 bananas. How much does she pay altogether?",
      o: [["$11.70"], ["$9.45", "Forgot to multiply one of the items"], ["$6.30", "Misread the quantity"], ["$117.00", "Mixed up cents and dollars"], ["$12.15", "Calculation slip"]],
      sol: ["Apples: 2.5 × $3.60 = $9.00", "Bananas: 6 × 45c = 270c = $2.70", "Total: $9.00 + $2.70 = $11.70"] },
    { text: "A 2-litre bottle of juice costs $3.80. A 500 mL bottle costs $1.10. What is the cheapest way to buy exactly 3 litres of juice?",
      o: [["$6.00"], ["$6.60", "Didn't compare unit prices"], ["$5.70", "Bought part of a bottle"], ["$4.90", "Didn't buy enough"], ["$7.60", "Bought more than needed"]],
      sol: ["Compare per 500 mL: 2 L is 4 × 500 mL, so $3.80 ÷ 4 = $0.95 per 500 mL, cheaper than $1.10", "Use one 2 L bottle ($3.80) for 2 L, then 2 × 500 mL bottles for the last 1 L ($2.20)", "Total: $3.80 + $2.20 = $6.00 (six small bottles would cost $6.60)"] },
    { text: "A jacket costs $160. It is reduced by 25%, and then a further 10% is taken off the sale price. What is the final price?",
      o: [["$108"], ["$104", "Added the percentages"], ["$120", "Stopped after one discount"], ["$144", "Stopped after one discount"], ["$112", "Calculation slip"]],
      sol: ["25% of $160 = $40 → $160 − $40 = $120", "10% of the NEW price $120 = $12 → $120 − $12 = $108", "Trap: adding 25% + 10% = 35% off gives $104, which is wrong"] },
    { text: "Noah spent 1/3 of his money on a book and then 1/4 of what was left on a snack. He has $18 left. How much did Noah have to start with?",
      o: [["$36"], ["$43.20", "Took both fractions of the starting money"], ["$24", "Stopped halfway when working backwards"], ["$72", "Calculation slip"], ["$54", "Calculation slip"]],
      sol: ["After the book, he spent 1/4 of the rest, so $18 is 3/4 of the rest → 1/4 = $6 → the rest = $24", "$24 is the 2/3 left after the book → 1/3 = $12 → start = 3 × $12 = $36", "Check: $36 − $12 = $24; 1/4 of $24 = $6; $24 − $6 = $18 ✓"] },
    { text: "Ruby orders 3 books online at $12.95 each. Delivery costs $7.50. She pays with a $50 note. How much change does she get?",
      o: [["$3.65"], ["$11.15", "Forgot the delivery fee"], ["$46.35", "Gave the total, not the change"], ["$4.65", "Calculation slip"], ["$36.50", "Mixed up cents and dollars"]],
      sol: ["Books: 3 × $12.95 = $38.85", "Add delivery: $38.85 + $7.50 = $46.35", "Change: $50.00 − $46.35 = $3.65"] },
    { text: "Pies cost $4.50 each. The bakery has a “Buy 3, get 1 free” deal. Tom needs exactly 10 pies. How much does he pay?",
      o: [["$36.00"], ["$45.00", "Ignored the deal"], ["$33.75", "Took a percentage off everything"], ["$27.00", "Forgot the leftover items"], ["$31.50", "Calculation slip"]],
      sol: ["Each group of 4 pies costs the price of 3", "10 pies = 2 full groups (8 pies, pay for 6) + 2 extra pies (pay for 2)", "Pay for 6 + 2 = 8 pies: 8 × $4.50 = $36.00"] },
    { text: "Zoe and Max share $84. Zoe gets $16 more than Max. How much does Zoe get?",
      o: [["$50"], ["$34", "Found the other person's share"], ["$42", "Shared equally"], ["$58", "Added the difference to half"], ["$68", "Forgot to halve"]],
      sol: ["Take away Zoe's extra: $84 − $16 = $68", "Share equally: $68 ÷ 2 = $34 (Max's share)", "Zoe gets $34 + $16 = $50 (check: $50 + $34 = $84 ✓)"] },
    { text: "A video game costs $80. Its price goes up by 25%. Later, the new price is reduced by 20%. What is the final price?",
      o: [["$80"], ["$84", "Combined the percentages"], ["$100", "Forgot the price drop"], ["$64", "Forgot the price rise"], ["$76", "Calculation slip"]],
      sol: ["25% of $80 = $20 → new price $100", "20% of $100 = $20 → $100 − $20 = $80", "Trap: 25% − 20% = 5% up would give $84, which is wrong"] },
    { text: "Brand A rice costs $6.00 for 750 g. Brand B costs $9.00 for 1.2 kg. How much cheaper per 100 g is Brand B?",
      o: [["5c"], ["$3.00", "Compared prices without unit price"], ["50c", "Mixed up cents and dollars"], ["75c", "Gave a unit price, not the difference"], ["80c", "Gave a unit price, not the difference"]],
      sol: ["Brand A: 750 g = 7.5 × 100 g → $6.00 ÷ 7.5 = 80c per 100 g", "Brand B: 1.2 kg = 1200 g = 12 × 100 g → $9.00 ÷ 12 = 75c per 100 g", "Difference: 80c − 75c = 5c"] },
    { text: "Ella has only 20c and 50c coins. She has 15 coins altogether, worth $5.10. How many 50c coins does she have?",
      o: [["7"], ["8", "Answered a different part of the question"], ["10", "Calculation slip"], ["5", "Calculation slip"], ["6", "Calculation slip"]],
      sol: ["If all 15 coins were 20c: 15 × 20c = $3.00", "Each swap of a 20c for a 50c adds 30c. We need $5.10 − $3.00 = $2.10 more", "$2.10 ÷ 30c = 7 swaps → 7 fifty-cent coins (and 8 twenty-cent coins: $3.50 + $1.60 = $5.10 ✓)"] },
  ];
  const LETTERS = ["A", "B", "C", "D", "E"];
  const DURATION = 15 * 60;

  const $ = U.$;
  let qs = [], answers = [], flags = new Set(), cur = 0, left = DURATION, startTime = 0, timer = null, running = false;

  function start() {
    qs = BANK.map((q, i) => ({
      n: i, text: q.text, sol: q.sol,
      opts: U.shuffle(q.o.map(([t, trap], j) => ({ t, trap: trap || null, correct: j === 0 }))),
    }));
    answers = new Array(qs.length).fill(null);
    flags = new Set(); cur = 0; left = DURATION; startTime = Date.now(); running = true;
    Speech.locked = true;
    App.lockForExam(true);
    $("examIntro").hidden = true; $("examReport").hidden = true; $("examRun").hidden = false;
    clearInterval(timer);
    timer = setInterval(tick, 1000);
    tick(true); render();
  }

  function tick(first) {
    if (!first) left--;
    const mm = String(Math.floor(Math.max(0, left) / 60)).padStart(2, "0"), ss = String(Math.max(0, left) % 60).padStart(2, "0");
    $("examTimer").textContent = `${mm}:${ss}`;
    $("examTimer").classList.toggle("low", left <= 60);
    if (left <= 0) { U.toast("⏰ Time's up! Your exam has been submitted."); finish(); }
  }

  function render() {
    const q = qs[cur];
    $("examQuestion").innerHTML = `<div class="tag">Question ${cur + 1} of ${qs.length}</div><p>${U.esc(q.text)}</p>`;
    const box = $("examOptions"); box.innerHTML = "";
    q.opts.forEach((o, i) => {
      const b = U.el("button", { class: "option" + (answers[cur] === i ? " selected" : ""), onclick: () => { answers[cur] = answers[cur] === i ? null : i; render(); } },
        `<span class="letter">${LETTERS[i]}</span><span>${U.esc(o.t)}</span>`);
      box.appendChild(b);
    });
    const nav = $("examNav"); nav.innerHTML = "";
    qs.forEach((_, i) => {
      const cls = [answers[i] !== null ? "answered" : "", i === cur ? "current" : "", flags.has(i) ? "flagged" : ""].join(" ");
      nav.appendChild(U.el("button", { class: cls, title: `Question ${i + 1}`, onclick: () => { cur = i; render(); } }, String(i + 1)));
    });
    $("examFlag").textContent = flags.has(cur) ? "🚩 Unflag" : "🚩 Flag for review";
    $("examPrev").disabled = cur === 0;
    $("examNext").textContent = cur === qs.length - 1 ? "Review / submit" : "Next ▶";
  }

  function submit() {
    const blank = answers.filter((a) => a === null).length;
    const fl = flags.size;
    let msg = "Submit your exam now?";
    if (blank) msg = `You have ${blank} unanswered question${blank > 1 ? "s" : ""}. Submit anyway?`;
    else if (fl) msg = `You still have ${fl} flagged question${fl > 1 ? "s" : ""}. Submit anyway?`;
    if (confirm(msg)) finish();
  }

  function finish() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    Speech.locked = false;
    App.lockForExam(false);
    const used = Math.min(DURATION, Math.round((Date.now() - startTime) / 1000));
    report(used);
  }

  function report(used) {
    let score = 0;
    const trapCount = {};
    qs.forEach((q, i) => {
      const a = answers[i];
      if (a !== null && q.opts[a].correct) score++;
      else if (a === null) trapCount["Left blank"] = (trapCount["Left blank"] || 0) + 1;
      else { const t = q.opts[a].trap || "Calculation slip"; trapCount[t] = (trapCount[t] || 0) + 1; }
    });
    const pct = Math.round((score / qs.length) * 100);
    const mm = Math.floor(used / 60), ss = String(used % 60).padStart(2, "0");
    const verdict = pct >= 90 ? "Outstanding, you're OC ready! 🏆" : pct >= 70 ? "Great work! A few traps to tidy up. 💪" : pct >= 50 ? "Good effort! Practise the traps below. 🙂" : "Keep going! Revisit Stages 1 and 2, then try again. 🌱";
    const advice = {
      "Added the percentages": "Take discounts off one at a time. The second % is of the NEW price (Stage 1, Concept 2).",
      "Combined the percentages": "A % up then a % down doesn't cancel out. Work each change on the newest price.",
      "Forgot the delivery fee": "Underline every extra cost (delivery, fees, tax) before you start.",
      "Mixed up cents and dollars": "100c = $1. Convert everything to dollars (or everything to cents) before calculating.",
      "Took both fractions of the starting money": "“Of what was left” means the second fraction is of the remainder. Use a bar model and work backwards.",
      "Stopped halfway when working backwards": "Keep going until you reach the very start. Then check by going forwards.",
      "Stopped after one discount": "Read to the end of the question. There may be a second step.",
      "Ignored the deal": "Group the items to match the deal (e.g. groups of 3 or 4), then count what you actually pay for.",
      "Forgot the leftover items": "After making full deal groups, add the leftover items at full price.",
      "Shared equally": "If one person gets more, take the extra away first, then share the rest equally.",
      "Left blank": "Never leave a question blank. Eliminate options and make your best guess.",
    };
    const trapRows = Object.entries(trapCount).sort((a, b) => b[1] - a[1])
      .map(([t, c]) => `<li><b>${U.esc(t)}</b> × ${c}${advice[t] ? ` — ${U.esc(advice[t])}` : ""}</li>`).join("");
    const reviews = qs.map((q, i) => {
      const a = answers[i], right = a !== null && q.opts[a].correct;
      const ci = q.opts.findIndex((o) => o.correct);
      const yours = a === null ? "No answer" : `${LETTERS[a]} (${U.esc(q.opts[a].t)})`;
      const trap = !right && a !== null && q.opts[a].trap ? `<span class="tag">Trap: ${U.esc(q.opts[a].trap)}</span>` : "";
      const sol = `<ol>${q.sol.map((s) => `<li>${U.esc(s)}</li>`).join("")}</ol>`;
      return `<div class="review ${right ? "right" : "wrong"}">
        <b>Q${i + 1}. ${right ? "✅ Correct" : "❌ " + (a === null ? "Not answered" : "Incorrect")}</b>${flags.has(i) ? ' <span class="tag">🚩 flagged</span>' : ""}${trap}
        <p>${U.esc(q.text)}</p>
        <p>Your answer: <b>${yours}</b> · Correct answer: <b>${LETTERS[ci]} (${U.esc(q.opts[ci].t)})</b></p>
        ${right ? `<details><summary>Show solution</summary>${sol}</details>` : `<b>Step-by-step solution</b>${sol}`}
      </div>`;
    }).join("");
    const r = $("examReport");
    r.innerHTML = `<div class="report">
      <h2>📋 Exam Diagnostic Report</h2>
      <p style="font-size:20px">${verdict}</p>
      <div class="report-stats">
        <div class="stat">Score<b>${score} / ${qs.length}</b></div>
        <div class="stat">Percentage<b>${pct}%</b></div>
        <div class="stat">Time taken<b>${mm}:${ss}</b></div>
        <div class="stat">Flagged<b>${flags.size}</b></div>
      </div>
      <h3>🔍 Trap analysis</h3>
      ${trapRows ? `<ul class="trap-list">${trapRows}</ul>` : "<p>No traps caught you. Brilliant!</p>"}
      <h3>📝 Question review</h3>
      ${reviews}
      <div class="controls"><button class="btn primary" id="examAgain">Try the exam again</button><button class="btn" id="examPractice">Go to guided practice</button></div>
    </div>`;
    $("examRun").hidden = true; r.hidden = false;
    $("examAgain").onclick = start;
    $("examPractice").onclick = () => App.show("practice");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function init() {
    $("startExam").onclick = start;
    $("examPrev").onclick = () => { if (cur > 0) { cur--; render(); } };
    $("examNext").onclick = () => { if (cur < qs.length - 1) { cur++; render(); } else submit(); };
    $("examFlag").onclick = () => { flags.has(cur) ? flags.delete(cur) : flags.add(cur); render(); };
    $("submitExam").onclick = submit;
  }

  return { init, get running() { return running; }, BANK };
})();

/* Stage 3 — Guided practice with a "live tutor".
   Questions are generated randomly per tier. Each one carries:
   - coach sub-steps (validated one at a time),
   - known OC traps (specific wrong answers mapped to targeted feedback). */
const Practice = (() => {
  const m = U.moneyShort, r2 = U.round2;
  const kids = [["Ava", "her"], ["Liam", "his"], ["Mia", "her"], ["Noah", "his"], ["Zoe", "her"], ["Oliver", "his"],
    ["Isla", "her"], ["Jack", "his"], ["Priya", "her"], ["Leo", "his"], ["Chloe", "her"], ["Ethan", "his"]];
  const kid = () => U.pick(kids);
  const step = (q, a, hint, unit = "$") => ({ q, a: r2(a), hint, unit });

  /* ---------------- MILD ---------------- */
  function discount() {
    const P = U.pick([40, 60, 80, 120, 150, 200, 240]), pct = U.pick([10, 20, 25, 50]);
    const thing = U.pick(["pair of sneakers", "school backpack", "scooter", "board game"]);
    const d = r2((P * pct) / 100), sale = r2(P - d);
    return {
      text: `A ${thing} usually costs ${m(P)}. It is on sale for <b>${pct}% off</b>. What is the sale price?`,
      answer: sale,
      steps: [
        step(`What is ${pct}% of ${m(P)}?`, d, `${pct}% means ${pct} out of every 100. Try ${m(P)} × ${pct} ÷ 100.`),
        step(`Take the discount away from ${m(P)}. What is the sale price?`, sale, `${m(P)} − ${m(d)}`),
      ],
      traps: [
        { v: d, type: "Gave the discount, not the price", msg: `${m(d)} is how much you SAVE. The question asks for the sale price, so take it away from ${m(P)}.` },
        { v: P + d, type: "Added the discount", msg: "A discount makes the price smaller, so we subtract it, not add it." },
      ],
    };
  }

  function change() {
    const [name] = kid();
    const p = U.pick([2.35, 1.8, 3.45, 1.25, 2.6, 4.15, 0.95]), n = U.rnd(2, 4);
    const things = U.pick(["ice blocks", "pencils", "juice boxes", "sticker packs"]);
    const tot = r2(p * n), note = tot < 20 ? 20 : 50, ch = r2(note - tot);
    return {
      text: `${name} buys ${n} ${things} at ${m(p)} each and pays with a ${m(note)} note. How much <b>change</b> does ${name} get?`,
      answer: ch,
      steps: [
        step(`What is the total cost of ${n} × ${m(p)}?`, tot, `Multiply ${m(p)} by ${n}, or add it ${n} times.`),
        step(`How much change from a ${m(note)} note?`, ch, `${m(note)} − ${m(tot)}`),
      ],
      traps: [
        { v: tot, type: "Gave the total, not the change", msg: `That's how much the ${things} cost. Change is the money you get back: ${m(note)} take away the total.` },
        { v: r2(note - p), type: "Only counted one item", msg: `You took away the price of just one item, but ${name} bought ${n}!` },
      ],
    };
  }

  function unitCost() {
    const k = U.pick([4, 5, 6, 8]), u = U.pick([1.25, 1.5, 0.75, 2.4, 1.2, 0.6]);
    let n = U.rnd(2, 9); if (n === k) n = k + 1;
    const things = U.pick(["muffins", "apples", "bread rolls", "tennis balls"]);
    const X = r2(k * u), ans = r2(n * u);
    return {
      text: `${k} ${things} cost ${m(X)}. At the same price, how much do <b>${n}</b> ${things} cost?`,
      answer: ans,
      steps: [
        step(`How much does ONE cost? (${m(X)} ÷ ${k})`, u, `Share ${m(X)} equally between ${k}.`),
        step(`So how much do ${n} cost?`, ans, `${n} × ${m(u)}`),
      ],
      traps: [
        { v: u, type: "Stopped at the price of one", msg: `That's the price of ONE. Now multiply by ${n}.` },
        { v: r2(X * n), type: "Used the whole-pack price", msg: `${m(X)} is the price of ${k}, not one. Find the price of one first.` },
      ],
    };
  }

  /* ---------------- MEDIUM ---------------- */
  function seqDiscount() {
    const P = U.pick([80, 120, 160, 200, 240, 300, 400]), d1 = U.pick([20, 25]), d2 = U.pick([10, 20]);
    const thing = U.pick(["jacket", "bike", "tablet", "tent"]);
    const c1 = r2((P * d1) / 100), a1 = r2(P - c1), c2 = r2((a1 * d2) / 100), fin = r2(a1 - c2);
    return {
      text: `A ${thing} costs ${m(P)}. It is reduced by <b>${d1}%</b>, and then a <b>further ${d2}%</b> is taken off the sale price. What is the final price?`,
      answer: fin,
      steps: [
        step(`What is ${d1}% of ${m(P)}?`, c1, `${m(P)} × ${d1} ÷ 100`),
        step("What is the price after the first discount?", a1, `${m(P)} − ${m(c1)}`),
        step(`Now find ${d2}% of the NEW price, ${m(a1)}.`, c2, `${m(a1)} × ${d2} ÷ 100`),
        step("What is the final price?", fin, `${m(a1)} − ${m(c2)}`),
      ],
      traps: [
        { v: r2(P * (1 - (d1 + d2) / 100)), type: "Added the percentages", msg: `Trap! You added ${d1}% and ${d2}% to get ${d1 + d2}%. The second discount comes off the NEW, smaller price, so take them off one at a time.` },
        { v: a1, type: "Stopped after one discount", msg: "That's the price after the first discount only. There's a second discount to take off!" },
        { v: r2(P * (1 - d2 / 100)), type: "Used only the second discount", msg: `You only took off ${d2}%. Start with the ${d1}% discount, then take ${d2}% off the new price.` },
      ],
    };
  }

  function delivery() {
    const [name] = kid();
    const p = U.pick([12, 15, 18, 24, 25, 35]), q = U.rnd(2, 4), d = U.pick([10, 20]), f = U.pick([5, 7.5, 9.95, 12]);
    const things = U.pick(["books", "T-shirts", "puzzles", "water bottles"]);
    const sub = r2(p * q), disc = r2((sub * d) / 100), after = r2(sub - disc), tot = r2(after + f);
    return {
      text: `${name} orders ${q} ${things} online at ${m(p)} each. There is <b>${d}% off the ${things}</b>, and <b>delivery costs ${m(f)}</b>. What is the total cost?`,
      answer: tot,
      steps: [
        step(`What do ${q} ${things} cost before the discount?`, sub, `${q} × ${m(p)}`),
        step(`What is ${d}% of ${m(sub)}?`, disc, `${m(sub)} × ${d} ÷ 100`),
        step("What do the items cost after the discount?", after, `${m(sub)} − ${m(disc)}`),
        step("Now add the delivery fee. What is the total?", tot, `${m(after)} + ${m(f)}`),
      ],
      traps: [
        { v: after, type: "Forgot the delivery fee", msg: "So close! Don't forget the delivery fee. It gets added at the end." },
        { v: r2(sub + f), type: "Forgot the discount", msg: `You added delivery but forgot to take off the ${d}% discount on the ${things}.` },
        { v: r2((sub + f) * (1 - d / 100)), type: "Discounted the delivery too", msg: `The ${d}% discount is only on the ${things}, not on the delivery fee.` },
      ],
    };
  }

  function buy2get1() {
    const [name] = kid();
    const p = U.pick([2.5, 3, 3.5, 4, 1.8, 2.2]), n = U.pick([5, 7, 8, 10, 11]);
    const groups = Math.floor(n / 3), paid = n - groups, cost = r2(paid * p);
    const traps = [{ v: r2(n * p), type: "Ignored the deal", msg: "You paid for every drink. In each group of 3, one drink is free!" }];
    if (n % 3) {
      traps.push({ v: r2(groups * 2 * p), type: "Forgot the leftover items", msg: `You paid for the full groups of 3, but ${name} still needs ${n % 3} more drink${n % 3 > 1 ? "s" : ""} on top.` });
      traps.push({ v: r2((n * p * 2) / 3), type: "Took 1/3 off everything", msg: "The deal only works on full groups of 3. Leftover drinks are full price." });
    }
    return {
      text: `Drinks cost ${m(p)} each. The shop has a <b>“Buy 2, get 1 free”</b> deal. ${name} needs <b>exactly ${n}</b> drinks. How much does ${name} pay?`,
      answer: cost,
      steps: [
        step(`How many full groups of 3 can you make from ${n} drinks?`, groups, `How many 3s fit into ${n}?`, ""),
        step(`One drink in each group is free. How many drinks does ${name} actually pay for?`, paid, `${n} − ${groups}`, ""),
        step(`What does ${name} pay?`, cost, `${paid} × ${m(p)}`),
      ],
      traps,
    };
  }

  /* ---------------- SPICY ---------------- */
  function backwards() {
    const [name, pron] = kid();
    const a = U.pick([3, 4, 5]), b = U.pick([2, 3, 4]), k = U.pick([2, 3, 4, 5, 6]);
    const O = a * b * k, after1 = r2((O * (a - 1)) / a), L = r2(after1 - after1 / b);
    const traps = [{ v: after1, type: "Stopped halfway", msg: "That's how much was left after the book. Keep working backwards one more step!" }];
    const frac = 1 - 1 / a - 1 / b;
    if (frac > 0) traps.push({ v: r2(L / frac), type: "Took both fractions of the starting money", msg: "Careful! The second fraction is of what was LEFT, not of all the starting money. Draw a bar model and work backwards." });
    return {
      text: `${name} spent <b>1/${a}</b> of ${pron} money on a book, then <b>1/${b} of what was left</b> on a movie ticket. ${name} had <b>${m(L)} left</b>. How much money did ${name} start with?`,
      answer: O,
      steps: [
        step(`After the book, ${name} spent 1/${b} of the rest. So ${m(L)} is ${b - 1} out of ${b} equal parts of that rest. How much is ONE part?`, L / (b - 1), `${m(L)} ÷ ${b - 1}`),
        step(`How much did ${name} have just after buying the book? (${b} parts)`, after1, `${b} × ${m(L / (b - 1))}`),
        step(`That amount is ${a - 1} out of ${a} equal parts of the starting money. How much is ONE of those parts?`, O / a, `${m(after1)} ÷ ${a - 1}`),
        step(`How much did ${name} start with? (${a} parts)`, O, `${a} × ${m(O / a)}`),
      ],
      traps,
    };
  }

  function shareDiff() {
    let [n1] = kid(), [n2] = kid();
    while (n2 === n1) [n2] = kid();
    const B = U.rnd(10, 45), D = U.pick([4, 6, 8, 10, 12, 15, 20]), A = B + D, X = A + B;
    const askMore = Math.random() < 0.5, who = askMore ? n1 : n2, ans = askMore ? A : B;
    return {
      text: `${n1} and ${n2} share ${m(X)}. ${n1} gets <b>${m(D)} more</b> than ${n2}. How much does <b>${who}</b> get?`,
      answer: ans,
      steps: [
        step(`Take away ${n1}'s extra ${m(D)} first. How much is left to share equally?`, X - D, `${m(X)} − ${m(D)}`),
        step(`Split that equally between two people. How much is one share (${n2}'s amount)?`, B, `${m(X - D)} ÷ 2`),
        step(`So how much does ${who} get?`, ans, askMore ? `${m(B)} + ${m(D)}` : `It's ${n2}'s share!`),
      ],
      traps: [
        { v: r2(X / 2), type: "Shared equally", msg: `They don't get the same amount: ${n1} gets ${m(D)} more. Take the extra away first, then halve.` },
        { v: askMore ? B : A, type: "Found the other person's share", msg: "That's the other person's share. Re-read who the question asks about!" },
        { v: X - D, type: "Forgot to halve", msg: "Nearly! After taking away the extra, you still need to share that amount between two people." },
        { v: r2(X / 2 + D), type: "Added the difference to half", msg: `If you add ${m(D)} to half the money, the two shares add up to more than ${m(X)}. Take the extra away first, then halve.` },
      ],
    };
  }

  function upDown() {
    const P = U.pick([40, 60, 80, 120, 160, 200]), u = U.pick([10, 20, 25, 50]), d = U.pick([10, 20]);
    const up = r2((P * u) / 100), P1 = r2(P + up), down = r2((P1 * d) / 100), F = r2(P1 - down);
    return {
      text: `A video game costs ${m(P)}. The price goes <b>up by ${u}%</b>. Later, the new price goes <b>down by ${d}%</b>. What is the final price?`,
      answer: F,
      steps: [
        step(`What is ${u}% of ${m(P)}?`, up, `${m(P)} × ${u} ÷ 100`),
        step("What is the new, higher price?", P1, `${m(P)} + ${m(up)}`),
        step(`Now find ${d}% of the NEW price, ${m(P1)}.`, down, `${m(P1)} × ${d} ÷ 100`),
        step("What is the final price?", F, `${m(P1)} − ${m(down)}`),
      ],
      traps: [
        { v: r2(P * (1 + (u - d) / 100)), type: "Combined the percentages", msg: `You can't just do ${u}% − ${d}%. The ${d}% comes off the new, bigger price.` },
        { v: P1, type: "Forgot the price drop", msg: `That's the price after it went up. Now take ${d}% off that new price.` },
        { v: r2(P * (1 - d / 100)), type: "Forgot the price rise", msg: `First the price goes UP by ${u}%. Do that before taking ${d}% off.` },
        { v: P, type: "Assumed it returns to the start", msg: `Going up ${u}% and down ${d}% doesn't always bring you back to ${m(P)}. Work it out step by step.` },
      ],
    };
  }

  const TIERS = {
    mild: { label: "Mild", gens: [discount, change, unitCost] },
    medium: { label: "Medium", gens: [seqDiscount, delivery, buy2get1] },
    spicy: { label: "Spicy", gens: [backwards, shareDiff, upDown] },
  };

  /* ---------------- engine ---------------- */
  const $ = U.$;
  let tier = "mild", prob = null, lastGen = null, attempts = 0, solved = false, coachDone = 0;
  let stats = { solved: 0, streak: 0 }, idleTimer = null, nudged = false;
  const IDLE_MS = 40000;

  const fmtA = (v, unit) => (unit === "$" ? U.money(v) : String(v));
  function speak(t) { if (Speech.isActive()) Speech.say(t.replace(/<[^>]+>/g, ""), { wait: false }); }

  function newProblem() {
    const gens = TIERS[tier].gens;
    let g; do { g = U.pick(gens); } while (gens.length > 1 && g === lastGen);
    lastGen = g;
    prob = g();
    prob.traps = prob.traps.filter((t) => !U.near(t.v, prob.answer));
    attempts = 0; solved = false; coachDone = 0; nudged = false;
    $("practiceText").innerHTML = prob.text;
    $("answerInput").value = ""; $("answerInput").disabled = false;
    $("practiceFeedback").className = "feedback"; $("practiceFeedback").innerHTML = "";
    $("practiceSolution").hidden = true;
    hideNudge(); renderCoach(); updateScore();
    resetIdle();
  }

  function updateScore() {
    $("practiceScore").textContent = `Level: ${TIERS[tier].label} · Solved: ${stats.solved} · Streak: ${stats.streak} 🔥`;
  }

  function feedback(kind, html) {
    const f = $("practiceFeedback");
    f.className = "feedback " + kind; f.innerHTML = html;
  }

  function check(e) {
    e.preventDefault();
    if (!prob || solved) return;
    const v = U.parseAnswer($("answerInput").value);
    resetIdle();
    if (Number.isNaN(v)) { feedback("bad", "Type a number, like <b>12.50</b> (you can leave out the $ sign)."); return; }
    if (U.near(v, prob.answer)) {
      solved = true; stats.solved++; stats.streak++;
      const praise = U.pick(["Ripper! That's correct!", "Spot on, well done!", "Excellent work, detective!", "You nailed it!"]);
      feedback("good", `✅ <b>${praise}</b> The answer is <b>${U.money(prob.answer)}</b>.${attempts === 0 && coachDone === 0 ? " First try, too!" : ""}`);
      speak(praise);
      $("answerInput").disabled = true;
      showSolution(); updateScore(); hideNudge(); clearTimeout(idleTimer);
      return;
    }
    attempts++; stats.streak = 0; updateScore();
    const trap = prob.traps.find((t) => U.near(t.v, v));
    if (trap) {
      feedback("trap", `⚠️ <b>OC trap spotted: ${trap.type}.</b><br>${trap.msg}`);
      speak(trap.msg);
    } else if (U.near(v, prob.answer * 100, 0.5)) {
      const msg = "It looks like you've mixed up cents and dollars. Remember, 100 cents make 1 dollar, so check where your decimal point goes.";
      feedback("trap", `⚠️ <b>OC trap spotted: mixing cents and dollars.</b><br>${msg}`);
      speak(msg);
    } else if (U.near(v * 100, prob.answer, 0.5) || U.near(v * 10, prob.answer, 0.05) || U.near(v, prob.answer * 10, 0.05)) {
      const msg = "Your digits look right, but the decimal point is in the wrong place. Check your place value!";
      feedback("trap", `⚠️ <b>Decimal point slip.</b><br>${msg}`);
      speak(msg);
    } else {
      const msg = attempts === 1 ? "Not quite. Re-read the question and check each step of your working." : "Still not there. Let's break it into smaller steps together.";
      feedback("bad", `❌ ${msg}`);
      speak(msg);
    }
    if (attempts >= 2 && !isCoachOpen()) showNudge("You've had a couple of goes. Want to break down Step 1 together?");
  }

  function showSolution() {
    const s = $("practiceSolution");
    s.innerHTML = `<b>Full solution</b><ol>${prob.steps.map((st) => `<li>${st.q} → <b>${fmtA(st.a, st.unit)}</b></li>`).join("")}</ol><p>Answer: <b>${U.money(prob.answer)}</b></p>`;
    s.hidden = false;
  }

  /* Coach drawer */
  const isCoachOpen = () => $("practiceGrid").classList.contains("coach-open");
  function openCoach() {
    $("practiceGrid").classList.add("coach-open");
    $("coachDrawer").setAttribute("aria-hidden", "false");
    hideNudge(); renderCoach();
    const first = document.querySelector("#coachSteps input:not([disabled])");
    if (first) first.focus();
    if (coachDone < prob.steps.length) speak("Let's do it together. " + prob.steps[coachDone].q);
  }
  function closeCoach() {
    $("practiceGrid").classList.remove("coach-open");
    $("coachDrawer").setAttribute("aria-hidden", "true");
  }

  function renderCoach() {
    const box = $("coachSteps"); box.innerHTML = "";
    if (!prob) return;
    prob.steps.forEach((st, i) => {
      const state = i < coachDone ? "done" : i === coachDone ? "" : "locked";
      const div = U.el("div", { class: "coach-step " + state });
      div.innerHTML = `<div class="coach-q">Step ${i + 1}: ${st.q}</div>`;
      if (i < coachDone) {
        div.innerHTML += `<div class="coach-msg good">${fmtA(st.a, st.unit)}</div>`;
      } else if (i === coachDone) {
        const row = U.el("form", { class: "coach-row" });
        const inp = U.el("input", { inputmode: "decimal", placeholder: st.unit === "$" ? "$" : "number", "aria-label": `Step ${i + 1} answer` });
        const btn = U.el("button", { class: "btn small primary", type: "submit" }, "Check");
        const msg = U.el("div", { class: "coach-msg" });
        let tries = 0;
        row.append(inp, btn);
        row.addEventListener("submit", (e) => {
          e.preventDefault(); resetIdle();
          const v = U.parseAnswer(inp.value);
          if (Number.isNaN(v)) { msg.className = "coach-msg bad"; msg.textContent = "Type a number first."; return; }
          if (U.near(v, st.a)) {
            coachDone++;
            const nextQ = prob.steps[coachDone];
            speak(nextQ ? "Yes! Next: " + nextQ.q : "Brilliant! Now type your final answer in the answer box.");
            renderCoach();
            const nxt = document.querySelector("#coachSteps input:not([disabled])");
            if (nxt) nxt.focus(); else $("answerInput").focus();
            return;
          }
          tries++;
          msg.className = "coach-msg bad";
          if (st.unit === "$" && U.near(v, st.a * 100, 0.5)) msg.textContent = "Careful, that looks like cents, not dollars. 💡 " + st.hint;
          else msg.textContent = (tries >= 2 ? "Here's a hint: " : "Not quite. Hint: ") + st.hint;
          if (tries >= 3) { msg.innerHTML += `<br>The answer to this step is <b>${fmtA(st.a, st.unit)}</b>. Type it in to continue.`; }
          speak(tries >= 2 ? "Here's a hint. " + st.hint : "Not quite. Have another go.");
        });
        div.append(row, msg);
      }
      box.appendChild(div);
    });
    if (coachDone >= prob.steps.length) {
      box.appendChild(U.el("div", { class: "coach-step" }, `<div class="coach-msg good">🎉 All steps done! Your last step is the final answer. Type it in the main answer box and press Check.</div>`));
    }
  }

  /* Stuck detection: inactivity + repeated wrong attempts */
  function resetIdle() {
    clearTimeout(idleTimer);
    if (solved) return;
    idleTimer = setTimeout(() => {
      if (!solved && !isCoachOpen() && !nudged && U.$("view-practice").classList.contains("active")) {
        showNudge("Looks like you might be stuck. Want to break down Step 1 together?");
      }
    }, IDLE_MS);
  }
  function showNudge(t) {
    nudged = true;
    $("nudgeText").textContent = "🧑‍🏫 " + t;
    $("nudge").hidden = false;
    speak(t);
  }
  function hideNudge() { $("nudge").hidden = true; }

  function setTier(t) {
    tier = t;
    document.querySelectorAll("#tierRow .pill").forEach((b) => b.classList.toggle("active", b.dataset.tier === t));
    stats.streak = 0;
    newProblem();
  }

  function init() {
    document.querySelector(".practice-grid").id = "practiceGrid";
    document.querySelectorAll("#tierRow .pill").forEach((b) => (b.onclick = () => setTier(b.dataset.tier)));
    $("answerForm").addEventListener("submit", check);
    $("answerInput").addEventListener("input", resetIdle);
    $("newProblem").onclick = newProblem;
    $("showSolution").onclick = () => { if (prob) showSolution(); };
    $("coachBtn").onclick = openCoach;
    $("closeCoach").onclick = closeCoach;
    $("nudgeYes").onclick = openCoach;
    $("nudgeNo").onclick = () => { hideNudge(); resetIdle(); };
    newProblem();
  }

  function onShow() { resetIdle(); }
  function onHide() { clearTimeout(idleTimer); hideNudge(); }

  return { init, onShow, onHide, TIERS };
})();

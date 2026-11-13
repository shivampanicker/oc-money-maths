/* Stage 2 — Worked examples. Each "Next Step" highlights key words in the question,
   adds to the bar model, says the reasoning aloud and reveals ONE equation. */
const Examples = (() => {
  const { C, text, bar, partsBar, brace, card, tick, cross, shrink } = Board;

  const list = [
    {
      title: "1 · Best way to buy",
      problem: "A shop sells pens for [[a|$1.20 each]] or in a [[b|pack of 5 for $5.40]]. Sam needs [[c|exactly 12 pens]]. What is the [[d|least]] amount he can pay?",
      steps: [
        { hl: ["a", "b"], eq: "$5.40 ÷ 5 = $1.08 per pen in a pack",
          say: "First, compare the price of one pen. A pack is $5.40 for 5 pens, and $5.40 divided by 5 is $1.08 each. That's cheaper than $1.20, so packs are the better deal.",
          draw: (ctx, p) => { card(ctx, 40, 25, 240, 100, "1 pen", "$1.20", C.lightOrange, p); card(ctx, 320, 25, 280, 100, "Pack of 5", "$5.40", C.lightBlue, p * 2 - 0.5); text(ctx, "$5.40 ÷ 5 = $1.08 each", 640, 65, { size: 22, bold: true }, p * 2 - 1); text(ctx, "Packs are cheaper per pen", 640, 98, { size: 18, color: C.green, bold: true }, p * 2 - 1); } },
        { hl: ["c"], eq: "2 packs = 10 pens → 2 × $5.40 = $10.80",
          say: "Sam needs exactly 12 pens. Packs are cheaper, so use as many packs as we can without going over. 2 packs make 10 pens, costing $10.80.",
          draw: (ctx, p) => { for (let i = 0; i < 10; i++) Board.roundRect(ctx, 40 + i * 62, 165, 50, 70, 8, C.lightBlue, C.ink, p * 10 - i); brace(ctx, 40, 338, 245, "pack 1", p); brace(ctx, 350, 648, 245, "pack 2", p); } },
        { hl: ["c"], eq: "2 more pens: 2 × $1.20 = $2.40",
          say: "That leaves 2 more pens, which Sam buys on their own. 2 times $1.20 is $2.40.",
          draw: (ctx, p) => { for (let i = 10; i < 12; i++) Board.roundRect(ctx, 40 + i * 62, 165, 50, 70, 8, C.lightOrange, C.ink, p * 2 - (i - 10)); brace(ctx, 660, 772, 245, "singles", p, C.orange); } },
        { hl: ["d"], eq: "Check: 3 packs (15 pens) = $16.20 ✗ costs more",
          say: "Could a third pack be cheaper? 3 packs cost $16.20, which is more than buying 2 packs and 2 single pens. So we stick with our mix.",
          draw: (ctx, p) => { text(ctx, "3 packs = $16.20 ✗ dearer", 640, 140, { size: 18, color: C.red, bold: true }, p); } },
        { hl: ["d"], eq: "$10.80 + $2.40 = $13.20", final: true,
          say: "Add them together. $10.80 plus $2.40 is $13.20. The least Sam can pay is $13.20.",
          draw: (ctx, p) => { tick(ctx, 805, 205, 36, p); } },
      ],
    },
    {
      title: "2 · Two discounts + delivery",
      problem: "A bike costs [[a|$250]]. It is [[b|20% off]], and then there is a [[c|further 10% off the sale price]]. [[d|Delivery costs $15]]. How much does Mia pay altogether?",
      steps: [
        { hl: ["a", "b"], eq: "20% of $250 = $50 → $250 − $50 = $200",
          say: "Start with the first discount. 20% of $250 is $50. Take that away and the sale price is $200.",
          draw: (ctx, p) => { text(ctx, "Bike $250", 60, 32, { size: 20, bold: true, color: C.grey }, p); shrink(ctx, 60, 70, 600, 600, 480, p, "$200", "−$50", "First: 20% of $250 = $50", 45); } },
        { hl: ["c"], eq: "10% of $200 = $20 → $200 − $20 = $180",
          say: "The second discount is 10% of the sale price, $200, not of $250. 10% of $200 is $20, so the price is now $180.",
          draw: (ctx, p) => shrink(ctx, 60, 160, 600, 480, 432, p, "$180", "−$20", "Then: 10% of the NEW price $200 = $20", 45) },
        { hl: ["d"], eq: "$180 + $15 delivery = $195",
          say: "Don't forget the delivery fee! It's added after the discounts. $180 plus $15 is $195.",
          draw: (ctx, p) => { bar(ctx, 60, 240, 432, 45, C.lightBlue, p, "$180"); bar(ctx, 492, 240, 36, 45, C.lightOrange, p * 2 - 1); text(ctx, "+ $15 delivery = $195", 545, 270, { size: 22, bold: true, color: C.green }, p * 2 - 1); } },
        { hl: ["b", "c"], eq: "Mia pays $195 ✓ (adding 20% + 10% = 30% would give $190 ✗)", final: true,
          say: "Trap check! If you added the percentages to get 30% off, you'd say $190. That's wrong. Mia pays $195.",
          draw: (ctx, p) => { text(ctx, "Adding 20% + 10%", 690, 95, { size: 18, color: C.red, bold: true }, p); text(ctx, "→ $190 ✗", 690, 122, { size: 18, color: C.red, bold: true }, p); tick(ctx, 830, 255, 34, p); } },
      ],
    },
    {
      title: "3 · Working backwards",
      problem: "Leo spent [[a|1/4 of his money]] on a game and then [[b|2/3 of what was left]] on clothes. He had [[c|$15 left]]. How much money did Leo start with?",
      steps: [
        { hl: ["a"], eq: "Leo's money = 4 equal parts; game = 1 part",
          say: "Draw a bar for all of Leo's money and split it into 4 equal parts, because he spent one quarter. One part went on the game.",
          draw: (ctx, p) => { partsBar(ctx, 60, 60, 720, 60, [{ fill: C.lightOrange, label: "game" }, { fill: C.lightBlue }, { fill: C.lightBlue }, { fill: C.lightBlue }], p); brace(ctx, 60, 780, 55, "all of Leo's money = ?", p, C.ink, true); } },
        { hl: ["b"], eq: "2/3 of the 3 parts left = 2 parts on clothes → 1 part left",
          say: "Three parts were left. Two thirds of 3 parts is 2 parts, so 2 parts went on clothes, and 1 part was left over.",
          draw: (ctx, p) => { partsBar(ctx, 240, 60, 540, 60, [{ fill: C.lightPurple, label: "clothes" }, { fill: C.lightPurple, label: "clothes" }, { fill: C.lightGreen, label: "left" }], p); brace(ctx, 240, 780, 125, "what was left after the game", p, C.purple); } },
        { hl: ["c"], eq: "1 part = $15",
          say: "The part that's left is $15. Every part is the same size, so each part is worth $15.",
          draw: (ctx, p) => { partsBar(ctx, 60, 60, 720, 60, [{ fill: C.lightOrange, label: "$15" }, { fill: C.lightPurple, label: "$15" }, { fill: C.lightPurple, label: "$15" }, { fill: C.lightGreen, label: "$15" }], p); text(ctx, "1 part = $15", 60, 215, { size: 22, bold: true }, p); } },
        { hl: [], eq: "4 parts × $15 = $60",
          say: "Leo's whole bar is 4 parts. 4 times $15 is $60. Leo started with $60.",
          draw: (ctx, p) => text(ctx, "4 parts × $15 = $60", 60, 250, { size: 24, bold: true, color: C.green }, p) },
        { hl: [], eq: "Leo started with $60 ✓ (check: $60 − $15 = $45; 2/3 of $45 = $30; $15 left)", final: true,
          say: "Let's check by going forwards. $60 take away $15 for the game leaves $45. Two thirds of $45 is $30 for clothes, leaving $15. Correct!",
          draw: (ctx, p) => text(ctx, "Check: $60 − $15 = $45 → 2/3 of $45 = $30 → $15 left ✓", 60, 285, { size: 18, bold: true, color: C.grey }, p) },
      ],
    },
  ];

  let ctx, cur = 0, idx = -1, run = 0;
  const $ = U.$;

  const markup = (s) => s.replace(/\[\[(\w+)\|([^\]]+)\]\]/g, (_, k, t) => `<span class="k" data-k="${k}">${t}</span>`);

  function draw(upto, p) {
    Board.clear(ctx);
    const steps = list[cur].steps;
    for (let i = 0; i < upto; i++) steps[i].draw(ctx, 1);
    if (upto < steps.length && upto >= 0) steps[upto].draw(ctx, p);
  }

  function animate(i) {
    const my = ++run, t0 = performance.now();
    const frame = (t) => {
      if (my !== run) return;
      const p = Math.min(1, (t - t0) / 1300);
      draw(i, p);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  function select(n) {
    cur = n; idx = -1; run++; Speech.stop();
    $("exampleText").innerHTML = `<b>${list[n].title}</b><br>${markup(list[n].problem)}`;
    $("exampleEqs").innerHTML = "";
    $("exampleSay").innerHTML = "Read the question carefully, then press <b>Next Step</b>.";
    document.querySelectorAll("#exampleTabs .pill").forEach((b, i) => b.classList.toggle("active", i === n));
    draw(-1, 0);
    update();
  }

  function next() {
    const steps = list[cur].steps;
    if (idx >= steps.length - 1) return;
    idx++;
    const st = steps[idx];
    document.querySelectorAll("#exampleText .k").forEach((s) => s.classList.toggle("hl", st.hl.includes(s.dataset.k)));
    $("exampleSay").textContent = "🧑‍🏫 " + st.say;
    const li = U.el("li", { class: st.final ? "final" : "" }, U.esc(st.eq));
    $("exampleEqs").appendChild(li);
    animate(idx);
    Speech.say(st.say, { wait: false });
    update();
  }

  function update() {
    const n = list[cur].steps.length;
    $("exNext").disabled = idx >= n - 1;
    $("exRepeat").disabled = idx < 0;
    $("exampleCount").textContent = idx < 0 ? `${n} steps` : idx >= n - 1 ? `Step ${idx + 1} of ${n} · Solved! 🎉 Try the next example.` : `Step ${idx + 1} of ${n}`;
  }

  function init() {
    ctx = Board.setup($("exampleCanvas"));
    const tabs = $("exampleTabs");
    list.forEach((ex, i) => tabs.appendChild(U.el("button", { class: "pill", onclick: () => select(i) }, ex.title)));
    $("exNext").onclick = next;
    $("exReset").onclick = () => select(cur);
    $("exRepeat").onclick = () => { if (idx >= 0) Speech.say(list[cur].steps[idx].say, { wait: false }); };
    select(0);
  }

  return { init, stop: () => { run++; Speech.stop(); } };
})();

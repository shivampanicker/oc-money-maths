/* Stage 1 — Audio-visual teacher lecture.
   Each slide is a list of steps: { say, draw(ctx, p) }. While the teacher says a step,
   its drawing animates from p=0 to p=1. Earlier steps stay on the board. */
const Lecture = (() => {
  const { C, text, bar, partsBar, line, brace, roundRect, card, tick, cross, ring, item, shrink } = Board;

  const slides = [
    {
      title: "Concept 1 · The “Better Deal” Trap — unit price",
      steps: [
        { say: "G'day everyone! Today we're money detectives. Our first trap is the better deal trap. Which packet of coffee is better value: 500 grams for $4.50, or 1 kilogram for $8.40?",
          draw: (ctx, p) => { card(ctx, 120, 80, 260, 120, "500 g", "$4.50", C.lightOrange, p); card(ctx, 520, 80, 260, 120, "1 kg", "$8.40", C.lightBlue, Math.max(0, p * 2 - 1)); } },
        { say: "The big packet costs more money, but it also has more coffee inside. So we can't just compare the prices.",
          draw: (ctx, p) => text(ctx, "Bigger packet costs more… but it has more inside!", 450, 245, { size: 22, align: "center", color: C.grey, bold: true }, p) },
        { say: "Let's compare the same amount. One kilogram is one thousand grams, so let's find the price of every 100 grams.",
          draw: (ctx, p) => text(ctx, "Compare the SAME amount: price per 100 g", 450, 290, { size: 24, align: "center", color: C.blue, bold: true }, p) },
        { say: "500 grams is 5 lots of 100 grams. $4.50 divided by 5 is 90 cents for every 100 grams.",
          draw: (ctx, p) => { text(ctx, "500 g = 5 × 100 g", 250, 340, { size: 22, align: "center" }, p); text(ctx, "$4.50 ÷ 5 = $0.90", 250, 375, { size: 24, align: "center", bold: true }, p * 1.3 - 0.3); text(ctx, "per 100 g", 250, 405, { size: 20, align: "center", color: C.grey }, p * 2 - 1); } },
        { say: "1 kilogram is 10 lots of 100 grams. $8.40 divided by 10 is 84 cents for every 100 grams.",
          draw: (ctx, p) => { text(ctx, "1 kg = 10 × 100 g", 650, 340, { size: 22, align: "center" }, p); text(ctx, "$8.40 ÷ 10 = $0.84", 650, 375, { size: 24, align: "center", bold: true }, p * 1.3 - 0.3); text(ctx, "per 100 g", 650, 405, { size: 20, align: "center", color: C.grey }, p * 2 - 1); } },
        { say: "84 cents is less than 90 cents, so the 1 kilogram packet is the better deal, even though it costs more!",
          draw: (ctx, p) => { ring(ctx, 650, 140, 165, 82, p, C.green); tick(ctx, 795, 85, 34, p * 1.5 - 0.5); text(ctx, "84c < 90c → the 1 kg packet is the better deal", 450, 448, { size: 22, align: "center", bold: true, color: C.green }, p); } },
      ],
    },
    {
      title: "Concept 1 · “Buy 2 Get 1 Free” deals",
      steps: [
        { say: "Next, the buy 2 get 1 free trap. Shop A sells a drink for $3, buy 2 get 1 free. Shop B sells the same drink for $2.20 each. Which is cheaper per drink?",
          draw: (ctx, p) => { text(ctx, "Shop A: $3 each — Buy 2 Get 1 FREE", 40, 105, { size: 24, bold: true }, p); text(ctx, "Shop B: $2.20 each", 40, 140, { size: 24, bold: true, color: C.purple }, p * 1.5 - 0.5); } },
        { say: "At Shop A you walk out with 3 drinks, but you only pay for 2 of them. That's $6 for 3 drinks.",
          draw: (ctx, p) => { item(ctx, 70, 170, C.lightBlue, "$3", p * 3); item(ctx, 150, 170, C.lightBlue, "$3", p * 3 - 1); item(ctx, 230, 170, C.lightGreen, "FREE", p * 3 - 2); brace(ctx, 70, 290, 270, "3 drinks for $6", p); } },
        { say: "$6 shared between 3 drinks is $2 per drink.",
          draw: (ctx, p) => text(ctx, "$6 ÷ 3 = $2.00 per drink", 380, 220, { size: 30, bold: true }, p) },
        { say: "$2 is less than $2.20, so Shop A is cheaper. But only if you really need 3 drinks!",
          draw: (ctx, p) => { text(ctx, "$2.00 < $2.20 → Shop A is cheaper", 380, 270, { size: 26, bold: true, color: C.green }, p); tick(ctx, 830, 262, 30, p * 1.5 - 0.5); } },
        { say: "Here's my O C tip. Always find the price of one, or the price of the same amount, before you compare deals.",
          draw: (ctx, p) => { roundRect(ctx, 40, 335, 820, 95, 16, "#fff4c2", "#f5c518", p); text(ctx, "OC tip: find the price of ONE (or the same amount) first.", 450, 375, { size: 23, bold: true, align: "center" }, p * 1.4 - 0.2); text(ctx, "Only count the deal if you really need that many!", 450, 410, { size: 20, align: "center", color: C.grey }, p * 1.6 - 0.6); } },
      ],
    },
    {
      title: "Concept 2 · Sequential discounts: 20% off, then 10% off",
      steps: [
        { say: "Here's a sneaky one. A jacket costs $100. It's 20% off, and then there's a further 10% off the sale price. Is that the same as 30% off? Let's find out.",
          draw: (ctx, p) => { text(ctx, "Jacket: $100", 100, 88, { size: 22, bold: true }, p); bar(ctx, 100, 100, 600, 50, C.lightBlue, p, "$100"); } },
        { say: "First, 20% off. 20% of $100 is $20, so the price shrinks to $80.",
          draw: (ctx, p) => shrink(ctx, 100, 190, 600, 600, 480, p, "$80", "−$20", "Step 1: 20% of $100 = $20 → $100 − $20") },
        { say: "Now careful! The second discount is 10% of the new price, $80, not 10% of $100. 10% of $80 is $8.",
          draw: (ctx, p) => shrink(ctx, 100, 290, 600, 480, 432, p, "", "−$8", "Step 2: 10% of the NEW price $80 = $8") },
        { say: "$80 take away $8 is $72. So the jacket finally costs $72.",
          draw: (ctx, p) => { text(ctx, "$72", 100 + 216, 324, { size: 22, bold: true, align: "center" }, p); text(ctx, "= $72", 715, 326, { size: 30, bold: true, color: C.green }, p); } },
        { say: "If we just added the percentages, 30% off would give $70. That's the trap! The real answer is $72, because the second discount comes off a smaller price.",
          draw: (ctx, p) => { text(ctx, "Adding 20% + 10% = 30% off → $70", 100, 395, { size: 22, bold: true, color: C.red }, p); cross(ctx, 470, 375, 22, p * 1.5 - 0.5); text(ctx, "Real answer: $72 — take off one discount at a time", 100, 435, { size: 22, bold: true, color: C.green }, p * 1.5 - 0.5); } },
      ],
    },
    {
      title: "Concept 3 · Working backwards with a bar model",
      steps: [
        { say: "Last concept: working backwards. Mia spent one third of her money on a book. Then she spent half of what was left on lunch. She had $12 left. How much did she start with?",
          draw: (ctx, p) => { text(ctx, "Mia spent 1/3 of her money on a book,", 40, 95, { size: 22 }, p * 3); text(ctx, "then 1/2 of what was left on lunch.", 40, 128, { size: 22 }, p * 3 - 1); text(ctx, "She had $12 left. How much did she start with?", 40, 161, { size: 22, bold: true }, p * 3 - 2); } },
        { say: "Let's draw one long bar for all of Mia's money, and cut it into 3 equal parts. One part is the book.",
          draw: (ctx, p) => { partsBar(ctx, 120, 225, 660, 60, [{ fill: C.lightOrange, label: "book" }, { fill: C.lightBlue }, { fill: C.lightBlue }], p); brace(ctx, 120, 780, 220, "all of Mia's money = ?", p, C.ink, true); } },
        { say: "The other 2 parts are what was left. Half of that went on lunch. So 1 part is lunch, and 1 part is left over.",
          draw: (ctx, p) => { partsBar(ctx, 340, 225, 440, 60, [{ fill: C.lightPurple, label: "lunch" }, { fill: C.lightGreen, label: "left" }], p); brace(ctx, 340, 780, 290, "what was left after the book", p, C.purple); } },
        { say: "The part that's left is $12. All the parts are the same size, so every part is worth $12.",
          draw: (ctx, p) => { partsBar(ctx, 120, 225, 660, 60, [{ fill: C.lightOrange, label: "book $12" }, { fill: C.lightPurple, label: "lunch $12" }, { fill: C.lightGreen, label: "left $12" }], p); text(ctx, "Every part is the same size, so each part = $12", 40, 375, { size: 22 }, p); } },
        { say: "3 parts of $12 is $36. So Mia started with $36!",
          draw: (ctx, p) => text(ctx, "3 parts × $12 = $36 → Mia started with $36", 40, 410, { size: 24, bold: true, color: C.green }, p) },
        { say: "Let's check. One third of $36 is $12 for the book, leaving $24. Half of $24 is $12 for lunch, leaving $12. It works! Always check your answer by going forwards again.",
          draw: (ctx, p) => text(ctx, "Check: $36 − $12 = $24 → half of $24 = $12 lunch → $12 left ✓", 40, 445, { size: 20, color: C.grey, bold: true }, p) },
      ],
    },
  ];

  let ctx, canvas;
  let slide = 0, step = 0, playing = false, run = 0;
  const $ = U.$;

  function render(upto, p) {
    const s = slides[slide];
    Board.clear(ctx);
    text(ctx, s.title, 30, 46, { size: 28, bold: true });
    line(ctx, 30, 58, 870, 58, 1, "#e3e8ef", 2);
    for (let i = 0; i < Math.min(upto, s.steps.length); i++) s.steps[i].draw(ctx, 1);
    if (upto < s.steps.length && p > 0) s.steps[upto].draw(ctx, p);
  }

  function animate(idx, ms, myRun) {
    return new Promise((resolve) => {
      const t0 = performance.now();
      const frame = (t) => {
        if (myRun !== run) return resolve(false);
        const p = Math.min(1, (t - t0) / ms);
        render(idx, p);
        if (p < 1) requestAnimationFrame(frame); else resolve(true);
      };
      requestAnimationFrame(frame);
    });
  }

  function caption(txt) { $("lectureCaption").textContent = txt; }

  async function play() {
    if (playing) return;
    playing = true; updateButtons();
    const myRun = ++run;
    const s = slides[slide];
    if (step >= s.steps.length) step = 0;
    while (step < s.steps.length) {
      const st = s.steps[step];
      caption(st.say); updateButtons();
      const [, sp] = await Promise.all([animate(step, 1600, myRun), Speech.say(st.say)]);
      if (myRun !== run || sp.cancelled) return;
      step++;
      await new Promise((r) => setTimeout(r, 450));
      if (myRun !== run) return;
    }
    playing = false;
    finish();
  }

  function finish() {
    step = slides[slide].steps.length;
    render(step, 1); updateButtons();
    caption(slide < slides.length - 1 ? "✅ Slide finished! Press “Next slide ⏭” to keep going, or “Replay slide” to watch again." : "🎉 Lesson complete! Head to Stage 2 · Worked Examples to see these ideas in real OC problems.");
  }

  /* Rewind / forward one narration step. Crosses into the previous/next slide at the edges.
     Keeps playing if it was playing; otherwise just shows that step (press Play to hear it). */
  function seek(delta) {
    const wasPlaying = playing;
    run++; playing = false; Speech.stop();
    let s = slides[slide];
    let target = Math.min(step, s.steps.length) + delta;
    if (target < 0) {
      if (slide === 0) target = 0;
      else { slide--; s = slides[slide]; target = s.steps.length - 1; renderDots(); }
    } else if (target >= s.steps.length) {
      if (slide === slides.length - 1) { finish(); return; }
      slide++; s = slides[slide]; target = 0; renderDots();
    }
    step = target;
    if (wasPlaying) { play(); return; }
    render(step, 1);
    caption(s.steps[step].say);
    updateButtons();
  }

  function pause() {
    if (!playing) return;
    run++; playing = false; Speech.stop();
    render(step, 1); // show the current step finished so the board makes sense
    caption("⏸ Paused. Press ▶ Play to continue from this step.");
    updateButtons();
  }

  function goto(n, autoplay = true) {
    run++; playing = false; Speech.stop();
    slide = Math.max(0, Math.min(slides.length - 1, n)); step = 0;
    render(0, 0); renderDots(); updateButtons();
    caption("Press ▶ Play to start this slide.");
    if (autoplay) play();
  }

  function replay() { goto(slide, true); }

  function renderDots() {
    const d = $("lectureDots"); d.innerHTML = "";
    slides.forEach((_, i) => {
      const b = U.el("button", { class: i === slide ? "active" : "", title: slides[i].title, onclick: () => goto(i) }, String(i + 1));
      d.appendChild(b);
    });
  }

  function updateButtons() {
    const n = slides[slide].steps.length;
    $("lecPlay").disabled = playing;
    $("lecPause").disabled = !playing;
    $("lecPrev").disabled = slide === 0;
    $("lecNext").disabled = slide === slides.length - 1;
    $("lecBack").disabled = slide === 0 && step === 0;
    $("lecFwd").disabled = slide === slides.length - 1 && step >= n;
    $("lecStep").textContent = `Slide ${slide + 1}/${slides.length} · ` + (step >= n ? "finished" : `Step ${step + 1}/${n}`);
  }

  function init() {
    canvas = $("lectureCanvas");
    ctx = Board.setup(canvas);
    $("lecPlay").onclick = play;
    $("lecPause").onclick = pause;
    $("lecReplay").onclick = replay;
    $("lecNext").onclick = () => goto(slide + 1);
    $("lecPrev").onclick = () => goto(slide - 1);
    $("lecBack").onclick = () => seek(-1);
    $("lecFwd").onclick = () => seek(1);
    // Keyboard: ← rewind, → forward, Space play/pause (only on the Classroom tab, not while typing)
    document.addEventListener("keydown", (e) => {
      if (!$("view-lecture").classList.contains("active") || /INPUT|TEXTAREA|BUTTON/.test(document.activeElement.tagName) && e.key === " ") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); seek(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); seek(1); }
      else if (e.key === " ") { e.preventDefault(); playing ? pause() : play(); }
    });
    goto(0, false);
  }

  return { init, pause, slides };
})();

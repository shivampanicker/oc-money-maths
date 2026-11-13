# OC Money Masters

An interactive, zero-dependency web app that teaches Year 4–5 students the money questions in the NSW Opportunity Class (OC) Mathematical Reasoning test.

## Run it

```bash
cd ~/oc-money-maths
python3 -m http.server 8001
# then open http://localhost:8001
```

Or use `npx serve -l 8001`. You can use port 8000 if nothing else is running on it.

## The four stages

| Stage | What it does |
|---|---|
| 1 · Classroom | Animated canvas whiteboard with spoken narration (Web Speech API, prefers an en-AU voice) and synced captions. Play / Pause / Replay / Next. Covers unit price and "Buy X get Y free", sequential discounts (20% + 10% ≠ 30%) and working backwards with bar models. |
| 2 · Worked Examples | 3 multi-step problems. Each "Next Step" highlights key words, adds to the bar model, explains aloud and reveals one equation at a time. |
| 3 · Guided Practice | Random questions in 3 tiers (Mild / Medium / Spicy, 9 question types). Nudges after 40 s of inactivity or 2 wrong tries. A "Coach Me" drawer checks each sub-step. Catches specific traps: added percentages, forgot delivery, cents vs dollars, stopped halfway, shared equally, and more. |
| 4 · Mock Exam | 10 questions, 15-minute timer, options A–E, hints and voice turned off, flag for review. Ends with a diagnostic report: score, time, trap analysis and step-by-step solutions for anything missed. |

## Files

```
index.html        page layout for all four stages
styles.css        styling (no web fonts or CDNs)
js/util.js        $AUD formatting, answer parsing, helpers
js/speech.js      Web Speech wrapper (en-AU → en-GB → en fallback)
js/board.js       canvas drawing helpers (bars, braces, ticks, shrinking bars)
js/lecture.js     Stage 1 slides and narration
js/examples.js    Stage 2 worked examples
js/practice.js    Stage 3 question generators, traps, coach, nudges
js/exam.js        Stage 4 question bank, timer, report
js/app.js         navigation, voice toggle, exam lock-down
```

Voice quality depends on the browser and OS. Chrome and Safari on macOS include "Karen (en-AU)". If no voice is available, the lesson still runs with captions.

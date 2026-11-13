/* Whiteboard drawing helpers for HTML5 Canvas. Every helper takes a progress value p (0→1)
   so the same function can draw a shape "being drawn" or fully finished. */
const Board = (() => {
  const C = {
    ink: "#1d3557", blue: "#2a6fdb", lightBlue: "#cfe0fb", green: "#2e9e5b", lightGreen: "#d5f0df",
    red: "#d64545", lightRed: "#f8d4d4", orange: "#f08c2b", lightOrange: "#fde3c8",
    purple: "#7b4fc9", lightPurple: "#e5dbf7", grey: "#8a96a3", paper: "#ffffff",
  };
  const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';

  function setup(canvas) {
    const w = +canvas.getAttribute("width"), h = +canvas.getAttribute("height");
    canvas.dataset.w = canvas.dataset.w || w;
    canvas.dataset.h = canvas.dataset.h || h;
    const lw = +canvas.dataset.w, lh = +canvas.dataset.h;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = lw * dpr; canvas.height = lh * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.W = lw; ctx.H = lh;
    return ctx;
  }

  function clear(ctx) {
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, ctx.W, ctx.H);
    // faint grid like a classroom whiteboard
    ctx.strokeStyle = "#f0f3f7"; ctx.lineWidth = 1;
    for (let x = 0; x < ctx.W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ctx.H); ctx.stroke(); }
    for (let y = 0; y < ctx.H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ctx.W, y); ctx.stroke(); }
  }

  const ease = (p) => (p < 0 ? 0 : p > 1 ? 1 : 1 - Math.pow(1 - p, 3));

  // Text "written" left to right as p grows.
  function text(ctx, str, x, y, opt = {}, p = 1) {
    if (p <= 0) return;
    const { size = 24, color = C.ink, bold = false, align = "left", base = "alphabetic" } = opt;
    ctx.font = `${bold ? "bold " : ""}${size}px ${FONT}`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
    const n = Math.ceil(str.length * Math.min(1, p));
    ctx.fillText(str.slice(0, n), x, y);
  }

  // Filled bar that grows from the left.
  function bar(ctx, x, y, w, h, fill, p = 1, label = "", opt = {}) {
    const e = ease(p);
    if (e <= 0) return;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w * e, h);
    ctx.strokeStyle = opt.stroke || C.ink; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w * e, h);
    if (label && e > 0.6) text(ctx, label, x + w / 2, y + h / 2, { size: opt.size || 20, bold: true, align: "center", base: "middle", color: opt.color || C.ink });
  }

  // Bar split into equal parts. parts = [{fill, label}], drawn one after another.
  function partsBar(ctx, x, y, w, h, parts, p = 1, opt = {}) {
    const n = parts.length, pw = w / n;
    parts.forEach((part, i) => {
      const local = Math.min(1, Math.max(0, p * n - i));
      bar(ctx, x + i * pw, y, pw, h, part.fill || C.lightBlue, local, part.label || "", opt);
    });
  }

  function line(ctx, x1, y1, x2, y2, p = 1, color = C.ink, width = 3, dash = null) {
    const e = ease(p);
    if (e <= 0) return;
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.setLineDash(dash || []);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + (x2 - x1) * e, y1 + (y2 - y1) * e); ctx.stroke();
    ctx.setLineDash([]);
  }

  function arrow(ctx, x1, y1, x2, y2, p = 1, color = C.ink) {
    line(ctx, x1, y1, x2, y2, p, color, 3);
    if (ease(p) < 0.98) return;
    const a = Math.atan2(y2 - y1, x2 - x1), s = 12;
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - s * Math.cos(a - 0.4), y2 - s * Math.sin(a - 0.4));
    ctx.lineTo(x2 - s * Math.cos(a + 0.4), y2 - s * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }

  // Horizontal brace under/over a span with a label.
  function brace(ctx, x1, x2, y, label, p = 1, color = C.ink, up = false) {
    const d = up ? -12 : 12;
    line(ctx, x1, y, x1, y + d, p, color, 2);
    line(ctx, x1, y + d, x2, y + d, p, color, 2);
    line(ctx, x2, y + d, x2, y, p, color, 2);
    if (label) text(ctx, label, (x1 + x2) / 2, y + d + (up ? -10 : 26), { size: 20, bold: true, align: "center", color }, p);
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke, p = 1) {
    const e = ease(p);
    if (e <= 0) return;
    ctx.globalAlpha = e;
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  // Price tag / packet card.
  function card(ctx, x, y, w, h, title, sub, fill, p = 1) {
    roundRect(ctx, x, y, w, h, 14, fill, C.ink, p);
    if (ease(p) > 0.5) {
      text(ctx, title, x + w / 2, y + h * 0.42, { size: 26, bold: true, align: "center" });
      text(ctx, sub, x + w / 2, y + h * 0.78, { size: 22, align: "center", color: C.blue, bold: true });
    }
  }

  function tick(ctx, x, y, s = 30, p = 1, color = C.green) {
    const e = ease(p);
    if (e <= 0) return;
    ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x, y);
    const mid = [x + s * 0.35, y + s * 0.4], end = [x + s, y - s * 0.5];
    if (e < 0.4) ctx.lineTo(x + (mid[0] - x) * (e / 0.4), y + (mid[1] - y) * (e / 0.4));
    else { ctx.lineTo(mid[0], mid[1]); const f = (e - 0.4) / 0.6; ctx.lineTo(mid[0] + (end[0] - mid[0]) * f, mid[1] + (end[1] - mid[1]) * f); }
    ctx.stroke(); ctx.lineCap = "butt";
  }

  function cross(ctx, x, y, s = 26, p = 1, color = C.red) {
    const e = ease(p);
    line(ctx, x, y, x + s, y + s, Math.min(1, e * 2), color, 6);
    line(ctx, x + s, y, x, y + s, Math.max(0, e * 2 - 1), color, 6);
  }

  // Circle highlight around something.
  function ring(ctx, cx, cy, rx, ry, p = 1, color = C.green) {
    const e = ease(p);
    if (e <= 0) return;
    ctx.strokeStyle = color; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * e); ctx.stroke();
  }

  // Simple drink can / item icon.
  function item(ctx, x, y, fill, label, p = 1) {
    roundRect(ctx, x, y, 60, 90, 10, fill, C.ink, p);
    if (label && ease(p) > 0.6) text(ctx, label, x + 30, y + 52, { size: 16, bold: true, align: "center" });
  }

  // Animated "shrinking bar" used for discounts: a bar of width `from` shrinks to `to`.
  function shrink(ctx, x, y, full, from, to, p, keepLabel, cutLabel, caption, h = 50) {
    const e = ease(p);
    if (caption) text(ctx, caption, x, y - 12, { size: 20, bold: true }, p * 2);
    ctx.setLineDash([6, 6]); ctx.strokeStyle = C.grey; ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, full, h); ctx.setLineDash([]);
    const w = from - (from - to) * e;
    ctx.fillStyle = C.lightBlue; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    if (e > 0.05) {
      ctx.fillStyle = C.lightRed; ctx.fillRect(x + w, y, from - w, h);
      ctx.strokeStyle = C.red; ctx.strokeRect(x + w, y, from - w, h);
    }
    if (e > 0.85) {
      text(ctx, cutLabel, x + (to + from) / 2, y + h / 2, { size: 18, bold: true, align: "center", base: "middle", color: C.red });
      if (keepLabel) text(ctx, keepLabel, x + to / 2, y + h / 2, { size: 22, bold: true, align: "center", base: "middle" });
    }
  }

  return { C, setup, clear, text, bar, partsBar, line, arrow, brace, roundRect, card, tick, cross, ring, item, ease, shrink };
})();

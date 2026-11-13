/* App shell: tab navigation, voice toggle, exam lock-down. */
const App = (() => {
  const $ = U.$;
  let current = "home";

  function show(view) {
    if (Exam.running && view !== "exam") { U.toast("Finish or submit the exam first! ⏱"); return; }
    if (current === "lecture" && view !== "lecture") Lecture.pause();
    if (current === "examples" && view !== "examples") Examples.stop();
    if (current === "practice" && view !== "practice") Practice.onHide();
    current = view;
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    if (view === "practice") Practice.onShow();
    window.scrollTo({ top: 0 });
  }

  function renderVoice() {
    const b = $("voiceToggle");
    if (!Speech.supported) { b.textContent = "🔇 No voice in this browser"; b.disabled = true; return; }
    if (Speech.locked) { b.textContent = "🔇 Voice off (exam)"; b.disabled = true; b.classList.add("off"); return; }
    b.disabled = false;
    b.textContent = Speech.enabled ? "🔊 Voice on" : "🔇 Voice off";
    b.classList.toggle("off", !Speech.enabled);
  }

  function lockForExam(on) {
    document.querySelectorAll("#tabs button").forEach((b) => (b.disabled = on && b.dataset.view !== "exam"));
    renderVoice();
  }

  function init() {
    document.querySelectorAll("#tabs button").forEach((b) => (b.onclick = () => show(b.dataset.view)));
    document.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => show(b.dataset.go)));
    $("voiceToggle").onclick = () => { Speech.enabled = !Speech.enabled; renderVoice(); };
    window.addEventListener("beforeunload", (e) => { if (Exam.running) { e.preventDefault(); e.returnValue = ""; } });
    Lecture.init(); Examples.init(); Practice.init(); Exam.init();
    renderVoice();
  }

  return { init, show, lockForExam };
})();

document.addEventListener("DOMContentLoaded", App.init);

// Offline support (only on https or localhost, where browsers allow service workers).
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

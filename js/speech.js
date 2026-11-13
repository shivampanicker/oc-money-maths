/* Teacher voice using the browser's built-in Web Speech API (no keys, no audio files).
   Prefers an Australian English (en-AU) voice, then en-GB, then any English voice. */
const Speech = (() => {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let enabled = true;   // user toggle
  let locked = false;   // exam mode: voice forced off
  let voice = null;
  let pending = null;   // { resolve, timer }

  function chooseVoice() {
    if (!supported) return;
    const vs = window.speechSynthesis.getVoices();
    voice =
      vs.find((v) => /^en[-_]AU$/i.test(v.lang)) ||
      vs.find((v) => /^en[-_]GB$/i.test(v.lang)) ||
      vs.find((v) => /^en/i.test(v.lang)) || null;
  }
  if (supported) {
    chooseVoice();
    window.speechSynthesis.onvoiceschanged = chooseVoice;
  }

  // Make symbols sound natural when read aloud.
  function forSpeech(text) {
    return text
      .replace(/×/g, " times ")
      .replace(/÷/g, " divided by ")
      .replace(/−/g, " minus ")
      .replace(/=/g, " equals ")
      .replace(/(\d)\s*g\b/g, "$1 grams")
      .replace(/(\d)\s*kg\b/g, "$1 kilograms")
      .replace(/\bOC\b/g, "O C");
  }

  // Rough reading time so captions stay up long enough when the voice is off.
  const readMs = (text) => Math.max(2200, text.split(/\s+/).length * 330);

  const isActive = () => supported && enabled && !locked;

  function settle(cancelled) {
    if (!pending) return;
    const p = pending; pending = null;
    clearTimeout(p.timer);
    p.resolve({ cancelled });
  }

  function stop() {
    if (supported) window.speechSynthesis.cancel();
    settle(true);
  }

  /* say(text) → Promise<{cancelled}>. Resolves when speech ends, or after a reading
     delay if voice is off/unsupported. A safety timer covers browsers that never fire onend. */
  function say(text, { wait = true } = {}) {
    stop();
    return new Promise((resolve) => {
      const est = readMs(text);
      pending = { resolve, timer: null };
      if (!isActive()) {
        pending.timer = setTimeout(() => settle(false), wait ? est : 0);
        return;
      }
      const u = new SpeechSynthesisUtterance(forSpeech(text));
      u.lang = voice ? voice.lang : "en-AU";
      if (voice) u.voice = voice;
      u.rate = 0.95;
      u.pitch = 1.05;
      const mine = pending;
      u.onend = () => { if (pending === mine) settle(false); };
      u.onerror = () => { if (pending === mine) settle(false); };
      pending.timer = setTimeout(() => { if (pending === mine) settle(false); }, est * 2.2 + 4000);
      window.speechSynthesis.speak(u);
    });
  }

  return {
    say, stop, isActive,
    get supported() { return supported; },
    get enabled() { return enabled; },
    set enabled(v) { enabled = !!v; if (!enabled) stop(); },
    get locked() { return locked; },
    set locked(v) { locked = !!v; if (locked) stop(); },
    voiceName: () => (voice ? `${voice.name} (${voice.lang})` : "default voice"),
  };
})();

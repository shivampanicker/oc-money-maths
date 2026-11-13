/* Offline support: cache every app file on first visit, then serve from cache.
   Bump VERSION whenever you change any file so iPads pick up the update. */
const VERSION = "oc-money-v1";
const FILES = [
  "./", "./index.html", "./styles.css", "./manifest.webmanifest",
  "./js/util.js", "./js/speech.js", "./js/board.js", "./js/lecture.js",
  "./js/examples.js", "./js/practice.js", "./js/exam.js", "./js/app.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache first (works offline); refresh the cache in the background when online.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      const net = fetch(e.request).then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});

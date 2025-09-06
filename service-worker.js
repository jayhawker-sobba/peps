// Minimal, safe SW: no manifest, no icons; only caches the shell.
// Bump version when you change files to force update.
const CACHE = 'peptide-logger-v7';
const ASSETS = [
  './',
  './index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .catch(() => self.skipWaiting()) // don’t fail install if addAll hiccups
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    )
  );
});

// Cache-first for same-origin requests; network for cross-origin (Apps Script)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
  } else {
    // For API calls to script.googleusercontent.com: always go to network
    return; // default: pass-through to network
  }
});

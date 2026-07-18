const CACHE = "apps-launcher-v2";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./apps.js",
    "./manifest.json",
    "./app-icons/app-icon-192.png",
    "./app-icons/app-icon-512.png"
    "./fonts/ChiKareGo2.ttf"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

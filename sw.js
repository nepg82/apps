const CACHE = "apps-launcher-v2.0.11";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./apps.js",
    "./manifest.json",
    "./app-icons/app-icon-192.png",
    "./app-icons/app-icon-512.png",
    "./fonts/ChiKareGo2.ttf",
    "./fonts/geneva-9-1.ttf",
    "./matrix.html"
];

self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE).then(async cache => {
            // Cache each file individually so one failure doesn't break everything
            const results = await Promise.allSettled(
                FILES.map(url => cache.add(url))
            );
            results.forEach((r, i) => {
                if (r.status === "rejected") {
                    console.error("SW: failed to cache", FILES[i], r.reason);
                }
            });
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys =>
                Promise.all(
                    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(cached => {
            if (cached) return cached;
            return fetch(event.request).catch(() => {
                // Offline fallback for page navigations
                if (event.request.mode === "navigate") {
                    return caches.match("./index.html");
                }
                return Response.error();
            });
        })
    );
});
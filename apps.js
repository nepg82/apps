const apps = [
    // KEY REQUIRED
    {
        url: "https://nepg82.github.io/biker-church/",
        access: "key"
    },
    {
        url: "https://nepg82.github.io/FitMac/",
        access: "key"
    },
    {
        url: "https://nepg82.github.io/FutureHaven/",
        access: "key"
    },
    {
        url: "https://nepg82.github.io/garagelog/",
        access: "key"
    },
    {
        url: "https://nepg82.github.io/Magazine/",
        access: "key"
    },
    {
        url: "https://nepg82.github.io/OurMovies/",
        access: "key"
    },

    // PUBLIC ACCESS
    {
        url: "https://nepg82.github.io/chillforge/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/countdown-timer-HTML/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/clock/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/IronLog/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/Just-The-Tip/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/OWPOC/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/Putt-Pad/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/StopWatch/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/Thruway-Rest-Area-Helper/",
        access: "public"
    },
    {
        url: "https://nepg82.github.io/Weather-or-Not-HTML/",
        access: "public"
    }
];

const grid = document.getElementById("appGrid");

let currentAccess = null;

apps.forEach(app => {

    if (app.access !== currentAccess) {
        currentAccess = app.access;

        const section = document.createElement("div");
        section.className = "appSection";
        section.innerHTML = `
            <span>${app.access === "key" ? "Key Required" : "Public Access"}</span>
        `;

        grid.appendChild(section);
    }

    // Fallback title derived synchronously so the card can render immediately.
    const fallbackTitle = app.url
        .replace("https://nepg82.github.io/", "")
        .replace("/", "");

    const card = document.createElement("a");

    card.className = "appCard";
    card.href = app.url;

    card.innerHTML = `
        <img src="${app.url}app-icons/app-icon-192.png" alt="${fallbackTitle}">
        <h2>${fallbackTitle}</h2>
        <!-- <p>${app.description}</p> -->
    `;

    // Appended in array order right away, so grid position never shifts.
    grid.appendChild(card);

    const titleEl = card.querySelector("h2");
    const imgEl = card.querySelector("img");

    fetch(app.url + "manifest.json")
        .then(response => response.json())
        .then(manifest => {
            const title = manifest.name || manifest.short_name || fallbackTitle;
            titleEl.textContent = title;
            imgEl.alt = title;
        })
        .catch(() => {
            // Fallback title already in place; nothing more to do.
        });

});


const refreshTrigger = document.getElementById("refreshTrigger");

let copyrightTaps = 0;
let copyrightTapTimer = null;

refreshTrigger.addEventListener("click", () => {
    copyrightTaps++;

    clearTimeout(copyrightTapTimer);

    copyrightTapTimer = setTimeout(() => {
        if (copyrightTaps === 1) {
            forceRefresh();
        }

        copyrightTaps = 0;
    }, 500);

    if (copyrightTaps === 3) {
        copyrightTaps = 0;
        window.location.href = "matrix.html";
    }
});


async function forceRefresh() {
    // 1. Unregister all Service Workers
    if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
        }
    }

    // 2. Clear Cache Storage API
    if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    // 3. Force-fetch key assets from network to override HTTP disk cache
    try {
        await Promise.all([
            fetch("index.html", { cache: "reload" }),
            fetch("style.css", { cache: "reload" }),
            fetch("apps.js", { cache: "reload" })
        ]);
    } catch (err) {
        console.error("Failed to re-fetch assets:", err);
    }

    // 4. Redirect with a cache-busting timestamp parameter to force a clean load
    window.location.href = window.location.pathname + "?reload=" + Date.now();
}
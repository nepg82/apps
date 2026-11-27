const apps = [
    // KEY REQUIRED
    {
        url: "https://nepg82.github.io/biker-church/",
        access: "key"
        alt: { label: "Open Admin", url: "https://nepg82.github.io/biker-church/admin.html" }
    },
    {
        url: "https://nepg82.github.io/FitMac/",
        access: "key"
        alt: { label: "Open Tablet/Gym Mode", url: "https://nepg82.github.io/FitMac/tablet" }
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
    {
        url: "https://nepg82.github.io/dmnapto/",
        access: "key"
    },
    {
        url: "https://nepg82.github.io/tfp/",
        access: "key"
    },
    // PUBLIC ACCESS
    {
        url: "https://nepg82.github.io/betty/",
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
        url: "https://nepg82.github.io/drivemusicplayer/",
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
    },
    /// MUSIC GENERATORS
    {
        url: "https://nepg82.github.io/chillforge/",
        access: "music"
    },
    {
        url: "https://nepg82.github.io/chillradio/",
        access: "music"
        alt: { label: "Open Deck", url: "https://nepg82.github.io/chillradio/deck" }
    },
    {
        url: "https://nepg82.github.io/pulseforge/",
        access: "music"
    },
    {
        url: "https://nepg82.github.io/synthradio/",
        access: "music"
    }
];

const grid = document.getElementById("appGrid");

let currentAccess = null;

apps.forEach(app => {

    if (app.access !== currentAccess) {
	    currentAccess = app.access;

	    const sectionNames = {
	        key: "Key Required",
	        public: "Public Access",
	        music: "Music Generators"
	    };

	    const section = document.createElement("div");
	    section.className = "appSection";
	    section.innerHTML = `
	        <span>${sectionNames[app.access]}</span>
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

    // Optional long-press menu (only if the app defines `alt`)
    if (app.alt) attachLongPress(card, app);

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


// ---------- Long-press menu ----------
// To add one to an app, give it an `alt` property:
//   { url: "...", access: "public", alt: { label: "Open Settings", url: "https://..." } }
// Or several options:
//   alt: [ { label: "Admin", url: "..." }, { label: "Docs", url: "..." } ]

const LONG_PRESS_MS = 500;
const MOVE_TOLERANCE = 10; // px of finger movement before the press is cancelled

const menuStyle = document.createElement("style");
menuStyle.textContent = `
    .appCard.hasAlt { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    .lpBackdrop {
        position: fixed; inset: 0; z-index: 1000;
        background: rgba(0,0,0,0.5);
        display: flex; align-items: flex-end; justify-content: center;
        padding: 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    }
    .lpSheet {
        width: 100%; max-width: 420px;
        display: flex; flex-direction: column; gap: 8px;
    }
    .lpTitle { color: #aaa; text-align: center; font: 600 14px system-ui, sans-serif; padding: 4px; }
    .lpSheet a, .lpSheet button {
        display: block; box-sizing: border-box; width: 100%;
        padding: 14px; border: 0; border-radius: 12px;
        background: #2a2a2a; color: #fff; text-align: center;
        font: 500 17px system-ui, sans-serif; text-decoration: none; cursor: pointer;
    }
    .lpSheet button.lpCancel { background: #1a1a1a; color: #ccc; }
`;
document.head.appendChild(menuStyle);

function attachLongPress(card, app) {
    card.classList.add("hasAlt");

    let timer = null;
    let startX = 0, startY = 0;
    let longPressed = false;

    const cancel = () => { clearTimeout(timer); timer = null; };

    card.addEventListener("pointerdown", e => {
        longPressed = false;
        startX = e.clientX;
        startY = e.clientY;
        cancel();
        timer = setTimeout(() => {
            longPressed = true;
            if (navigator.vibrate) navigator.vibrate(15);
            showAppMenu(card, app);
        }, LONG_PRESS_MS);
    });

    card.addEventListener("pointermove", e => {
        if (timer && Math.hypot(e.clientX - startX, e.clientY - startY) > MOVE_TOLERANCE) cancel();
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(type =>
        card.addEventListener(type, cancel)
    );

    // Block the browser's own link menu, and the normal tap that follows a long press
    card.addEventListener("contextmenu", e => e.preventDefault());
    card.addEventListener("click", e => {
        if (longPressed) {
            e.preventDefault();
            longPressed = false;
        }
    });
}

function showAppMenu(card, app) {
    const title = card.querySelector("h2").textContent;
    const options = Array.isArray(app.alt) ? app.alt : [app.alt];

    const backdrop = document.createElement("div");
    backdrop.className = "lpBackdrop";

    const sheet = document.createElement("div");
    sheet.className = "lpSheet";

    const heading = document.createElement("div");
    heading.className = "lpTitle";
    heading.textContent = title;
    sheet.appendChild(heading);

    const addLink = (label, url) => {
        const a = document.createElement("a");
        a.href = url;
        a.textContent = label;
        sheet.appendChild(a);
    };

    addLink("Open " + title, app.url);
    options.forEach(opt => addLink(opt.label, opt.url));

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "lpCancel";
    cancelBtn.textContent = "Cancel";
    sheet.appendChild(cancelBtn);

    backdrop.appendChild(sheet);
    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    cancelBtn.addEventListener("click", close);
    // Tap outside the sheet to dismiss (ignore the finger-lift from the long press itself)
    backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });
}


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
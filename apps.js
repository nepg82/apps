const apps = [
    {
        url: "https://nepg82.github.io/biker-church/",
        description: "Biker church app"
    },
    {
        url: "https://nepg82.github.io/countdown-timer-HTML/",
        description: "Simple countdown timer"
    },
    {
        url: "https://nepg82.github.io/FitMac/",
        description: "Fitness/Macros Tracker"
    },
    {
        url: "https://nepg82.github.io/garagelog/",
        description: "GarageLog"
    },
    {
        url: "https://nepg82.github.io/Just-The-Tip/",
        description: "Basic tip calculator"
    },
    {
        url: "https://nepg82.github.io/Magazine/",
        description: "Ammunition tracker"
    },
    {
        url: "https://nepg82.github.io/Putt-Pad/",
        description: "Golf score card"
    },
    {
        url: "https://nepg82.github.io/StopWatch/",
        description: "...it's just a simple thing"
    },
    {
        url: "https://nepg82.github.io/Thruway-Rest-Area-Helper/",
        description: "Find NYS Thruway rest areas"
    },
    {
        url: "https://nepg82.github.io/Weather-or-Not-HTML/",
        description: "NWS forecasts"
    }
];

const grid = document.getElementById("appGrid");

apps.forEach(app => {

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
        <p>${app.description}</p>
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

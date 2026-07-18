const apps = [
    {
        url: "https://nepg82.github.io/countdown-timer-HTML/",
        description: "Simple countdown timer"
    },
    {
        url: "https://nepg82.github.io/Thruway-Rest-Area-Helper/",
        description: "Find NYS Thruway rest areas"
    },
    {
        url: "https://nepg82.github.io/Weather-or-Not-HTML/",
        description: "NWS forecasts"
    },
    {
        url: "https://nepg82.github.io/Just-The-Tip/",
        description: "Basic tip calculator"
    },
    {
        url: "https://nepg82.github.io/Putt-Pad/",
        description: "Golf score card"
   }
];

const grid = document.getElementById("appGrid");

apps.forEach(async app => {

    let title = app.url;

    try{
        const response = await fetch(app.url + "manifest.json");
        const manifest = await response.json();

        title = manifest.name || manifest.short_name || title;
    }
    catch{
        title = app.url
            .replace("https://nepg82.github.io/","")
            .replace("/","");
    }

    const card = document.createElement("a");

    card.className = "appCard";
    card.href = app.url;

    card.innerHTML = `
        <img src="${app.url}app-icons/app-icon-192.png" alt="${title}">
        <h2>${title}</h2>
        <p>${app.description}</p>
    `;

    grid.appendChild(card);

});

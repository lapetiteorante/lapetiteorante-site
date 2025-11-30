/* ——————————————————————————————
      LA PETITE ORANTE — SCRIPT CENTRAL
      Chargement des méditations + archives
—————————————————————————————— */

/* CHEMIN DU DOSSIER DES MÉDITATIONS */
const MEDITATIONS_FOLDER = "meditations/";

/* LISTE DES FICHIERS À CHARGER */
let meditationFiles = [];

/* RÉCUPÉRATION DE LA LISTE DES FICHIERS */
async function loadMeditationFiles() {
    try {
        const response = await fetch("meditations/");
        const text = await response.text();

        /* Extraction des noms de fichiers HTML */
        const regex = /href="(.*?\.html)"/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            meditationFiles.push(match[1]);
        }

        meditationFiles.sort(); // tri chronologique

        displayLatestMeditations();
        buildArchives();
    } catch (error) {
        console.error("Impossible de charger les méditations :", error);
    }
}

/* AFFICHER LES DERNIÈRES MÉDITATIONS SUR L'ACCUEIL */
function displayLatestMeditations() {
    const container = document.getElementById("latest-posts");
    if (!container) return;

    const last10 = meditationFiles.slice(-10).reverse();

    last10.forEach(file => {
        const article = document.createElement("article");

        const date = file.replace(".html", "");
        const beautifulDate = formatDate(date);

        article.innerHTML = `
            <h3><a href="${MEDITATIONS_FOLDER + file}">${date}</a></h3>
            <div class="date">${beautifulDate}</div>
            <p>Lire la méditation…</p>
        `;

        container.appendChild(article);
    });
}

/* FORMATTER LA DATE (AAAA-MM-JJ → JJ mois AAAA) */
function formatDate(dateStr) {
    const [y, m, d] = dateStr.split("-");
    const mois = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    return `${parseInt(d)} ${mois[m - 1]} ${y}`;
}

/* CONSTRUIRE LES ARCHIVES */
function buildArchives() {
    const archivesList = document.getElementById("archives-list");
    if (!archivesList) return;

    const map = {};

    meditationFiles.forEach(file => {
        const [y, m] = file.split("-");

        const key = `${y}-${m}`;
        if (!map[key]) map[key] = 0;

        map[key]++;
    });

    Object.keys(map).sort().reverse().forEach(key => {
        const [year, month] = key.split("-");
        const li = document.createElement("li");

        const months = [
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
        ];

        li.innerHTML = `<a href="archives.html#${key}">
            ${months[month - 1]} ${year} (${map[key]})
        </a>`;

        archivesList.appendChild(li);
    });
}

/* LANCEMENT */
document.addEventListener("DOMContentLoaded", loadMeditationFiles);

const API_KEY = 'a162de1ec65ccd82900e0f7af3843061';
const BASE_URL = 'https://api.themoviedb.org/3';

// Fonction pour récupérer des films aléatoires
async function fetchRandomMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`);
        const data = await response.json();
        displayRandomItems(data.results, 'random-movies-container', 'movie');
    } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
    }
}

// Fonction pour récupérer des séries aléatoires
async function fetchRandomSeries() {
    try {
        const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=1`);
        const data = await response.json();
        displayRandomItems(data.results, 'random-series-container', 'tv');
    } catch (error) {
        console.error("Erreur lors de la récupération des séries :", error);
    }
}

// Fonction pour afficher des éléments aléatoires (films ou séries)
function displayRandomItems(items, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!items || items.length === 0) {
        container.innerHTML = "<p>Aucun contenu trouvé.</p>";
        return;
    }

    // Sélectionner 3 éléments aléatoires
    const randomItems = items.sort(() => 0.5 - Math.random()).slice(0, 4);

    randomItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        img.alt = item.title || item.name;

        const title = document.createElement('h3');
        title.textContent = item.title || item.name;

        const detailBtn = document.createElement('button');
        detailBtn.textContent = 'Voir les détails';
        detailBtn.addEventListener('click', () => {
            window.location.href = `detail.html?type=${type}&id=${item.id}`;
        });

        card.append(img, title, detailBtn);
        container.appendChild(card);
    });
}

// Charger les films et séries aléatoires au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    fetchRandomMovies();
    fetchRandomSeries();
});
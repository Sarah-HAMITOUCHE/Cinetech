const apiKey = 'a162de1ec65ccd82900e0f7af3843061';

// Fonction pour récupérer les séries disponibles sur Netflix
async function fetchNetflixSeries(page = 1) {
  try {
    // Appel à l'API TMDB pour récupérer les séries Netflix
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=${page}&with_watch_providers=8&watch_region=FR`);
    const data = await response.json(); 

    console.log("Séries Netflix récupérées :", data.results);

    // Affichage des séries sur la page
    displaySeries(data.results);
  } catch (error) {
    console.error("Erreur API Netflix:", error);
  }
}

// Fonction pour afficher les séries sur la page
function displaySeries(series) {
  const container = document.getElementById('series-container');
  container.innerHTML = ''; // On vide le conteneur avant de l'utiliser

  // Si aucune série n'est reçue
  if (!series || series.length === 0) {
    container.innerHTML = "<p>Aucune série Netflix trouvée.</p>";
    return;
  }

  // On parcourt chaque série reçue
  series.forEach(show => {
    // Création d'une carte pour chaque série
    const card = document.createElement('div');
    card.className = 'movie-card';

    // Affichage de l'affiche de la série
    const img = document.createElement('img');
    img.src = show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';
    img.alt = show.name;

    // Description et titre de la série
    const info = document.createElement('div');
    info.className = 'movie-info';

    // Titre de la série
    const title = document.createElement('h2');
    title.textContent = show.name;

    // Résumé (tronqué si trop long)
    const desc = document.createElement('p');
    desc.textContent = show.overview.length > 100
      ? show.overview.slice(0, 100) + "..."
      : show.overview;

    // Bouton favoris
    const btn = document.createElement('button');
    btn.textContent = 'Add to favorites';

    btn.addEventListener('click', () => {
      let favorites = JSON.parse(localStorage.getItem('favoriteSeries')) || [];

      // Ajout en favoris si ce n'est pas déjà fait
      if (!favorites.includes(show.id)) {
        favorites.push(show.id);
        localStorage.setItem('favoriteSeries', JSON.stringify(favorites));
        alert(`"${show.name}" ajouté aux favoris !`);
      } else {
        alert(`"${show.name}" est déjà dans tes favoris.`);
      }
    });

    // Ajout des éléments dans la carte
    info.append(title, desc, btn);
    card.append(img, info);
    container.appendChild(card);
  });
}

// Au chargement de la page, on récupère les séries Netflix
document.addEventListener('DOMContentLoaded', () => {
  fetchNetflixSeries(); // On récupère les séries de la première page
});

const apiKey = 'a162de1ec65ccd82900e0f7af3843061';

// Fonction pour récupérer les détails de la série ou du film
async function fetchDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');  // Récupère l'ID
  const type = urlParams.get('type');  // Récupère le type (movie ou tv)

  try {
    let response;
    if (type === 'movie') {
      response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`);
    } else if (type === 'tv') {
      response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`);
    } else {
      console.error("Type de contenu invalide.");
      return;
    }

    const data = await response.json();
    displayDetails(data, type);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails :", error);
  }
}

// Fonction pour afficher les détails de la série ou du film
function displayDetails(item, type) {
  const container = document.getElementById('detail-container');
  container.innerHTML = '';

  if (!item) {
    container.innerHTML = "<p>Aucun détail trouvé.</p>";
    return;
  }

  // Image du film ou de la série
  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  img.alt = item.title || item.name;

  // Titre
  const title = document.createElement('h1');
  title.textContent = item.title || item.name;

  // Résumé
  const overview = document.createElement('p');
  overview.textContent = item.overview;

  // Date de sortie / première diffusion
  const releaseDate = document.createElement('p');
  releaseDate.textContent = `Release date: ${item.release_date || item.first_air_date}`;

  // Note (rating)
  const rating = document.createElement('p');
  rating.textContent = `Rating: ${item.vote_average}`;

  // Genres
  const genres = document.createElement('p');
  genres.textContent = "Genres: " + item.genres.map(genre => genre.name).join(', ');

  // Ajouter tout au conteneur
  container.append(img, title, overview, releaseDate, rating, genres);

  // Optionnel: Ajouter des recommandations ou séries similaires si nécessaire
  if (type === 'movie') {
    // Recommandations pour les films
    fetchRecommendations(id, 'movie');
  } else if (type === 'tv') {
    // Séries similaires pour les séries
    fetchRecommendations(id, 'tv');
  }
}

// Fonction pour récupérer les recommandations ou séries similaires
async function fetchRecommendations(id, type) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${apiKey}&language=en-US`);
    const data = await response.json();
    displayRecommendations(data.results);
  } catch (error) {
    console.error("Erreur lors de la récupération des recommandations :", error);
  }
}

// Fonction pour afficher les recommandations
function displayRecommendations(recommendations) {
  const container = document.getElementById('recommendations-container');
  if (recommendations.length === 0) {
    container.innerHTML = "<p>Aucune recommandation trouvée.</p>";
    return;
  }

  const recList = document.createElement('ul');
  recommendations.forEach(rec => {
    const recItem = document.createElement('li');
    const recLink = document.createElement('a');
    recLink.href = `detail.html?type=${rec.media_type}&id=${rec.id}`;
    recLink.textContent = rec.title || rec.name;
    recItem.appendChild(recLink);
    recList.appendChild(recItem);
  });

  container.appendChild(recList);
}

// Charger les détails de la série ou du film 
document.addEventListener('DOMContentLoaded', () => {
  fetchDetails();
});

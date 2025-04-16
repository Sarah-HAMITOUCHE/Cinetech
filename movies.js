// Clé API
const apiKey = 'a162de1ec65ccd82900e0f7af3843061';
// Récuperation des films par rapport à l'API
async function fetchMovies(page = 1) {
  try {
    // Appel à l'API 
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`);
    const data = await response.json(); 
    // On transforme la réponse en JSON
    // Affichage des films en console 
    console.log("Films récupérés :", data.results);
    // On passe les films récupérés 
    displayMovies(data.results);
  } catch (error) {
    console.error("Une erreur est survenue lors de la récupération des films :", error);
  }
}

// Fonction pour afficher les films sur la page
function displayMovies(movies) {
  const container = document.getElementById('movies-container');
  container.innerHTML = ''; // On vide le conteneur avant de l'utiliser

  // Si aucun film n'est reçu
  if (!movies || movies.length === 0) {
    container.innerHTML = "<p>Aucun film trouvé.</p>";
    return;
  }

  // On parcourt chaque film reçu
  movies.forEach(movie => {
    // Création d'une carte pour chaque film
    const card = document.createElement('div');
    card.className = 'movie-card';

    // Affichage de l'affiche du film
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = movie.title;

    // Description et titre du film
    const info = document.createElement('div');
    info.className = 'movie-info';

    // Titre du film
    const title = document.createElement('h2');
    title.textContent = movie.title;

    // Résumé (tronqué si trop long)
    const desc = document.createElement('p');
    desc.textContent = movie.overview.length > 100
      ? movie.overview.slice(0, 100) + "..."
      : movie.overview;

    // Bouton favoris 
    const btn = document.createElement('button');
    btn.textContent = 'Add to favorites';

    btn.addEventListener('click', () => {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

      // Ajout en Favoris si ce n'est pas réalisé 
      if (!favorites.includes(movie.id)) {
        favorites.push(movie.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`"${movie.title}" ajouté aux favoris !`);
      } else {
        alert(`"${movie.title}" est déjà dans tes favoris.`);
      }
    });
    // Ajout des films à la une
    info.append(title, desc, btn);
    card.append(img, info);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies(); // On récupère les films de la première page
});

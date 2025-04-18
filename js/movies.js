const apiKey = 'a162de1ec65ccd82900e0f7af3843061';

async function fetchMovies(page = 1) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
  }
}

function displayMovies(movies) {
  const container = document.getElementById('movies-container');
  container.innerHTML = '';

  if (!movies || movies.length === 0) {
    container.innerHTML = "<p>Aucun film trouvé.</p>";
    return;
  }

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = movie.title;

    const info = document.createElement('div');
    info.className = 'movie-info';

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const desc = document.createElement('p');
    desc.textContent = movie.overview.length > 100
      ? movie.overview.slice(0, 100) + "..."
      : movie.overview;

    const favBtn = document.createElement('button');
    favBtn.textContent = 'Add to favorites';
    favBtn.addEventListener('click', () => {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (!favorites.includes(movie.id)) {
        favorites.push(movie.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`"${movie.title}" ajouté aux favoris !`);
      } else {
        alert(`"${movie.title}" est déjà dans tes favoris.`);
      }
    });

    const detailBtn = document.createElement('button');
    detailBtn.textContent = 'View details';
    detailBtn.className = 'detail-button';
    detailBtn.addEventListener('click', () => {
      window.location.href = `detail.html?type=movie&id=${movie.id}`;
    });

    info.append(title, desc, favBtn, detailBtn);
    card.append(img, info);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
});
// Fonction pour rechercher des films
async function searchMovies(query) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}`);
    const data = await response.json();
    displaySearchResults(data.results);
  } catch (error) {
    console.error("Erreur lors de la recherche des films :", error);
  }
}

// Fonction pour afficher les résultats de recherche dans l'autocomplétion
function displaySearchResults(results) {
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = '';

  if (!results || results.length === 0) {
    searchResults.innerHTML = '<p>Aucun résultat trouvé.</p>';
    return;
  }

  results.slice(0, 5).forEach(movie => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    resultItem.textContent = movie.title;

    resultItem.addEventListener('click', () => {
      window.location.href = `detail.html?type=movie&id=${movie.id}`;
    });

    searchResults.appendChild(resultItem);
  });
}

// Gestion de l'événement d'entrée dans la barre de recherche
document.getElementById('search-input').addEventListener('input', (e) => {
  const query = e.target.value.trim();
  const searchResults = document.getElementById('search-results');

  if (query.length > 0) {
    searchMovies(query);
    searchResults.style.display = 'block';
  } else {
    searchResults.style.display = 'none';
  }
});
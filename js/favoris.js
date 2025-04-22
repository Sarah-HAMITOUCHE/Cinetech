const apiKey = 'a162de1ec65ccd82900e0f7af3843061';

function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

async function fetchFavoriteDetail(id, type = 'movie') {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=fr-FR`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du favori :", error);
    return null;
  }
}

async function displayFavorites() {
  const favoritesContainer = document.getElementById('favorites-container');
  const favorites = getFavorites();

  favoritesContainer.innerHTML = '';

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p>Aucun favori pour le moment.</p>';
    return;
  }

  for (const fav of favorites) {
    const type = fav.type || 'movie'; // par défaut "movie", sinon "tv"
    const data = await fetchFavoriteDetail(fav.id, type);
    if (!data) continue;

    const card = document.createElement('div');
    card.className = 'item-card';

    const img = document.createElement('img');
    img.src = data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

    img.alt = data.title || data.name || 'Titre inconnu';

    const title = document.createElement('h3');
    title.textContent = data.title || data.name || 'Nom non disponible';

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Retirer des favoris';
    removeBtn.addEventListener('click', () => {
      removeFavorite(fav.id);
    });

    card.append(img, title, removeBtn);
    favoritesContainer.appendChild(card);
  }
}

function removeFavorite(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(item => item.id !== id);
  saveFavorites(favorites);
  displayFavorites();
}

document.addEventListener('DOMContentLoaded', displayFavorites);

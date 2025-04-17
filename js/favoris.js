// Fonction pour récupérer les favoris depuis le localStorage
function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Fonction pour sauvegarder les favoris dans le localStorage
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Fonction pour afficher les favoris dans la page
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const favorites = getFavorites();

    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>Aucun favori pour le moment.</p>';
        return;
    }

    favorites.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';

        // Vérifiez si poster_path est valide, sinon utilisez une image par défaut
        const img = document.createElement('img');
img.src = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
    : 'https://via.placeholder.com/150?text=Image+indisponible'; // Image par défaut
img.alt = item.title || item.name || 'Titre indisponible';

const title = document.createElement('h3');
title.textContent = item.title || item.name || 'Nom non disponible';

        // Bouton pour retirer des favoris
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Retirer des favoris';
        removeBtn.addEventListener('click', () => {
            removeFavorite(item.id);
        });

        card.append(img, title, removeBtn);
        favoritesContainer.appendChild(card);
    });
}

// Fonction pour retirer un favori
function removeFavorite(id) {
    let favorites = getFavorites();
    favorites = favorites.filter(item => item.id !== id);
    saveFavorites(favorites);
    displayFavorites();
}
// Charger les favoris au chargement de la page
document.addEventListener('DOMContentLoaded', displayFavorites);

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
    console.log(favorites,"favoris")

    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>Aucun favori pour le moment.</p>';
        return;
    }

    favorites.forEach(item => {
        console.log(item.poster_path,"item.poster_path")
        const card = document.createElement('div');
        card.className = 'item-card';

        // Vérifiez si poster_path est valide, sinon utilisez une image par défaut
        const img = document.createElement('img');

        if(item.poster_path) {
            img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`
            console.log('yotyo')
        }
        else{
            img.src ='https://imgs.search.brave.com/z2eZop3i65EcIQe2Ejby0yML2Sky8jk7c2dftdU1Teg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODUy/MDU4OTc4L3ZlY3Rv/ci9lbW9qaS1kZWFk/LTQwNC1lcnJvci5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/NnBEMEhWV2U2Zk5h/MHE1TElqaU1fTGVj/TEdzMWNIZExEQU5y/TVdDTWQtVT0';
        }



//     ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
//     :  // Image par défaut
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

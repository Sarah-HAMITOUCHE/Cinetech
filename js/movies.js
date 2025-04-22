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
      const alreadyFav = favorites.find(fav => fav.id === movie.id && fav.type === 'movie');
      if (!alreadyFav) {
        favorites.push({ id: movie.id, type: 'movie' });
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

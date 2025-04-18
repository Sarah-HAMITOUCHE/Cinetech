const apiKey = 'a162de1ec65ccd82900e0f7af3843061';

async function fetchSeries(page = 1) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${page}`);
    const data = await response.json();
    displaySeries(data.results);
  } catch (error) {
    console.error("Erreur lors de la récupération des séries :", error);
  }
}

function displaySeries(series) {
  const container = document.getElementById('series-container');
  container.innerHTML = '';

  if (!series || series.length === 0) {
    container.innerHTML = "<p>Aucune série trouvée.</p>";
    return;
  }

  series.forEach(serie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${serie.poster_path}`;
    img.alt = serie.name;

    const info = document.createElement('div');
    info.className = 'movie-info';

    const title = document.createElement('h2');
    title.textContent = serie.name;

    const desc = document.createElement('p');
    desc.textContent = serie.overview.length > 100
      ? serie.overview.slice(0, 100) + "..."
      : serie.overview;

    const favBtn = document.createElement('button');
    favBtn.textContent = 'Add to favorites';
    favBtn.addEventListener('click', () => {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (!favorites.includes(serie.id)) {
        favorites.push(serie.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`"${serie.name}" ajoutée aux favoris !`);
      } else {
        alert(`"${serie.name}" est déjà dans tes favoris.`);
      }
    });

    const detailBtn = document.createElement('button');
    detailBtn.textContent = 'Voir les détails';
    detailBtn.className = 'detail-button';
    detailBtn.addEventListener('click', () => {
      window.location.href = `detail.html?type=tv&id=${serie.id}`;
    });

    info.append(title, desc, favBtn, detailBtn);
    card.append(img, info);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchSeries();
});

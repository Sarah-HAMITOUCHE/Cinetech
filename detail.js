const apiKey = 'a162de1ec65ccd82900e0f7af3843061';

// Récupère l'ID depuis l'URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
  document.getElementById('detail-container').textContent = "Aucun ID fourni.";
}

// Appelle l'API pour obtenir les détails du film
async function fetchDetails(id) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    displayDetails(data);
  } catch (err) {
    console.error('Erreur lors du chargement des détails :', err);
  }
}

function displayDetails(movie) {
  const container = document.getElementById('detail-container');
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = movie.title;

  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  img.alt = movie.title;

  const desc = document.createElement('p');
  desc.textContent = movie.overview;

  const release = document.createElement('p');
  release.textContent = `Release date: ${movie.release_date}`;

  container.append(title, img, desc, release);
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDetails(id);
});

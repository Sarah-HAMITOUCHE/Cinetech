const apiKey = 'a162de1ec65ccd82900e0f7af3843061';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const type = params.get('type'); // "movie" ou "tv"

  if (!id || !type) {
    console.error("ID ou type manquant dans l'URL.");
    return;
  }

  fetchDetails(id, type);
  setupCommentForm(id, type);
});

async function fetchDetails(id, type) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=fr-FR`);
    const data = await response.json();
    displayDetails(data, type);
    fetchTMDBReviews(id, type);
    displayLocalComments(id, type);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails :", error);
  }
}

function displayDetails(item, type) {
  const container = document.getElementById('detail-container');
  container.innerHTML = '';

  const title = type === 'movie' ? item.title : item.name;
  const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
  const genres = item.genres.map(g => g.name).join(', ');
  const imgSrc = `https://image.tmdb.org/t/p/w500${item.poster_path}`;

  const card = document.createElement('div');
  card.className = 'detail-card';
  card.innerHTML = `
    <img src="${imgSrc}" alt="${title}">
    <div class="detail-info">
      <h1>${title}</h1>
      <p><strong>Date :</strong> ${releaseDate}</p>
      <p><strong>Langue :</strong> ${item.original_language.toUpperCase()}</p>
      <p><strong>Note :</strong> ${item.vote_average}/10</p>
      <p><strong>Genres :</strong> ${genres}</p>
      <p>${item.overview}</p>
    </div>
  `;

  container.appendChild(card);
}

async function fetchTMDBReviews(id, type) {
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${apiKey}&language=fr-FR`);
  const data = await res.json();

  const container = document.getElementById('reviews-container');
  container.innerHTML = "<h3>Commentaires (TMDB)</h3>";

  if (!data.results || data.results.length === 0) {
    container.innerHTML += "<p>Aucun commentaire TMDB trouvé.</p>";
    return;
  }

  data.results.forEach(review => {
    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.innerHTML = `
      <p><strong>${review.author}</strong></p>
      <p>${review.content}</p>
      <hr/>
    `;
    container.appendChild(comment);
  });
}

// --- Commentaires utilisateur (localStorage) ---

function displayLocalComments(id, type) {
  const commentsKey = `comments_${type}_${id}`;
  const comments = JSON.parse(localStorage.getItem(commentsKey)) || [];

  const list = document.getElementById('user-comments-list');
  list.innerHTML = "<h3>Vos commentaires</h3>";

  if (comments.length === 0) {
    list.innerHTML += "<p>Aucun commentaire pour l'instant.</p>";
    return;
  }

  comments.forEach((c, index) => {
    const div = document.createElement('div');
    div.className = 'user-comment';
    div.innerHTML = `
      <p><strong>${c.user}</strong> : ${c.text}</p>
      <button onclick="removeLocalComment('${commentsKey}', ${index})">Supprimer</button>
    `;
    list.appendChild(div);
  });
}

function setupCommentForm(id, type) {
  const btn = document.getElementById('submit-comment');
  btn.addEventListener('click', () => {
    const input = document.getElementById('user-comment-input');
    const commentText = input.value.trim();
    if (!commentText) return;

    const commentsKey = `comments_${type}_${id}`;
    const comments = JSON.parse(localStorage.getItem(commentsKey)) || [];

    comments.push({ user: 'Utilisateur', text: commentText });
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    input.value = '';
    displayLocalComments(id, type);
  });
}

function removeLocalComment(storageKey, index) {
  const comments = JSON.parse(localStorage.getItem(storageKey)) || [];
  comments.splice(index, 1);
  localStorage.setItem(storageKey, JSON.stringify(comments));
  displayLocalCommentsFromKey(storageKey);
}

function displayLocalCommentsFromKey(key) {
  const [_, type, id] = key.split('_');
  displayLocalComments(id, type);
}

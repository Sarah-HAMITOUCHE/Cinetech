const API_KEY = 'a162de1ec65ccd82900e0f7af3843061'; // Remplacez par votre clé API TMDB
const BASE_URL = 'https://api.themoviedb.org/3';
let currentPage = {
    movies: 1,
    series: 1
}
// Navigation
function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(link.getAttribute('href').substring(1));
        if (link.getAttribute('href') === '#movies') fetchMovies(currentPage.movies);
        if (link.getAttribute('href') === '#series') fetchSeries(currentPage.series);
        if (link.getAttribute('href') === '#favorites') displayFavorites();
    });
});

// Fetch Movies for Home and Movies Page
async function fetchMovies(page = 1) {
    try {
        const response = await axios.get(`${BASE_URL}/movie/popular`, {
            params: { api_key: API_KEY, page }
        });
        const movies = response.data.results;
        if (page === 1) {
            displayContent(movies, 'movieSelection');
        }
        displayContent(movies, 'movieList');
        updatePagination(page, response.data.total_pages, 'moviePagination', 'movies');
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
    }
}
// Fetch Series for Home and Series Page
async function fetchSeries(page = 1) {
    try {
        const response = await axios.get(`${BASE_URL}/tv/popular`, {
            params: { api_key: API_KEY, page }
        });
        const series = response.data.results;
        if (page === 1) {
            displayContent(series, 'seriesSelection');
        }
        displayContent(series, 'seriesList');
        updatePagination(page, response.data.total_pages, 'seriesPagination', 'series');
    } catch (error) {
        console.error('Erreur lors du chargement des séries:', error);
    }
}

// Display Content
function displayContent(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded shadow';
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" alt="${item.title || item.name}" class="w-full h-48 object-cover rounded">
            <h3 class="text-lg font-bold mt-2">${item.title || item.name}</h3>
            <button class="bg-blue-600 text-white p-2 rounded mt-2" onclick="showDetail('${item.id}', '${containerId.includes('series') ? 'tv' : 'movie'}')">Détails</button>
            <button class="bg-yellow-500 text-white p-2 rounded mt-2" onclick="toggleFavorite('${item.id}', '${item.title || item.name}', '${containerId.includes('series') ? 'tv' : 'movie'}')">Favori</button>
        `;
        container.appendChild(card);
    });
}

// Pagination
function updatePagination(currentPage, totalPages, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (currentPage > 1) {
        container.innerHTML += `<button class="bg-blue-600 text-white p-2 rounded mx-1" onclick="changePage(${currentPage - 1}, '${type}')">Précédent</button>`;
    }
    if (currentPage < totalPages) {
        container.innerHTML += `<button class="bg-blue-600 text-white p-2 rounded mx-1" onclick="changePage(${currentPage + 1}, '${type}')">Suivant</button>`;
    }
}

function changePage(page, type) {
    currentPage[type] = page;
    if (type === 'movies') fetchMovies(page);
    if (type === 'series') fetchSeries(page);
}

// Favorites Management
function toggleFavorite(id, title, type) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(fav => fav.id === id);
    if (index === -1) {
        favorites.push({ id, title, type });
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const container = document.getElementById('favoritesList');
    container.innerHTML = '';
    favorites.forEach(fav => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded shadow';
        card.innerHTML = `
            <h3 class="text-lg font-bold">${fav.title}</h3>
            <button class="bg-blue-600 text-white p-2 rounded mt-2" onclick="showDetail('${fav.id}', '${fav.type}')">Détails</button>
            <button class="bg-red-600 text-white p-2 rounded mt-2" onclick="toggleFavorite('${fav.id}', '${fav.title}', '${fav.type}'); displayFavorites();">Retirer</button>
        `;
        container.appendChild(card);
    });
}

// Detail Page
async function showDetail(id, type) {
    try {
        const response = await axios.get(`${BASE_URL}/${type}/${id}`, {
            params: { api_key: API_KEY }
        });
        const item = response.data;
        const detailContent = document.getElementById('detailContent');
        detailContent.innerHTML = `
            <div class="bg-white p-4 rounded shadow">
                <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${item.title || item.name}" class="w-full h-64 object-cover rounded">
                <h2 class="text-2xl font-bold mt-4">${item.title || item.name}</h2>
                <p><strong>Résumé:</strong> ${item.overview}</p>
                <p><strong>Genres:</strong> ${item.genres.map(g => g.name).join(', ')}</p>
                <p><strong>Pays:</strong> ${item.production_countries.map(c => c.name).join(', ')}</p>
                ${type === 'movie' ? `<p><strong>Réalisateur:</strong> ${await getDirector(id)}</p>` : ''}
                <p><strong>Acteurs:</strong> ${await getActors(id, type)}</p>
            </div>
        `;
        showSection('detail');
        fetchComments(id, type);
        fetchSimilar(id, type);
    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
    }
}

async function getDirector(movieId) {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
        params: { api_key: API_KEY }
    });
    const director = response.data.crew.find(member => member.job === 'Director');
    return director ? director.name : 'Inconnu';
}

async function getActors(id, type) {
    const response = await axios.get(`${BASE_URL}/${type}/${id}/credits`, {
        params: { api_key: API_KEY }
    });
    return response.data.cast.slice(0, 5).map(actor => actor.name).join(', ');
}

// Comments
async function fetchComments(id, type) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    // TMDB reviews
    const response = await axios.get(`${BASE_URL}/${type}/${id}/reviews`, {
        params: { api_key: API_KEY }
    });
    response.data.results.forEach(review => {
        commentsList.innerHTML += `
            <div class="bg-gray-200 p-4 rounded mb-2">
                <p><strong>${review.author}</strong>: ${review.content}</p>
            </div>
        `;
    });
    // Local comments
    const localComments = JSON.parse(localStorage.getItem(`comments_${type}_${id}`) || '[]');
    localComments.forEach(comment => {
        commentsList.innerHTML += `
            <div class="bg-gray-200 p-4 rounded mb-2">
                <p><strong>Utilisateur</strong>: ${comment.content}</p>
                <button class="bg-blue-600 text-white p-1 rounded" onclick="replyToComment('${id}', '${type}', '${comment.content}')">Répondre</button>
            </div>
        `;
    });

    document.getElementById('submitComment').onclick = () => {
        const content = document.getElementById('newComment').value;
        if (content) {
            const comments = JSON.parse(localStorage.getItem(`comments_${type}_${id}`) || '[]');
            comments.push({ content, timestamp: new Date().toISOString() });
            localStorage.setItem(`comments_${type}_${id}`, JSON.stringify(comments));
            document.getElementById('newComment').value = '';
            fetchComments(id, type);
        }
    };
}

function replyToComment(id, type, parentComment) {
    const reply = prompt('Votre réponse :');
    if (reply) {
        const comments = JSON.parse(localStorage.getItem(`comments_${type}_${id}`) || '[]');
        comments.push({ content: `Réponse à "${parentComment}": ${reply}`, timestamp: new Date().toISOString() });
        localStorage.setItem(`comments_${type}_${id}`, JSON.stringify(comments));
        fetchComments(id, type);
    }
}

// Similar Content
async function fetchSimilar(id, type) {
    try {
        const response = await axios.get(`${BASE_URL}/${type}/${id}/similar`, {
            params: { api_key: API_KEY }
        });
        displayContent(response.data.results.slice(0, 4), 'similarContent');
    } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
    }
}
async function fetchRandomPopularMovies() {
    try {
        // Récupérer les films populaires depuis l'API TMDB
        const response = await axios.get(`${BASE_URL}/movie/popular`, {
            params: { api_key: API_KEY, page: Math.floor(Math.random() * 10) + 1 } // Page aléatoire
        });
        const movies = response.data.results;

        // Sélectionner un sous-ensemble aléatoire de films
        const randomMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 5);

        // Afficher les films dans la section "popular-movies"
        const container = document.getElementById('popular-movies');
        container.innerHTML = '';
        randomMovies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                <h3 class="movie-title">${movie.title}</h3>
                <button class="details-button" onclick="showDetail('${movie.id}', 'movie')">Détails</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des films populaires :', error);
    }
}

// Appeler la fonction au chargement de la page
fetchRandomPopularMovies();
// Search with Autocomplete
document.getElementById('search-input').addEventListener('input', async (e) => {

    const query = e.target.value;
    if (query.length < 3) {
        document.getElementById('autocompleteResults').classList.add('hidden');
        return;
    }
    try {
        const response = await axios.get(`${BASE_URL}/search/multi`, {
            params: { api_key: API_KEY, query }
        });
        const results = response.data.results.slice(0, 5);
        const autocomplete = document.getElementById('autocompleteResults');
        autocomplete.innerHTML = '';
        results.forEach(item => {
            const div = document.createElement('div');
            div.className = 'p-2 hover:bg-gray-200 cursor-pointer';
            div.innerText = item.title || item.name;
            div.onclick = () => showDetail(item.id, item.media_type);
            autocomplete.appendChild(div);
        });
        autocomplete.classList.remove('hidden');
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
    }
});

// Initialize
showSection('home');
fetchMovies();
fetchSeries();
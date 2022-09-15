const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': 'es-VE'
    },
});

const API ='https://api.themoviedb.org/3';
const trendingEndpoint = '/trending/movie/day';
const categories = '/genre/movie/list';
const URL_IMG = 'https://image.tmdb.org/t/p/w300';

async function getTrendingMoviesPreview() {
    // const res = await fetch(`${API}${trendingEndpoint}?api_key=${API_KEY}`, {
       
    // });
    // const data = await res.json();
    const { data } = await api(trendingEndpoint);

    const movies = data.results;

    console.log({ data, movies }); 

    trendingMoviesPreviewList.innerHTML = '';
    movies.forEach( movie => {

        // const trendingMoviesPreviewList =  document.querySelector('#trendingPreview .trendingPreview-movieList')

        

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', URL_IMG + movie.poster_path);


        trendingMoviesPreviewList.appendChild(movieContainer);
        movieContainer.appendChild(movieImg);
    })
}


async function getCategoriesPreview() {
    const { data } = await api(categories);
    

    const genre = data.genres;

    console.log({ data, genre }); 

    categoriesPreviewList.innerHTML = '';
    genre.forEach( category => {

        // const categoriesPreviewList =  document.querySelector('#categoriesPreview .categoriesPreview-list');


        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        const categoryTitleText = document.createTextNode(category.name);
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        categoriesPreviewList.appendChild(categoryContainer);
 
    })
}


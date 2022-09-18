const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
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

/*Utils DRY*/

function createMovies(movies, container) {
   container.innerHTML = '';
   
   movies.forEach( movie => {
    

    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    movieContainer.addEventListener('click', ()=>{
        location.hash = `#movie=${movie.id}`
    })

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src', URL_IMG + movie.poster_path);
    movieImg.onerror = () => {
        movieImg.setAttribute('src', 'https://media.istockphoto.com/photos/broken-glass-background-in-black-black-minimalist-background-with-on-picture-id1247644004?k=20&m=1247644004&s=612x612&w=0&h=kUXvgGjWMYNOhh1qKM2E9EXvp6PchSCudjObrB0P5zw=')
        movieImg.setAttribute('alt','Broken-url-img')
    }


    container.appendChild(movieContainer);
    movieContainer.appendChild(movieImg);
})
}

function createCategories(categories, container) {
    container.innerHTML = '';
    
    categories.forEach( category => {

        // const categoriesPreviewList =  document.querySelector('#categoriesPreview .categoriesPreview-list');


        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash =`#category=${category.id}-${category.name}`;
            headerTitleCategory.innerHTML = category.name == 'Suspense' ? 'Suspenso' : category.name;
        })
        const categoryTitleText = document.createTextNode(`${
            category.name == 'Suspense' ? 'Suspenso' : category.name
        }`);
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
 
    })
}

/*llamados a la API*/



/* con esta funcion si se hace un refresh o back en el navegador, el scroll se ubicara al inicio de la pagina */

// window.onbeforeunload = () => {
//     scrollTo(0,0);
// }

/* contenedores con Scroll horizontal*/
relatedMoviesContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    relatedMoviesContainer.scrollLeft += evt.deltaY;
    });

const scrollContainer = trendingMoviesPreviewList;
scrollContainer.addEventListener("wheel", (evt) => {
evt.preventDefault();
scrollContainer.scrollLeft += evt.deltaY;
});


async function getTrendingMoviesPreview() {
    // const res = await fetch(`${API}${trendingEndpoint}?api_key=${API_KEY}`, {
       
    // });
    // const data = await res.json();

    const { data } = await api(trendingEndpoint);

    const movies = data.results;

    console.log({ data, movies }); 
    

    createMovies(movies, trendingMoviesPreviewList);

    // trendingMoviesPreviewList.innerHTML = '';
    // movies.forEach( movie => {

    //     // const trendingMoviesPreviewList =  document.querySelector('#trendingPreview .trendingPreview-movieList')

        

    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');

    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);
    //     movieImg.setAttribute('src', URL_IMG + movie.poster_path);


    //     trendingMoviesPreviewList.appendChild(movieContainer);
    //     movieContainer.appendChild(movieImg);
    // })
}


async function getCategoriesPreview() {
    const { data } = await api(categories);
    

    const genre = data.genres;

    console.log({ data, genre }); 

    createCategories(genre, categoriesPreviewList);

    // categoriesPreviewList.innerHTML = '';
    // genre.forEach( category => {

    //     // const categoriesPreviewList =  document.querySelector('#categoriesPreview .categoriesPreview-list');


    //     const categoryContainer = document.createElement('div');
    //     categoryContainer.classList.add('category-container');

    //     const categoryTitle = document.createElement('h3');
    //     categoryTitle.classList.add('category-title');
    //     categoryTitle.setAttribute('id', 'id' + category.id);
    //     categoryTitle.addEventListener('click', () => {
    //         location.hash =`#category=${category.id}-${category.name}`;
    //         headerTitleCategory.innerHTML = category.name == 'Suspense' ? 'Suspenso' : category.name;
    //     })
    //     const categoryTitleText = document.createTextNode(`${
    //         category.name == 'Suspense' ? 'Suspenso' : category.name
    //     }`);
    //     categoryTitle.appendChild(categoryTitleText);
    //     categoryContainer.appendChild(categoryTitle);
    //     categoriesPreviewList.appendChild(categoryContainer);
 
    // })
}

async function getMoviesByCategories(id) {
    
    const { data } = await api('/discover/movie', {
        params: {
            with_genres: id,
        },
    });

    const movies = data.results;

    console.log({ data, movies }); 

    createMovies(movies, genericSection);
    // genericSection.innerHTML = '';
    // movies.forEach( movie => {
       

    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');

    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);
    //     movieImg.setAttribute('src', URL_IMG + movie.poster_path);


    //     genericSection.appendChild(movieContainer);
    //     movieContainer.appendChild(movieImg);
    // })
}

async function getMoviesBySearch(searchValue) {
    
    const { data } = await api('/search/movie', {
        params: {
            query: searchValue,
        },
    });

    const movies = data.results;


    createMovies(movies, genericSection);
   
}

async function getTrendingMovies() {
    const { data } = await api(trendingEndpoint);

    const movies = data.results;

    console.log({ data, movies }); 
    createMovies(movies, genericSection)
}


async function getMovieById(id) {
    
    const { data: movie } = await api(`/movie/${id}`);
    console.log(movie);

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);

    let posterImgError = "https://media.istockphoto.com/photos/broken-glass-background-in-black-black-minimalist-background-with-on-picture-id1247644004?k=20&m=1247644004&s=612x612&w=0&h=kUXvgGjWMYNOhh1qKM2E9EXvp6PchSCudjObrB0P5zw=";

    const urlLargeWidth = URL_IMG.replace('w300', 'w500');

    movie.poster_path === null ?
    headerSection.style.background = `
    linear-gradient(
        180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${posterImgError})`:
    headerSection.style.background = `
    linear-gradient(
        180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${urlLargeWidth}${movie.poster_path})`;
        
      
    createCategories(movie.genres, categoryList);
    /*peliculas relacionadas*/
    getRelatedMoviesId(id) 
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`/movie/${id}/similar`);

    const relatedMovies = data.results;
    console.log('Related Movies: ',relatedMovies)

    createMovies(relatedMovies, relatedMoviesContainer);
}
//Data
const lang= localStorage.language;
lan.value = lang !== '' ? lang: 'en';

if(lang.value == "en"){
    trendingPreviewTitle.innerHTML = 'Trends'
}
lan.addEventListener('change', () => {
    localStorage.setItem('language', lan.value);
    location.reload();
})

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': lan.value,
    },
});

const API ='https://api.themoviedb.org/3';
const trendingEndpoint = '/trending/movie/day';
const categories = '/genre/movie/list';
const URL_IMG = 'https://image.tmdb.org/t/p/w300';

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item){
        movies = item;
    } else {
        movies = {}
    }
    return movies;
}
function likeMovie(movie) {
    const likedMovies = likedMoviesList();
    console.log(likedMoviesList());

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
     
    } 
    else {
        likedMovies[movie.id] = movie;      
        
    }
    localStorage.setItem('liked_movies',  JSON.stringify(likedMovies))
}

/*Utils DRY*/

function target(entries) {
    entries.forEach((entry) => {
        // console.log({entry});
        if(entry.isIntersecting === true){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    })
}
const lazyLoader = new IntersectionObserver(target);



function createMovies(
    movies,
    container,
    {   lazyLoad = false,
        clean = true,
    } = {}, 
    ) {
        if(clean){
        container.innerHTML = '';
    }
   
   movies.forEach( movie => {
    

    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(lazyLoad ? 'data-img': 'src', URL_IMG + movie.poster_path);
    movieImg.addEventListener('click', ()=>{
        location.hash = `#movie=${movie.id}`
    })
    movieImg.onerror = () => {
        movieImg.setAttribute('src', 'https://media.istockphoto.com/photos/broken-glass-background-in-black-black-minimalist-background-with-on-picture-id1247644004?k=20&m=1247644004&s=612x612&w=0&h=kUXvgGjWMYNOhh1qKM2E9EXvp6PchSCudjObrB0P5zw=')
        movieImg.setAttribute('alt','Broken-url-img')
    };
    
    const movieBtn = document.createElement('button');
    movieBtn.classList.add('movie-btn');
    likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
    
    movieBtn.addEventListener('click', () => {
        movieBtn.classList.toggle('movie-btn--liked');
        //muestro o oculto la seccion de peliculas favoritas, uso un setTimeOut para esconder la seccion de favoritos cuando esta vacia
        likedTitle.classList.remove('inactive');
        likedMovieListArticle.classList.remove('inactive');
       setTimeout(hiddeLikedSectionEmpty, 300);
        likeMovie(movie);
        
        getLikedMovies();
    })

    if(lazyLoad){
        lazyLoader.observe(movieImg);
    }

    container.appendChild(movieContainer);
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);

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
            headerCategoryTitle.innerHTML = category.name == 'Suspense' ? 'Suspenso' : category.name;
            
            
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

likedMovieListArticle.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    likedMovieListArticle.scrollLeft += evt.deltaY;
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
    

    createMovies(movies, trendingMoviesPreviewList, {lazyLoad: true, clean: true});

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

    console.log('getCategPrev', { data, genre }); 

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
    maxPage = data.total_pages;
    console.log({ data, movies }); 
    

    createMovies(movies, genericSection, true, true);
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

function paginatedByCategory(id) {
    return async function () {
        const {
            scrollTop,
            clientHeight,
            scrollHeight} = document.documentElement;
    
        const scrollIsBottom = scrollTop + clientHeight >= scrollHeight -15;
    
        const pageIsNotMax = page < maxPage ;
        
        if(scrollIsBottom && pageIsNotMax){
            page++;
            const { data } = await api('/discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
        
            const movies = data.results;
            
            console.log({ data, movies, maxPage }); 
            
        
            createMovies(movies, genericSection, {lazyLoad: true,
                clean: false});
        }
    }

}
async function getMoviesBySearch(searchValue) {
    
    const { data } = await api('/search/movie', {
        params: {
            query: searchValue,
        },
    });

    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    
    createMovies(movies, genericSection, {lazyLoad: true, clean: true});
   
}

 function getPaginatedBySearch(query) {
    return async function (){
        const {
            scrollTop,
            clientHeight,
            scrollHeight} = document.documentElement;
    
        const scrollIsBottom = scrollTop + clientHeight >= scrollHeight -15;
    
        const pageIsNotMax = page < maxPage ;
        if(scrollIsBottom && pageIsNotMax){
            page++;
    
            const { data } = await api('/search/movie', {
            params: {
                query,
                page,
                },
            });
    
            const movies = data.results;
            
            
            createMovies(
                movies,
                genericSection,
                {lazyLoad: true,
                clean: false
            });
        }
    }
    
}

async function getTrendingMovies() {
    const { data } = await api(trendingEndpoint);

    const movies = data.results;
    maxPage = data.total_pages;
    console.log({ data, movies }); 
    createMovies(movies, genericSection, {lazyLoad:true, clean:true})

    
}

//Boton cargar mas
// const loadMoreBtn = document.createElement('button');
//     loadMoreBtn.classList.add('loadMoreButton')
//     loadMoreBtn.style.borderRadius= '8px';
//     loadMoreBtn.style.padding= '8px';

//     loadMoreBtn.innerHTML ='Cargar mas';
//     containerBtn.appendChild(loadMoreBtn);
    
//     loadMoreBtn.addEventListener('click', getPaginatedTrendingMovies);
 
async function getPaginatedTrendingMovies() {
    const {
        scrollTop,
        clientHeight,
        scrollHeight} = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight -15;

    const pageIsNotMax = page < maxPage ;
    if(scrollIsBottom && pageIsNotMax){
    page++;
    const { data } = await api(trendingEndpoint, {
        params: {
            page/*pagination++*/
        },
    });
    
    const movies = data.results;
   
    createMovies(movies, genericSection, {lazyLoad:true, clean:false});
    }

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

function getLikedMovies() {
    
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies)
    

    createMovies(moviesArray, likedMovieListArticle, {lazyLoad: false, clean: true})

    console.log('likedMovies: ', likedMovies);


}

function hiddeLikedSectionEmpty() {
    if(likedMovieListArticle.innerHTML == ''){
        likedTitle.classList.add('inactive');
        likedMovieListArticle.classList.add('inactive');
    } 
}
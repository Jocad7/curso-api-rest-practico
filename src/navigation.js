

window.addEventListener('hashchange', navigator, false);
window.addEventListener('DOMContentLoaded', navigator, false);

searchFormBtn.addEventListener('click', () => {
    let regex = /\w/g;
    regex.test(searchFormInput.value) ? location.hash = '#search=' : location.hash &&  alert('Desbes ingresar algun caracter en la busqueda')
   
    // searchFormInput.value !== '' ? location.hash = '#search=' : alert('Desbes ingresar algun caracter en la busqueda')
    
})

arrowBtn.addEventListener('click', () => { 
    history.back(); // <----------------------
    // location.hash = '#home'
    
})
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
})


function navigator() {
    console.log({ location });

    if(location.hash.startsWith('#trends')){
        trends();
    } else if(location.hash.startsWith('#search=')) {
        searchPage();
    } else if(location.hash.startsWith('#movie=')) {
        movieDetails();
    } else if(location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }
    scrollTo( 0, 0 )
    trendingMoviesPreviewList.scrollTo(0,0);
    relatedMovieScrollContainer.scrollTo(0,0);
}

function homePage() {
    console.log ('Home!!')
    
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingMoviesPreviewList.scrollTo(0,0);
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function trends() {
    console.log ('TRENDS!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
 
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    headerTitleCategory.innerHTML = 'Tendencias';
    getTrendingMovies();
}


function searchPage() {
    console.log ('search!!')
    location.hash = `#search=${searchFormInput.value.trim()}`.split('%20').join('-');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
 
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // ['#search', 'busqueda']
    const [_, searchValue] = location.hash.split('=');
    const query = searchValue.split('%20').join(' ');
    
    getMoviesBySearch(query);
}


function movieDetails() {
    console.log ('Movies!')

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
 
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    
    const [_, movieId] = location.hash.split('=');

    getMovieById(movieId)
}

function categoriesPage() {
    console.log('categories!')
    window.scrollTo( 0, 0 )
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
 
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
   
   getMoviesByCategories(categoryId)
}



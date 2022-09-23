let maxPage;
let page =1;  
let infiniteScroll;

window.addEventListener('hashchange', navi, false);
window.addEventListener('DOMContentLoaded', navi, false);
window.addEventListener('scroll', infiniteScroll, false);
searchFormBtn.addEventListener('click', () => {   
    let regex = /\w/g;
    regex.test(searchFormInput.value) ? 
    location.hash = '#search=' + searchFormInput.value.trim() : 
    location.hash = '#home' &&  alert('Desbes ingresar algun caracter en la busqueda');
   
})


arrowBtn.addEventListener('click', () => { 
    // location.hash = '#home'
    history.back();   
    
})
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
})


function navi() {
    console.log({ location });

    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

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
    
    trendingMoviesPreviewList.scrollTo(0,0);
    relatedMovieScrollContainer.scrollTo(0,0);
    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, false)
    }
}

function homePage() {
    
    console.log ('Home!!')
    switch(lan.value){
        case 'en':
            trendingPreviewTitle.innerHTML = 'Trends';
            trendingBtn.innerHTML = 'See more';
            categoriesPreviewTitle.innerHTML = 'Categories';
            likedTitle.innerHTML = 'Favorite movies';
            break;
        case 'fr':
            trendingPreviewTitle.innerHTML = 'Les tendances';
            trendingBtn.innerHTML = 'Voir plus';
            categoriesPreviewTitle.innerHTML = 'Catégories';
            likedTitle.innerHTML = 'Films préférés';
            break;
            case 'pt-BR':
                trendingPreviewTitle.innerHTML = 'Tendências';
                trendingBtn.innerHTML = 'Ver mais'
                categoriesPreviewTitle.innerHTML = 'Categorias';
                likedTitle.innerHTML = 'Filmes favoritos';
            break;
        default:
            trendingPreviewTitle.innerHTML = 'Tendencias';
            break;
    }
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
    containerBtn.classList.add('inactive');
    likedContainer.classList.remove('inactive');
    // loadMoreBtn.style.display ='none';
    getTrendingMoviesPreview();
    getCategoriesPreview();
    
    
    setTimeout(hiddeLikedSectionEmpty, 1)
    getLikedMovies();
    
}

function trends() {
    console.log ('TRENDS!!')
    //Variable agregada para la funcion del boton loadMoreBtn
    // pagination = 2; 
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    // loadMoreBtn.style.display = 'block';
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    containerBtn.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    likedContainer.classList.add('inactive');
    headerCategoryTitle.innerHTML = 'Tendencias';
    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}


function searchPage() {
    console.log ('search!!')
    // location.hash = `#search=${searchFormInput.value.trim()}`.split('%20').join('-');
    
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    containerBtn.classList.add('inactive');
    // loadMoreBtn.style.display ='none';
    likedContainer.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    

    // ['#search', 'busqueda']
    const [_, query] = location.hash.split('=');
    // const query = searchValue.split('%20').join(' ');
    
    getMoviesBySearch(
        query.includes('%20') ?
        query.split('%20').join(' ') :
        query
        );

    infiniteScroll = getPaginatedBySearch(
        query.includes('%20') ?
        query.split('%20').join(' ') :
        query
    )
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
    containerBtn.classList.add('inactive');
    // loadMoreBtn.style.display ='none';
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    likedContainer.classList.add('inactive');
    const [_, movieId] = location.hash.split('=');

    getMovieById(movieId)
}

function categoriesPage() {
    console.log('categories!')
    scrollTo(0,0);
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    containerBtn.classList.add('inactive');
    // loadMoreBtn.style.display ='none';
    likedContainer.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    const [_, categoryData] = location.hash.split('=');
    
    const [categoryId, categoryName] = categoryData.split('-');
   
// switch(categoryId){
//         case('10402'):
//             headerCategoryTitle.innerHTML = 'Música';
//             break;
//         case('28'):
//             headerCategoryTitle.innerHTML = 'Acción';
//             break;
//         case  ('16'):
//             headerCategoryTitle.innerHTML = 'Animación';
//             break;
//         case ('14'):
//             headerCategoryTitle.innerHTML = 'Fantasía';
//             break;
            
//         case ('878'):
//             headerCategoryTitle.innerHTML = 'Ciencia ficción';
//             break;
//         case ('10770'):
//             headerCategoryTitle.innerHTML = 'Película de TV';
//             break;
//         case ('10752'):
//             headerCategoryTitle.innerHTML = 'Bélica';
//             break;
//         default:
//             headerCategoryTitle.innerHTML = 
//             categoryName == 'Suspense' ? 'Suspenso' : categoryName;
//             break;
// }
//    console.log(categoryName)
   getMoviesByCategories(categoryId);
   infiniteScroll = paginatedByCategory(categoryId);
}



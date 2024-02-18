const searchBtn = document.getElementById("search-btn")
const searchInput = document.getElementById("movie-input")
const OMDB_KEY = "2c3092e4"
const baseUrl = "https://www.omdbapi.com/?apikey="
const searchQuery = "&s="
const parameterQuery = "&plot=short"
const IdQuery = "&i="
const fullPlotQuery = `&plot=full`
const searchResultsEl = document.getElementById("search-results-section")
const watchlistEl = document.getElementById("watchlist")


document.addEventListener("click", clickhandler)
if (watchlistEl){
    renderWatchlist()
}
netlifyTest()
function netlifyTest(){
    const url = 'https://add-to-watchlist-akarimpil.netlify.app/.netlify/functions/fetchMovie'
    fetch(url,{
        method: "POST",
        body: "testStr",
        headers:{
            "Content-Type": "text/plain"
        }
    })
    .then(res => res.json())
    .then(data => console.log(data))
}


function clickhandler(event){
    const clickedEl = event.target
    const clickedElParent = clickedEl.parentElement
    if(clickedEl.id === "search-btn"){
        handleSearch()
    }
    else if(clickedElParent.classList.contains("add-to-watchlist")){
        addToWatchList(clickedElParent.parentElement)
    }
    else if(clickedElParent.classList.contains("remove-watchlist")){
        removeFromWatchlist(clickedElParent.parentElement)
    }
}


function renderWatchlist(){


    let localMoviesData = JSON.parse(localStorage.getItem("localMoviesData"))
    let watchlistHtmlStr = ""
    for(let movie of localMoviesData){
        const {Poster, Title, Runtime, Genre, Plot, imdbRating, imdbId} = movie
        watchlistHtmlStr += `
        <div class="movie" data-imdb-id=${imdbId}>
            <img class="movie-thumbnail" src=${decodeURIComponent(Poster)}/>
            <div class="movie-title">
                <h2> ${decodeURIComponent(Title)}</h2>
                <i class="fa-solid fa-star"></i>
                <h3> ${decodeURIComponent(imdbRating)} </h3>
            </div>
            
            <p class="running-time">${decodeURIComponent(Runtime)}</p>
            <p class="genres">${decodeURIComponent(Genre)}</p>
            
            <div class="remove-watchlist">
                <img src="images/remove.png"/>
                <p>Remove</p>
            </div>
            <p class="plot">${decodeURIComponent(Plot)}</p>
        </div>
    
        `
    }  
    watchlistEl.innerHTML = watchlistHtmlStr
    const emptyWatchlistEl = document.getElementById("empty-watchlist")
    if (watchlistEl.textContent.trim() === ""){
        
        emptyWatchlistEl.style.display = "block"
    }
    if(localMoviesData){
        emptyWatchlistEl.style.display = "none"
    }
}



async function handleSearch(){
    document.getElementById("empty-search").style.display = "none"
    showLoadingBar()
    const searchString = searchInput.value
    const res = await fetch(baseUrl + OMDB_KEY + searchQuery + searchString)
    const data = await res.json()

    if(data.Search) {   
        renderSearchResult(data.Search)
    }
    else{
        renderNoResults()
    }
}
async function renderSearchResult(movieList){
    let movieHtmlStr = ""
    for (let movie of movieList){
        const res = await fetch(baseUrl + OMDB_KEY + IdQuery + movie.imdbID)
        const movieInfo = await res.json()
        const {Poster, Title, Runtime, Genre, Plot, imdbRating, imdbID} = movieInfo
        movieHtmlStr += `
        <div class="movie"
            data-imdb-id=${imdbID}
            data-poster=${Poster}
            data-title=${encodeURIComponent(Title)}
            data-imdb-rating = ${encodeURIComponent(imdbRating)}
            data-runtime = ${encodeURIComponent(Runtime)}
            data-genre = ${encodeURIComponent(Genre)}
            data-plot = ${encodeURIComponent(Plot)}
        >
            <img class="movie-thumbnail" src=${Poster}/>
            <div class="movie-title">
                <h2> ${Title}</h2>
                <i class="fa-solid fa-star"></i>
                <h3> ${imdbRating} </h3>
            </div>
            
            <p class="running-time">${Runtime}</p>
            <p class="genres">${Genre}</p>
            
            <div class="add-to-watchlist">
                <img src="images/add.png"/>
                <p>Watchlist</p>
            </div>
            <p class="plot">${Plot}</p>
        </div>
        
        `
    }
    
    searchResultsEl.innerHTML = movieHtmlStr
}

function renderNoResults(){
    searchResultsEl.innerHTML = `
    <p>
    Unable to find what you’re looking for. Please try another search.
    </p>
    `
    
}
function showLoadingBar(){
    searchResultsEl.innerHTML = `
        <section id="loading-section">
            <img src="images/loading.gif"/>
            <p>Searching</p>
        </section>
        `
}
function addToWatchList(movieEl){
    const movieObject = getMovieObjectFromEl(movieEl)
    let localMoviesData = JSON.parse(localStorage.getItem("localMoviesData"))
    let movieDataToWrite
    
    if (localMoviesData){
        if(movieExistsInLocalStorage(movieObject.imdbId, localMoviesData)){
            showAlreadyExistsMessage()
            return
        }
        localMoviesData.push(movieObject)
        movieDataToWrite = localMoviesData
    }
    else {
        movieDataToWrite = [movieObject]
    }

    localStorage.setItem("localMoviesData", JSON.stringify(movieDataToWrite))

    showAddedToWatchlistMessage()
}
function movieExistsInLocalStorage(imdbId, localMoviesData){
    const filteredArray = localMoviesData.filter(movie => movie.imdbId === imdbId)
    if(filteredArray.length > 0){
        return true
    }
    if(filteredArray.length === 0){
        return false
    }
}
function removeFromWatchlist(movieEl){
    const movieIdToRemove = movieEl.dataset.imdbId
    let localMoviesData = JSON.parse(localStorage.getItem("localMoviesData"))
    const movieDataToWrite = localMoviesData.filter(movie => 
        movie.imdbId != movieIdToRemove)
    localStorage.setItem("localMoviesData", JSON.stringify(movieDataToWrite))
    renderWatchlist()
}

function showAddedToWatchlistMessage() {
    const messageElement = document.createElement("div")
    messageElement.id = "addedToWatchlistMessage"
    messageElement.textContent = "Added to Watchlist"
    const emptySearchEl = document.getElementById("empty-search")
    emptySearchEl.parentNode.insertBefore(messageElement, emptySearchEl.nextSibling)
    setTimeout(function() {
        messageElement.style.display = "none"
    }, 3000);
}

function showAlreadyExistsMessage(){
    const messageElement = document.createElement("div")
    messageElement.id = "alreadyExistsMessage"
    messageElement.textContent = "Movie already exists in watchlist"
    const emptySearchEl = document.getElementById("empty-search")
    emptySearchEl.parentNode.insertBefore(messageElement, emptySearchEl.nextSibling)
    setTimeout(function() {
        messageElement.style.display = "none"
    }, 3000);  
}

function getMovieObjectFromEl(movieEl){
    const movieObject = {
        imdbId: movieEl.dataset.imdbId,
        Poster: movieEl.dataset.poster,
        Title: movieEl.dataset.title,
        imdbRating: movieEl.dataset.imdbRating,
        Runtime: movieEl.dataset.runtime,
        Genre: movieEl.dataset.genre,
        Plot: movieEl.dataset.plot
    }   
    return movieObject
}

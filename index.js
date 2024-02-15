const searchBtn = document.getElementById("search-btn")
const searchInput = document.getElementById("movie-input")
const OMDB_KEY = "2c3092e4"
const baseUrl = "http://www.omdbapi.com/?apikey="
const searchQuery = "&s="
const parameterQuery = "&plot=short"
const IdQuery = "&i="
const fullPlotQuery = `&plot=full`

searchBtn.addEventListener("click", handleSearch)

async function handleSearch(){
    const searchString = searchInput.value
    const res = await fetch(baseUrl + OMDB_KEY + searchQuery + searchString)
    const data = await res.json()
    renderSearchResult(data.Search)
}
async function renderSearchResult(movieList){
    console.log( movieList)
    let movieHtmlStr = ""
    for (let movie of movieList){
        const res = await fetch(baseUrl + OMDB_KEY + IdQuery + movie.imdbID)
        const movieInfo = await res.json()
        const {Poster, Title, Runtime, Genre, Plot, imdbRating} = movieInfo
        movieHtmlStr += `
        <div class="search-result">
            <img class="movie-thumbnail" src=${Poster}/>
            <div class="search-result-title">
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
    document.getElementById("search-results-section").innerHTML = movieHtmlStr
}
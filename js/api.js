let list = document.querySelector(".film__list");
let loader = document.querySelector(".loader");
let prevBtn = document.querySelector(".prev");
let nextBtn = document.querySelector(".next");
let filmTemplate = document.querySelector("#film-template").content;
let errorText = document.querySelector(".error-text");


let searchForm = document.querySelector(".js-form");
let searchInput = document.querySelector(".js-input");


let page = 1;
let input = "world";

function getData (input, page) {
    fetch(`http://www.omdbapi.com/?apikey=29b33c94&s=${input}&page=${page}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(page <= 1) {
            prevBtn.disabled = true;
        }

        if (page > 1) {
            prevBtn.disabled = false;
        }

        if(page == Math.ceil(data.totalResults / 10)) {
            nextBtn.disabled = true;
        }

        if(page < Math.ceil(data.totalResults / 10)) {
            nextBtn.disabled = false;
        }

        loader.style.display = "none";
        looping(data.Search)
    })
}

function looping (array) {

    if(array === undefined) {
        errorText.style.display = "block";
    }

    array.forEach(element => {
        renderFilms(element)    
    });
}

function renderFilms (object) {

    let elFilm = filmTemplate.cloneNode(true);
    elFilm.querySelector(".film__poster").src = object.Poster;
    elFilm.querySelector(".film__name").textContent = object.Title;

    errorText.style.display = "none";
    list.appendChild(elFilm)
}

// next pages function
function nextPage () {
    page += 1

    loader.style.display = "block";
    list.innerHTML = null;

    getData(input, page)
}


// previous pages function
function prevPage () {
    page -= 1
    loader.style.display = "block";
    list.innerHTML = null;

    getData(input, page)
}

// searchMovie function
function searchMovie (evt) {
    evt.preventDefault();

    input = searchInput.value;

    list.innerHTML = null;
    getData(input, page);
}

// pagination events
searchForm.addEventListener("submit", searchMovie)
nextBtn.addEventListener("click", nextPage);
prevBtn.addEventListener("click", prevPage);

getData(input, page)
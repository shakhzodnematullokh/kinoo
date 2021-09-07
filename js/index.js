// function that selects elements
let findElement = (selectorName) => document.querySelector(selectorName);

// element-generating function
let makeElement = (tagName) => document.createElement(tagName);

let genresArr = [];
let savedArr = JSON.parse(window.localStorage.getItem("saved")) || [];

// selected elements
let list = findElement(".film__list");
let genreList = findElement(".genre-select");
let searchForm = findElement(".js-form");
let searchInput = findElement(".js-input");
let sortSelectValue = findElement(".sort-select")
let filmTemplate = findElement("#film-template").content;
let modal = findElement(".modal");
let modalCloseBtn = findElement(".modal-btn");
let bookmarkBtn = findElement(".saved-btn");
let bookmarkModal = findElement(".bookmark-modal");
let bookmarkList = findElement(".bookmark-list");

// release date of movie
function date (data) {
    let hour = new Date(data).getHours();
    let minut = new Date(data).getMinutes();
    let second = new Date(data).getSeconds();

    let time = `${String(hour).padStart(2, "0")}:${String(minut).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
    return time;
}

// A - Z sort function
let sortAZ = function(a, b) {
    if(a.title > b.title) {
        return 1;
    }

    if(b.title > a.title) {
        return -1;
    }

    return 0;
}

// Z - A sort function
let sortZA = function(a, b) {
    if(a.title > b.title) {
        return -1;
    }

    if(b.title > a.title) {
        return 1;
    }

    return 0;
}

// New - Old sort function
let sortNewOld = function(a, b) {
    return a.release_date - b.release_date;
}

// Old - New sort function
let sortOldNew = function(a, b) {
    return b.release_date - a.release_date;
}

// Sorts object function
let sortFunctions = {
    0: sortAZ,
    1: sortZA,
    2: sortNewOld,
    3: sortOldNew
}

// movie maker function
function createBox (film) {
    let elFilm = filmTemplate.cloneNode(true);
    elFilm.querySelector(".film__poster").src = film.poster;
    elFilm.querySelector(".film__name").textContent = film.title;

    film.genres.forEach(genre => {
        let newGenreLi = makeElement("li");
        newGenreLi.textContent = genre;
        elFilm.querySelector(".film__genre").appendChild(newGenreLi);
    })

    elFilm.querySelector(".film__time").textContent = date(film.release_date);
    elFilm.querySelector(".film__btn").dataset.id = film.id;
    elFilm.querySelector(".film__save-btn").dataset.id = film.id;

    list.appendChild(elFilm)
}

// genre output function
function getGenres (movie) {
    movie.genres.forEach (genre => {
        if(!genresArr.includes(genre)) {
            genresArr.push(genre);

            let genreOption = makeElement("option");
            genreOption.textContent = genre;
            genreOption.value = genre;
            genreList.appendChild(genreOption);
        }
    })
}

// search movie function
function searchMovie (event) {
    event.preventDefault();
    list.innerHTML = "";

    let genreSelectValue = genreList.value;
    let searchInputvalue = searchInput.value.trim();
    let sortValue = sortSelectValue.value;

    let newRegExp = new RegExp(searchInputvalue, "gi");
    
    let foundFilms = films.filter(function (film) {
        if (genreSelectValue === "All") {
            return film;
        }

        return film.genres.includes(genreSelectValue);
    }).filter (kino => {
        return kino.title.match(newRegExp);
    }).sort(sortFunctions[sortValue]);

    foundFilms.forEach(film => createBox(film));
    
}

films.forEach(film => {
    createBox(film);
    getGenres(film);
})

let bookmarkTemplate = findElement(".bookmark-template").content;
let bookmarkFragment = document.createDocumentFragment();


// saved movie function
function renderSaved (savedMovie) {
    let elBookmark = bookmarkTemplate.cloneNode(true);

    elBookmark.querySelector(".movie-name").textContent = savedMovie.title;
    elBookmark.querySelector(".movie-remove-btn").dataset.id = savedMovie.id;

    bookmarkFragment.appendChild(elBookmark)
}

searchForm.addEventListener("submit", searchMovie)

list.addEventListener("click", function (event){
    if (event.target.matches(".film__btn"))
        modal.classList.add("modal--open");

        let foundMovie = films.find((movie) => movie.id === event.target.dataset.id)
        
        modal.querySelector(".modal-name").textContent = foundMovie.title;
        modal.querySelector(".modal-text").textContent = foundMovie.overview;


    //    modal close functions
        document.addEventListener("keyup", function(event) {
            if (event.keyCode === 27) {
                modal.classList.remove("modal--open")
            }
        })

        modal.addEventListener("click", function(event) {
            if(event.target === modal)
                modal.classList.remove("modal--open")
        })

        modalCloseBtn.addEventListener("click", function() {
            modal.classList.remove("modal--open")
        })

    if(event.target.matches(".film__save-btn")) {
        let foundMovie = films.find((movie) => movie.id === event.target.dataset.id)

        if (!savedArr.includes(foundMovie))
            savedArr.push(foundMovie)

            window.localStorage.setItem("saved", JSON.stringify(savedArr))

        bookmarkList.innerHTML = null;

        savedArr.forEach(movie => renderSaved(movie))
        
        bookmarkList.appendChild(bookmarkFragment);
    }
})

savedArr.forEach(movie => renderSaved(movie))
bookmarkList.appendChild(bookmarkFragment);

// bookmark

bookmarkBtn.addEventListener("click", function() {
    bookmarkModal.classList.add("modal--open");
    
    bookmarkModal.addEventListener("click", function(event) {
        if(event.target === bookmarkModal)
            bookmarkModal.classList.remove("modal--open");
    })

    document.addEventListener("keyup", function(event) {
        if (event.keyCode === 27) {
            bookmarkModal.classList.remove("modal--open")
        }
    })
})

bookmarkList.addEventListener("click", function(event) {
    if (event.target.matches(".movie-remove-btn")) {
        let foundIndex = savedArr.findIndex(item => item.id === event.target.dataset.id)
        
        savedArr.splice(foundIndex, 1)

        savedArr.forEach(movie => renderSaved(movie))

        bookmarkList.innerHTML = null;
        bookmarkList.appendChild(bookmarkFragment);

        window.localStorage.setItem("saved", JSON.stringify(savedArr))
    }
})
// @ts-nocheck
"use strict";

let images = []
let originUrl = "https://api.themoviedb.org/3/"
let imageUrl = 'https://image.tmdb.org/t/p/original'
let apiKey = "?api_key=1dba575db6b3c4b61cea77ef1f176bb2"
let typeList
let bodyOverlay = document.querySelector(".body-container")


// **********************************************************************************
// *********************** Start All Functions **************************************
// **********************************************************************************

// Random number function
const GenerateRandomNumber = (number) => {
    return Math.floor(Math.random() * number)
}

// Add trending images
const addTrendingImages = (poster) => {
    return `<li class="trending-li">
                <div class="uk-panel">
                    <img loading="lazy" class="slider-img" src="${imageUrl}${poster}" alt="">
                </div>
            </li>`
}

// Insert casting card
const insertCastingCard = (poster, name, biography, imdb) => {
    return `<li class="cast">
                <div class="uk-panel">
                    <div class="cast-img">
                        <img loading="lazy" class="slider-img" src="${imageUrl}${poster}" alt="">
                    </div>
                    <div class="cast-info mx-3">
                        <h3 class="text-white card-head">${name}</h3>
                        <hr class="cast-hr" />
                        <p class="cast-p">
                            ${biography || 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus, necessitatibus'} 
                        </p>
                            <div class="text-end m-2">
                                <a href='https://www.imdb.com/name/${imdb}/' target="_blank"><i class="fab fa-imdb fa-3x"></i></a>
                            </div>
                    </div>
                </div>
            </li>`
}

// Insert Movies list
const insertMoviesList = (name, id) => {
    return `<div class="movies-type mt-5">
                <h2 class="section-head text-white">${name}</h2>
                <div class="uk-position-relative ${name} uk-visible-toggle uk-light" tabindex="-1" uk-slider>
                    <ul class="uk-slider-items movie-container my-5 type-list${id} uk-child-width-1-2 uk-child-width-1-5@m uk-grid"></ul>
                    <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
                    <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>
                </div>
            </div>
            <hr class="movies-hr" />`
}

// Insert poster for movies list
const insertPosterForMoviesList = (poster, id) => {
    return `<li class="movie-card text-center">
                <a class="single-movie" href="single.html">
                    <div class="uk-panel">
                        <img loading="lazy" id="${id}" src="${imageUrl}${poster}" alt="">
                    </div>
                </a>
            </li>`
}

// Get movie casting
const movieCasting = (data) => {
    return `<h2 class="single-head">${data.title}</h2>
            <div class="d-flex">
                <div id="rateYo" class="d-flex flex-column justify-content-center me-2"></div>
                <span class="movie-date text-white fs-5">${data.date}</span>
            </div>
            <p class="text-white fs-4 mt-4">
                Statting: <span class="cast">${data.first_actor}</span> / <span class="cast">${data.second_actor}</span>
            </p>
            <p class="my-4 text-white fs-3 w-50 fw-bolder"> Introduction:
                <span class="introduction fw-normal fs-5">${data.overview}</span>
            </p>`
}


// Set Background Trailer
const backgroundTrailer = (key) => {
    return `<iframe
                class="background-trailer"
                src="https://www.youtube.com/embed/${key}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
                allowfullscreen>
            </iframe>`
}


// Add Related Movies
const relatedMoviesFun = (obj) => {
    console.log("object : ", obj);
    return `<li>
                <a class="single-movie" href="single.html">
                    <div class="uk-panel h-100">
                        ${obj.poster_path ? `<img loading="lazy" id="${obj.id}" class="h-100 w-100" src="${imageUrl}${obj.poster_path}" alt="" />`
            : `<img loading="lazy" id="${obj.id}" class="h-100 w-100" src="img/default.png" alt="default" />`}
                    </div>
                    <h3 title="${obj.title}" class="uk-card-title mt-3 text-center fs-4">
                    ${obj.title}
                    </h3>
                </a>
            </li>`}


// Insert related movies
const insertRelatedMovies = (fun) => {
    document.querySelector(".related-list").insertAdjacentHTML('beforeend', fun)
}

// **********************************************************************************
// *********************** End All Functions **************************************
// **********************************************************************************




// Set Background for home page
setTimeout(() => {
    bodyOverlay.style.background = `url('${imageUrl}${images[GenerateRandomNumber(19)]}')`;

}, 2000);

// Random Background for home page
setInterval(() => {
    bodyOverlay.style.background = `url('${imageUrl}${images[GenerateRandomNumber(images.length)]}')`;
}, 10000);



let worker
let allCastingId = new Set()
let trendingData = new Set()
let castingData = new Set()
let castingDataInfo = new Set()
let moviesCatagoriesData = new Set()
let categoryMoviesData = new Set()
let singleData = []

worker = new Worker('/js/worker.js')

worker.postMessage({ title: "trending", data: null });
worker.postMessage({ title: "casting", data: null });
worker.postMessage({ title: "moviesCatagories", data: null });
// worker.postMessage({ title: "movieInfo", data: null });





worker.addEventListener('message', e => {

    let i = 0
    let res = e.data
    let title = e.data.title

    // console.log("return message data : ", res);
    // console.log("return message title : ", title);


    switch (title) {
        case 'trending':
            trendingData = res.data
            // console.log("incoming trending : ", trendingData);
            // while (i < dataTrending.length) {
            //     trendingData.add(dataTrending[i])
            //     i++
            // }
            break;

        case 'casting':
            castingData = res.data
            // let dataCasting = res.data.results
            // while (i < dataCasting.length) {
            //     castingData.add(dataCasting[i])
            //     i++
            // }
            break;

        case 'castingInfo':
            let dataCastingInfo = res.data
            while (i < dataCastingInfo.length) {
                castingDataInfo.add(dataCastingInfo[i])
                i++
            }
            break;

        case 'moviesCatagories':
            moviesCatagoriesData = res.data
            break;
        case 'movieInfo':
            singleData.push(res.data)
            // console.log("single movie data from out side : ", singleData);
            break;
        // case 'casting':

        // break;
        default:
            break;
    }
})


// Get all trending 
setTimeout(() => {
    trendingData.forEach(el => {
        document.querySelector(".trending").insertAdjacentHTML('beforeend',
            addTrendingImages(el.backdrop_path)
        )
    });

    castingData.forEach(el => {
        allCastingId.add(el.id)
    })
    worker.postMessage({ title: "castingInfo", data: allCastingId })

    setTimeout(() => {
        castingDataInfo.forEach(el => {
            document.querySelector(".casting").insertAdjacentHTML('beforeend',
                insertCastingCard(el.profile_path, el.name, el.biography, el.imdb_id))
        })
    }, 2000);

    // Get all movies catagories
    moviesCatagoriesData.forEach(el => {
        loadCategoryMovies(el.name, el.id, el.data)
    });
    worker.postMessage({ title: "categoryMovies", data: moviesCatagoriesData });

}, 1000);





// Load Catagories movies
const loadCategoryMovies = (name, id, data) => {
    document.querySelector(".movies-list").insertAdjacentHTML('beforeend',
        insertMoviesList(name, id))
    typeList = document.querySelector(`.type-list${id}`)

    data.forEach(movie => {
        typeList.insertAdjacentHTML('beforeend', insertPosterForMoviesList(movie.poster_path, movie.id))
    })

    setTimeout(() => {
        document.querySelectorAll(".not-load").forEach(el => {
            el.classList.remove("not-load")
        })
        document.querySelector(".scaling-squares-spinner").classList.add("not-load")
    }, 6000);
}

// Store movie id in localStorage
setTimeout(() => {
    let movieId = document.querySelectorAll(".single-movie")
    movieId.forEach(item => {
        item.addEventListener("click", e => {
            localStorage.setItem("movieID", e.target.id)


        })
    })
}, 1000);


// Run Trailer in single page background
const player = new Plyr('#player', {
    controls: [],
    muted: true,
    loop: { active: true }
});

// Make the trailer play 
player.on('ready', (event) => {
    // event.path[0].click()
});

// Get movie id from localStorage
let movieIdFromStorage = localStorage.getItem('movieID')
worker.postMessage({ title: "movieInfo", data: movieIdFromStorage });
let rating

setTimeout(() => {
    let allData = singleData[0].data
    let relatedMovies = singleData[0].related
    document.querySelector(".single-info-top").insertAdjacentHTML('beforeend', movieCasting(allData))
    let rateObject = {
        rating: allData.rate,
        starWidth: "20px",
        halfStar: true,
        readOnly: true
    }
    $(function () {
        $("#rateYo").rateYo(rateObject);
    });
    document.querySelector(".imdb-link").setAttribute("href", `https://www.imdb.com/title/${allData.imdb}`)
    document.querySelector(".plyr__video-embed").insertAdjacentHTML("beforeend", backgroundTrailer(allData.trailer))
    document.querySelector(".trailer-id").setAttribute("src", `https://www.youtube-nocookie.com/embed/${allData.trailer}`)
    relatedMovies.forEach(el => {
        insertRelatedMovies(relatedMoviesFun(el))
    })
}, 1000);


// Get all movie info
// axios.get(`${originUrl}movie/${movieIdFromStorage}${apiKey}&language=en-US`)
//     .then(res => {
//         let movieData = res.data
//         rating = +(movieData.vote_average / 2).toFixed(1)

//         // Get all casting for the movie
//         axios.get(`${originUrl}movie/${movieData.id}/credits${apiKey}&language=en-US`)
//             .then(res => {
//                 let castData = res.data.cast
//                 document.querySelector(".single-info-top").insertAdjacentHTML('beforeend', movieCasting(movieData.original_title, movieData.release_date, castData[0].name, castData[1].name, movieData.overview))

//                 // Set movie’s rating
//                 let rateObject = {
//                     rating: rating,
//                     starWidth: "20px",
//                     halfStar: true,
//                     readOnly: true
//                 }

//                 $(function () {
//                     $("#rateYo").rateYo(rateObject);
//                 });
//             })

//         document.querySelector(".imdb-link").setAttribute("href", `https://www.imdb.com/title/${movieData.imdb_id}`)
//         axios.get(`${originUrl}movie/${movieData.id}/videos${apiKey}&language=en-US`)
//             .then(res => {
//                 // console.log(res);
//                 let trailer = res.data.results[0]
//                 document.querySelector(".plyr__video-embed").insertAdjacentHTML("beforeend", backgroundTrailer(trailer.key))
//                 document.querySelector(".trailer-id").setAttribute("src", `https://www.youtube-nocookie.com/embed/${trailer.key}`)
//             })


//         // Get related Movies
//         axios.get(`${originUrl}movie/${movieData.id}/similar${apiKey}&language=en-US&page=1`)
//             // axios.get(`${originUrl}movie/${movieData.id}/recommendations${apiKey}&language=en-US&page=1`)
//             .then(res => {
//                 let relatedMovies = res.data.results


//                 relatedMovies.forEach(item => {
//                     let relatedObject = {
//                         id: item.id,
//                         poster: null,
//                         title: item.title,
//                     }
//                     relatedObject.poster = item.poster_path || null
//                     insertRelatedMovies(relatedMoviesFun(relatedObject))
//                 })
//             })
//     })


























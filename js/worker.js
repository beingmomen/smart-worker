let originUrl = "https://api.themoviedb.org/3/"
let apiKey = "?api_key=1dba575db6b3c4b61cea77ef1f176bb2"


self.addEventListener('message', e => {
    let i = 0
    let data = e.data.data
    let title = e.data.title



    // console.log("data : ", data);


    switch (title) {
        case 'trending':
            let trendingApi = `${originUrl}trending/all/day${apiKey}`
            let trendingData = new Set()
            fetch(trendingApi)
                .then(res => res.json())
                .then(res => {
                    let data = res.results
                    // console.log("trending res : ", data);
                    while (i < data.length) {
                        trendingData.add(data[i])
                        i++
                    }
                    // console.log("ok ok");
                    self.postMessage({ title: 'trending', data: trendingData })
                })
            break;

        case 'casting':
            let castingApi = `${originUrl}person/popular${apiKey}&language=en-US&page=1`
            let castingData = new Set()
            fetch(castingApi)
                .then(res => res.json())
                .then(res => {
                    let data = res.results

                    while (i < data.length) {
                        castingData.add(data[i])
                        i++
                    }
                    self.postMessage({ title: 'casting', data: castingData })
                })
            break;

        case 'castingInfo':
            let castingInfo = []
            data.forEach(el => {
                fetch(`${originUrl}person/${el}${apiKey}&language=en-US`)
                    .then(res => res.json())
                    .then(res => {
                        console.log("castingInfo res : ", res);
                        // castingInfo.push(res)
                        let dataCastingInfo = res.data
                        while (i < dataCastingInfo.length) {
                            castingDataInfo.add(dataCastingInfo[i])
                            i++
                        }
                    })
                    .then(() => {
                        if (castingInfo.length == 20) {
                            self.postMessage({ title: "castingInfo", data: castingInfo })
                        }

                    })
            });
            break;

        case 'moviesCatagories':
            let moviesCatagoriesApi = `${originUrl}genre/movie/list${apiKey}&language=en-US`
            let allCategoriesData = new Set()
            fetch(moviesCatagoriesApi)
                .then(res => res.json())
                .then(res => {
                    let allCategories = res.genres
                    allCategories.forEach((category, i) => {
                        fetch(`${originUrl}genre/${category.id}/movies${apiKey}&language=en-US&include_adult=false&sort_by=created_at.asc`)
                            .then(res => res.json())
                            .then(res => {
                                allCategoriesData.add({ id: res.id, name: category.name, data: res.results })
                                if (i == 18) {
                                    self.postMessage({ title: "moviesCatagories", data: allCategoriesData })
                                }
                            })


                    })
                })
            break;
        case 'movieInfo':

            let movieIdFromStorage = data
            let movieData = {}
            let relatedMovies = []

            fetch(`${originUrl}movie/${movieIdFromStorage}${apiKey}&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    movieData.rate = +(res.vote_average / 2).toFixed(1)
                    movieData.title = res.original_title
                    movieData.date = res.release_date
                    movieData.id = res.id
                    movieData.overview = res.overview
                    movieData.imdb = res.imdb_id

                    return res.id
                })
                .then(id => {
                    fetch(`${originUrl}movie/${id}/credits${apiKey}&language=en-US`)
                        .then(res => res.json())
                        .then(res => {
                            movieData.first_actor = res.cast[0].name
                            movieData.second_actor = res.cast[1].name
                            // console.log("credit res :", movieData);
                        })

                    return id
                })
                .then(id => {
                    fetch(`${originUrl}movie/${id}/videos${apiKey}&language=en-US`)
                        .then(res => res.json())
                        .then(res => {
                            movieData.trailer = res.results[3]?.key || res.results[0]?.key
                            // console.log("res youtube : ", movieData);
                        })

                    return id
                })
                .then(id => {
                    fetch(`${originUrl}movie/${id}/similar${apiKey}&language=en-US&page=1`)
                        .then(res => res.json())
                        .then(res => {
                            relatedMovies = res.results
                            self.postMessage({ title: "movieInfo", data: { data: movieData, related: relatedMovies } })
                        })
                })




            break;
        // case '':
        //     break;
        default:
            break;
    }

})
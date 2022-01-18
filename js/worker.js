let originUrl = "https://api.themoviedb.org/3/"
let apiKey = "?api_key=1dba575db6b3c4b61cea77ef1f176bb2"


self.addEventListener('message', e => {
    let data = e.data.data
    let title = e.data.title



    // console.log("data : ", data);


    switch (title) {
        case 'trending':
            let trendingApi = `${originUrl}trending/all/day${apiKey}`
            fetch(trendingApi)
                .then(res => res.json())
                .then(res => {
                    self.postMessage({ title: 'trending', data: res })
                })
            break;

        case 'casting':
            let castingApi = `${originUrl}person/popular${apiKey}&language=en-US&page=1`
            fetch(castingApi)
                .then(res => res.json())
                .then(res => {
                    self.postMessage({ title: 'casting', data: res })
                })
            break;

        case 'castingInfo':
            let castingInfo = []
            data.forEach(el => {
                fetch(`${originUrl}person/${el}${apiKey}&language=en-US`)
                    .then(res => res.json())
                    .then(res => {
                        castingInfo.push(res)
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
            fetch(moviesCatagoriesApi)
                .then(res => res.json())
                .then(res => {
                    self.postMessage({ title: "moviesCatagories", data: res })
                })
            break;

        case 'categoryMovies':
            let categoryMovies = new Set()
            data.forEach(el => {
                fetch(`${originUrl}genre/${el.id}/movies${apiKey}&language=en-US&include_adult=false&sort_by=created_at.asc`)
                    .then(res => res.json())
                    .then(res => {
                        res.category_name = el.name
                        // console.log("res : ", res.results);
                        categoryMovies.add(res.results)

                        // console.log("categoryMovies : ", categoryMovies);
                    })
                    .then(() => {
                        if (categoryMovies.size == 19) {
                            self.postMessage({ title: "categoryMovies", data: categoryMovies })
                        }
                    })
            })


            setTimeout(() => {
                console.log("object : ", categoryMovies);
                categoryMovies.forEach(el => {
                    console.log("el el : ", el);
                })
            }, 1000);

            break;
        default:
            break;
    }

})
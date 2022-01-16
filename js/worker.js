let originUrl = "https://api.themoviedb.org/3/"
let apiKey = "?api_key=1dba575db6b3c4b61cea77ef1f176bb2"


self.addEventListener('message', e => {
    let data = e.data


    switch (data) {
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
            // console.log("data data : ", e);
            break;
        case 'moviesCatagories':
            let moviesCatagoriesApi = `${originUrl}genre/movie/list${apiKey}&language=en-US`
            fetch(moviesCatagoriesApi)
                .then(res => res.json())
                .then(res => {
                    let moviesCatagoriesSet = new Set()
                    console.log("moviesCatagoriesApi : ", res.genres);

                    for (const [key, value] of res) {
                        console.log("value: ", value);
                    }
                    self.postMessage({ title: "moviesCatagories", data: res.genres })
                })
            break;
        default:
            break;
    }

})
class DataService{

    /**
     * get available languages
     * @param {Function=} done
     * @param {Function=} err
     * @param {string} youtubeID
     */
    getAvailableLangs(done, err, youtubeID){

        let url = 'https://video.google.com/timedtext?type=list&v=' + youtubeID;

        //disable cache
        var myHeaders = new Headers({
            //'Access-Control-Allow-Origin':'*',
            //'Content-Type': 'multipart/form-data'
            'content-type': 'application/json'
        });

        //myHeaders.append('pragma', 'no-cache');
        //myHeaders.append('cache-control', 'no-cache');

        fetch(url, {
            method: 'GET',
            mode: 'cors',
            //headers: myHeaders,
            //credentials: 'omit' //'same-origin', 'include', 'omit'
        })
            //.then(res => res.json())
            .then(data => {
                console.log(data);
                done(data);
            })
            .catch(function(err) {
                console.log('Youtube Extenstion - getAvailableLangs:', err);
                err();
            });
    }
}

export default new DataService();
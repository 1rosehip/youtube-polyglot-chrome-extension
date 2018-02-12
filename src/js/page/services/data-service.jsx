class DataService{

    /**
     * get data from db and update state
     * @param {Function=} done
     * @param {Function=} err
     * @param {string=} purl
     * @param {string} type - shared / private / cart
     */
    updateData(done, err, purl, type){

        let url = 'aaa.ashx';
        url += this.getQSData(purl, type);

        //disable cache
        var myHeaders = new Headers();
        myHeaders.append('pragma', 'no-cache');
        myHeaders.append('cache-control', 'no-cache');

        fetch(url, {
            method: 'GET',
            headers: myHeaders,
            credentials: 'same-origin' //'include', 'omit'
        })
            .then(res => res.json())
            .then(data => {

                if(data && !data.IsValid){
                    err(data.StatusCode);
                }
                else {
                    done(data);
                }
            })
            .catch(function(err) {
                err();
            });
    }
}

export default new DataService();
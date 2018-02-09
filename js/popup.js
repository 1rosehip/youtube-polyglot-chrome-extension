(function($){
    'use strict';

    /**
     * init events
     */
    var initEvents = function(){

        $('#test').on('click', function(){
            console.log('here');
        });
    };

    /**
     * on DOM ready
     */
    $(document).ready(function(){

        //init events
        initEvents();

        console.log('load');
        console.log($('#test').length);
        //console.log($('body').html());
    });

})(jQuery);


//api
//https://stackoverflow.com/questions/16470152/closed-captions-in-youtube-as-json

//question about this
//https://stackoverflow.com/questions/23665343/get-closed-caption-cc-for-youtube-video

//how to use name
//https://stackoverflow.com/questions/46864428/how-do-some-sites-download-youtube-captions

//srt to json
//https://gist.github.com/mateogianolio/18a0db136d403b380049

//xml to json and back
//http://goessner.net/download/prj/jsonxml/
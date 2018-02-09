(function($){
    'use strict';

    /**
     * restore the settings from the storage
     */
    var restoreSettings = function(){

        chrome.storage.sync.get('location', function(item){

            if(item){
                var location = Number(item.location) || 0;
                $('input[name="location"][value="' + location + '"]').prop('checked', true);
            }
        });
    };

    /**
     * init events
     */
    var initEvents = function(){

        $('input[name="location"]').on('change', function(){

            var locationID = Number($(this).val()) || 0;

            //save the location in the storage
            chrome.storage.sync.set({
                location: locationID
            });

            //change the location in UI
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs){

                if(tabs && tabs.length > 0){

                    chrome.tabs.sendMessage(tabs[0].id, {
                        'message': 'location',
                        'location': locationID
                    });
                }
            });
        });
    };

    /**
     * on DOM ready
     */
    $(document).ready(function(){

        //init events
        initEvents();

        //restore the settings from the storage
        restoreSettings();
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
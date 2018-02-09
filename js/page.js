(function($){
    'use strict';

    /* ========================= GLOBALS ========================= */
    var loadTries = 0;
    var LOAD_TRIES_MAX = 10;
    var loadStep = 1000;

    /* ========================= LANGUAGES : RENDER ========================= */

    /**
     * render available languages
     * @param {object} srt
     * <transcript_list docid="1006270815148311521">
     *     <track id="0" name="" lang_code="es" lang_original="Español" lang_translated="Spanish"/>
     * </transcript_list>
     */
    var renderAvailableLangs = function(srt){

        var $tracks = $(srt).find('track');

        if($tracks.length > 0) {

            var $langs = $('<div class="yl-chrome-ext-langs"><div class="yl-chrome-ext-btns" data-type="yl-chrome-ext-btns"></div><div class="yl-chrome-ext-tabs" data-type="yl-chrome-ext-tabs"></div></div>');
            var $btns = $langs.find('[data-type="yl-chrome-ext-btns"]');

            $tracks.each(function () {

                var $this = $(this);

                var id = $this.attr('id');
                var name = $this.attr('name');
                var lang_code = $this.attr('lang_code');
                var lang_original = $this.attr('lang_original');
                var lang_translated = $this.attr('lang_translated');

                var html = '<div class="yl-chrome-ext-lang-btn" data-type="yl-chrome-ext-lang-btn" data-code="' + lang_code + '">' + lang_original + '</div>';

                $btns.append($(html));
            });

            chrome.storage.sync.get('location', function (options) {

                var path = '#related';

                if (options && options.location === 1) {
                    path = '#info';
                }

                $(path).prepend($langs);
            });
        }
    };

    /**
     * get HTML of save / remove button
     * @param {string} langCode
     * @param {number} startTime
     * @return {string}
     */
    var getSavedRemveHTML = function(langCode, startTime){

        var html = '';
        html += '<span class="yl-chrome-ext-saved-remove">';
        html += '<span class="yl-chrome-ext-saved-item">Saved</span>';
        html += '<span class="yl-chrome-ext-remove-item" data-type="yl-chrome-ext-remove-item" data-code="' + langCode + '" data-start="' + startTime + '">Remove</span>';
        html += '</span>';
        return html;
    };

    /**
     * get save item button HTML
     * @param {string} langCode
     * @param {number} startTime
     * @return {string}
     */
    var getSaveBtnHTML = function(langCode, startTime){

        return '<a href="#" title="" class="yl-chrome-ext-save-srt" data-type="yl-chrome-ext-save-srt" data-start="' + startTime + '" data-code="' + langCode + '">Save</a>';
    };

    /**
     * render the specified language
     * @param {object} srt
     * @param {string} langCode
     * <transcript>
     *     <text start="51.692" dur="1.416">Hola</text>
     *     <text start="55.266" dur="0.72">Muy bien</text>
     *     <text start="56.968" dur="1.609">Gracias, &amp;quot;Marica&amp;quot;. Como estas??</text>
     *     <text start="61.531" dur="0.74">Perdon</text>
     * </transcript>
     */
    var renderLang = function(srt, langCode){

        var youtubeID = getParameterByName('v');

        //get from storage
        chrome.storage.sync.get('savedSubtitles', function(savedSubtitles){

            var videoSubtitles = [];

            if(savedSubtitles && savedSubtitles.savedSubtitles[youtubeID] && savedSubtitles.savedSubtitles[youtubeID].length > 0){
                videoSubtitles = savedSubtitles.savedSubtitles[youtubeID];
            }

            var $langContent = $('<div class="yl-chrome-ext-lang-content" data-type="yl-chrome-ext-lang-content" data-code="' + langCode + '"></div>');

            $(srt).find('text').each(function(index){

                var $this = $(this);

                var start = Number($this.attr('start')) || 0;
                var dur = Number($this.attr('dur')) || 0;
                var end = start + dur;
                var content = $this.text();

                //is this item saved?
                var savedItem = findSavedSubtitle(videoSubtitles, start, langCode);

                var html = '';
                html += '<div class="yl-chrome-ext-srt-item" data-type="yl-chrome-ext-srt-item" data-start="' + start + '">';

                html += '<div class="yl-chrome-ext-srt-item-top">';
                html += '<span>' + index + '). ' + start.toFixed(3) + ' - ' + end.toFixed(3) + '</span>';

                if(savedItem){
                    html += getSavedRemveHTML(langCode, start);
                }
                else{
                    html += getSaveBtnHTML(langCode, start);
                }

                html += '</div>';

                html += '<div class="yl-chrome-ext-srt-item-content">' + content + '</div>';
                html += '</div>';

                $langContent.append($(html));
            });

            var $tabs = $('[data-type="yl-chrome-ext-tabs"]');
            $tabs.append($langContent);
        });
    };

    /* ========================= LANGUAGES : GET DATA ========================= */

    /**
     * get available languages
     * @param {string} youtubeID
     */
    var getAvailableLangs = function(youtubeID){

        //find srt with the available languages data
        $.ajax({
            url: 'https://video.google.com/timedtext?type=list&v=' + youtubeID,
            cache: false
        })
            .done(function(response) {

                //render available languages
                renderAvailableLangs(response);
            })
            .fail(function (err) {
                console.log('Youtube Extenstion - getAvailableLangs:', err);
            });
    };

    /**
     * get language data
     * @param {string} youtubeID
     * @param {string} langCode
     * @param {Function} callback
     */
    var getLangData = function(youtubeID, langCode, callback){

        var $langBtn = $('[data-type="yl-chrome-ext-lang-btn"][data-code="' + langCode + '"]');
        var isLoaded = $langBtn.data('data-loaded');

        if(!isLoaded) {
            var langName = $langBtn.text();

            $langBtn.text('Loading...');

            $.ajax({
                url: 'https://video.google.com/timedtext?lang=' + langCode + '&v=' + youtubeID,
                cache: false
            })
            .done(function (response) {

                $langBtn.data('data-loaded', true);
                renderLang(response, langCode);
            })
            .fail(function (err) {
                console.log('Youtube Extenstion - getLangData:', err);
            })
            .always(function () {
                $langBtn.text(langName);
                callback();
            });
        }
        else{
            callback();
        }
    };

    /* ========================= SUBTITLES DATA ACTIONS ========================= */

    /**
     * find saved subtitle
     * @param {Array.<object> videoSubtitles}
     * @param {number} startTime
     * @param {string} langCode
     * @return {object}
     */
    var findSavedSubtitle = function(videoSubtitles, startTime, langCode){

        for(var i=0; i<videoSubtitles.length; i++){

            if(videoSubtitles[i].start === startTime && videoSubtitles[i].lang === langCode){
                return videoSubtitles[i];
            }
        }

        return null;
    };

    /**
     * save subtitles
     * @param {number} startTime
     * @param {string} text
     * @param {string} langCode
     * savedSubtitles = {
     *    youtubeID: [
     *      {}, {}, {}, ...
     *    ]
     * }
     */
    var saveSubtitles = function(startTime, text, langCode){

        var youtubeID = getParameterByName('v');

        //get from storage
        chrome.storage.sync.get(function(options){

            var savedSubtitles = options.savedSubtitles || {};
            var isFound = false;

            if(!savedSubtitles[youtubeID]){
                savedSubtitles[youtubeID] = [];
            }

            for(var i=0; i<savedSubtitles[youtubeID].length; i++){

                if(savedSubtitles[youtubeID][i].start === startTime && savedSubtitles[youtubeID][i].lang === langCode){
                    isFound = true;
                    break;
                }
            }

            if(!isFound) {
                savedSubtitles[youtubeID].push({
                    start: startTime,
                    text: text,
                    lang: langCode
                });
            }

            //save saves subtitles
            chrome.storage.sync.set({
                savedSubtitles: savedSubtitles
            });
        });
    };

    /**
     * remove saved subtitle
     * @param {number} startTime
     * @param {string} langCode
     */
    var removeSubtitle = function(startTime, langCode){

        var youtubeID = getParameterByName('v');

        //get from storage
        chrome.storage.sync.get(function(options){

            var savedSubtitles = options.savedSubtitles || {};
            var foundIndex = -1;

            if(!savedSubtitles[youtubeID]){
                savedSubtitles[youtubeID] = [];
            }

            for(var i=0; i<savedSubtitles[youtubeID].length; i++){

                if(savedSubtitles[youtubeID][i].start === startTime && savedSubtitles[youtubeID][i].lang === langCode){
                    foundIndex = i;
                    break;
                }
            }

            if(foundIndex !== -1) {

                savedSubtitles[youtubeID].splice(foundIndex, 1);

                //save saves subtitles
                chrome.storage.sync.set({
                    savedSubtitles: savedSubtitles
                });
            }

        });
    };

    /* ========================= COMMON ========================= */

    /**
     * get query string params
     * @param {string} name
     * @param {string} url
     * @returns {*}
     * Usage:
     * query string: ?foo=lorem&bar=&baz
     * var foo = getParameterByName('foo'); // "lorem"
     * var bar = getParameterByName('bar'); // "" (present with empty value)
     * var baz = getParameterByName('baz'); // "" (present with no value)
     * var qux = getParameterByName('qux'); // null (absent)
     */
    var getParameterByName = function(name, url) {

        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    /**
     * check if the page is already available
     * @param {Function} callback
     */
    var checkIfPageAvailable = function(callback){

        var $info = $('#info');

        if($info.length > 0){
            callback(true);
        }
        else{
            if(loadTries < LOAD_TRIES_MAX){

                window.setTimeout(function(){

                    loadTries++;

                    checkIfPageAvailable(callback);
                }, loadStep);
            }
            else{
                callback(false);
            }
        }
    };

    /**
     * init events
     */
    var initEvents = function(){

        /**
         * on language button click
         */
        $(document).on('click', '[data-type="yl-chrome-ext-lang-btn"]', function(e){

            e.preventDefault();

            var $this = $(this);
            var langCode = $this.attr('data-code');

            var isActive = $this.hasClass('yl-chrome-ext-active');

            if(isActive){

                //hide current tab
                $('[data-type="yl-chrome-ext-lang-content"][data-code="' + langCode + '"]').toggleClass('yl-chrome-ext-hidden');
            }
            else{
                $('[data-type="yl-chrome-ext-lang-btn"]').removeClass('yl-chrome-ext-active');
                $this.addClass('yl-chrome-ext-active');

                var youtubeID = getParameterByName('v');
                getLangData(youtubeID, langCode, function(){

                    //hide all tabs
                    $('[data-type="yl-chrome-ext-lang-content"]').addClass('yl-chrome-ext-hidden');

                    //show current tab
                    $('[data-type="yl-chrome-ext-lang-content"][data-code="' + langCode + '"]').removeClass('yl-chrome-ext-hidden');
                });
            }
        });

        /**
         * on srt item click
         */
        $(document).on('click', '[data-type="yl-chrome-ext-srt-item"]', function(e){

            e.preventDefault();

            var $this = $(this);
            var youtubeID = getParameterByName('v');
            var start = Number($this.attr('data-start')) || 0;
            //window.location.href = 'https://www.youtube.com/watch?v=' + youtubeID + '&t=' + start.toFixed(0);
            $('video').each(function(){
                $(this).get(0).currentTime = start;
            });
        });

        /**
         * on save subtitle btn click
         * saves: subtitle text
         * youtube video id
         * youtube video time
         */
        $(document).on('click', '[data-type="yl-chrome-ext-save-srt"]', function(e){

            e.preventDefault();

            var $this = $(this);
            var langCode = $this.attr('data-code');
            var start = Number($this.attr('data-start')) || 0;
            var text = $.trim($this.parents('[data-type="yl-chrome-ext-srt-item"]').find('.yl-chrome-ext-srt-item-content').text());

            saveSubtitles(start, text, langCode);

            $this.replaceWith(getSavedRemveHTML(langCode, start));
        });

        /**
         * on remove saved item
         * saves: subtitle text
         * youtube video id
         * youtube video time
         */
        $(document).on('click', '[data-type="yl-chrome-ext-remove-item"]', function(e){

            e.preventDefault();

            var $this = $(this);
            var langCode = $this.attr('data-code');
            var startTime = Number($this.attr('data-start')) || 0;

            removeSubtitle(startTime, langCode);

            $this.parents('.yl-chrome-ext-saved-remove').replaceWith(getSaveBtnHTML(langCode, startTime));
        });

        /**
         * chrome runtime messages
         */
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {

                /**
                 * change the location
                 */
                if(request.message === 'location'){

                    switch(request.location){

                        case 1: {
                            $('.yl-chrome-ext-langs').appendTo("#info");
                            break;
                        }

                        default: {
                            $('.yl-chrome-ext-langs').prependTo("#related");
                            break;
                        }
                    }
                }
            }
        );
    };

    /* ========================= ENTRY POINT ========================= */

    /**
     * on window load
     */
    $(window).on('load', function(){

        //chrome.storage.sync.clear();
        //chrome.storage.local.clear();

        /**
         * param {boolean} isAvailable
         */
        checkIfPageAvailable(function(isAvailable){

            if(isAvailable){

                var youtubeID = getParameterByName('v');

                if(youtubeID) {

                    //init events
                    initEvents();

                    //get available languages
                    getAvailableLangs(youtubeID);
                }
            }
        });
    });

})(jQuery);

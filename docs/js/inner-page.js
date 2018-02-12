(function($){
    'use strict';

    /**
     * open page according to the specified path
     * @param {string} source
     */
    var openPage = function(source){

        //hide all paths
        $('[data-path]').addClass('hidden');

        var path = $('[data-path="' + source + '"]');
        path.removeClass('hidden');

        $('[data-type="side-menu-item"]').removeClass('active');
        $('[data-type="side-menu-item"][data-source="' + source + '"]').addClass('active');
    };

    /**
     * init events
     */
    var initEvents = function(){

        /**
         * on side menu item click
         */
        $('[data-type="side-menu-item"]').on('click', function(e){

            //e.preventDefault();
            openPage($(this).attr('data-source'));
        });

        /**
         * hash changed
         */
        window.onhashchange = function(){
            jumpToHash(window.location.hash.replace('#', ''));
        };
    };

    /**
     * https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
     * @param {string} inputText
     * @return {string|XML|*}
     */
    var linkify = function(inputText) {

        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
    };

    /**
     * generate links in descriptions if needed, and other formattings
     */
    var formatDesc = function(){

        $('[data-type="desc"]').each(function(){

            var $this = $(this);
            var html = $this.html();

            html = linkify(html);
            //html = html.replace(/</g, '&lt;');
            html = html.replace(/([A-Z][a-zA-Z0-9]+:)/g, '<span class="desc-mark">$1</span>');
            $this.html(html);
        });
    };

    /**
     * open first item
     */
    var openFirstItem = function(){

        var $item = $('[data-type="side-menu-item"]:first');
        var source = $item.attr('data-source');
        openPage(source);
    };

    /**
     * open page according to the hash value
     * @param {string} hash
     */
    var jumpToHash = function(hash){

        if(hash){
            var $item = $('[data-type="side-menu-item"][data-source="' + hash + '"]');

            if($item.length > 0){
                openPage(hash);
            }
            else{
                openFirstItem();
            }
        }
        else {
            //show first item
            openFirstItem();
        }
    };

    /**
     * on dom ready
     */
    $(document).ready(function(){

        //generate links in descriptions if needed, and other formattings
        formatDesc();

        //init events
        initEvents();

        //open page according to the hash or the first page if no hash
        jumpToHash(window.location.hash.replace('#', ''));
    });

})(jQuery);
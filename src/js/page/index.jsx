import { h } from 'preact';
import Page from './page.jsx';

/* ========================= GLOBALS ========================= */
let loadTries = 0;
const LOAD_TRIES_MAX = 10;
const loadStep = 1000;

/**
 * check if the page is already available
 * @param {Function} callback
 */
const checkIfPageAvailable = (callback) => {

    const info = document.getElementById('info');

    if(info){
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
const getParameterByName = (name, url) => {

    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * on window load
 */
window.onload = () => {

    //chrome.storage.sync.clear();
    //chrome.storage.local.clear();

    /**
     * param {boolean} isAvailable
     */
    checkIfPageAvailable(function(isAvailable){

        if(isAvailable){

            var youtubeID = getParameterByName('v');

            if(youtubeID) {

                const related = document.getElementById('related');
                const page = document.createElement('div');
                related.insertBefore(page, related.firstChild);

                window.wishlist = ReactDOM.render(
                    <Page youtubeID={youtubeID} />,
                    page
                );
            }
        }
    });


};
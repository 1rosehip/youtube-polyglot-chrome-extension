const concat = require('concat-files');

concat([
    './src/js/vendors/1-preact.8.2.7.min.js',
    './src/js/vendors/2-prop-types.15.6.0.min.js',
    './src/js/vendors/3-preact-compat.3.17.0.min.js',
    './src/js/vendors/4-global.js',
    './src/js/vendors/5-polyfills.js'
], './dist/js/preact-vendors.min.js', function(err) {
    if (err) throw err;
    console.log('done');
});
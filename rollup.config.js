import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
//import livereload from 'rollup-plugin-livereload';

//css plugins
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

let cssFile = '';

if(process.argv){

    let res = process.argv.find(arg => arg.indexOf('--css=') !== -1);

    if(res){
        cssFile = res.replace('--css=', '');
    }
}

let postCSSOptions = {
    extensions: ['.css', '.scss'],
    //extract: '../../css/wishlist-min.css',
    plugins: [
        simplevars(),
        nested(),

        //We pass { warnForDuplicates: false } to cssnext() because both it and cssnano() use Autoprefixer,
        //which triggers a warning. Rather than wrestling with the config, we’ll just know that it’s being run twice
        //(which is harmless in this case) and silence the warning.
        cssnext({ warnForDuplicates: false, }),

        cssnano({zindex: false}),
    ]
    //sourceMap: false,
};

if(cssFile){
    postCSSOptions.extract = cssFile;
}

export default {
    input: 'app.js',

    //https://rollupjs.org/#outputoptions
    output: {
        file: 'output.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            'preact': 'preact'
        }
    },
    plugins: [

        postcss(postCSSOptions),

        resolve({
            browser: true,
            main: true
        }),

        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            presets: ['preact',
                        [
                            'env',
                            {
                                'modules': false
                            }
                        ]
            ],
            plugins: [
                'external-helpers'
                /*
                [
                    'babel-plugin-transform-require-ignore',
                    {
                        extensions: ['.scss', '.css']
                    }
                ]*/
            ]
        }),

        uglify()

        /*
        livereload({
            watch: '../../css/wishlist-min.css',
            verbose: false
            // other livereload options
            //https: true
        })*/

    ],
    external: [ 'preact' ] // <-- suppresses the warning
};
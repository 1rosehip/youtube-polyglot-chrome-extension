//npm install -g react-docgen
const fs = require('fs');

//compile the html template
const Bliss = require('bliss');
const bliss = new Bliss();

/**
 * load and parse docs configuration file
 * @return {object}
 */
const loadDocsConfig = () => {
    return JSON.parse(fs.readFileSync('./docs/docs.config.json', 'utf8'));
};

/**
 * get and format the data from docgen
 * @return {Array.<object>}
 */
const getRawDocgenData = () => {

    //generate json data from the source files
    //&& react-docgen src --pretty -o ./docs/docs.json
    /*
    var docgen = require('react-docgen');
    var componentInfo = docgen.parse('source text');
    console.log(componentInfo);*/

    const data = JSON.parse(fs.readFileSync('./docs/docs.json', 'utf8'));

    let result = [];
    for(const key in data){

        let resultItem = data[key];
        resultItem.path = key;
        result.push(resultItem);
    }

    return result;
};

/**
 * insert page or update page data in the pages array
 * @param {Array.<object>} pages
 * @param {object} configItem
 * @param {object} docgenItem
 */
const upsertPage = (pages, configItem, docgenItem) => {

    let pageIndex = -1;

    for(let i=0; i<pages.length; i++){

        if(docgenItem.path.startsWith(pages[i].source)){
            pageIndex = i;
            break;
        }
    }

    if(pageIndex !== -1){
        //existing page
        configItem.items.push(docgenItem);
    }
    else{
        //new page
        configItem.items = [docgenItem];
        pages.push(configItem);
    }
};

/**
 * split docgen data to pages according to the configuration file
 * @return {Array.<object>} pages
 */
const collectDocsPages = () => {

    const config = loadDocsConfig();
    const docgenData = getRawDocgenData();
    const pages = [];

    for(let i=0; i<docgenData.length; i++){

        const docgenItem = docgenData[i];

        for(let j=0; j<config.length; j++){

            const configItem = config[j];

            if(docgenItem.path.startsWith(configItem.source)){
                upsertPage(pages, configItem, docgenItem);
            }
        }
    }

    return pages;
};

/**
 * render the documentation pages
 */
const renderPages = () => {

    const template = bliss.compileFile('./docs/templates/page');
    const pages = collectDocsPages();

    for(let i=0; i<pages.length; i++){

        const page = pages[i];

        //combine data with html and write it to the output file
        const output = template(page);
        fs.writeFileSync('./docs/html/' + page.output, output);
    }
};

/**
 * render homepage
 */
const renderHomePage = () => {
    const template = bliss.compileFile('./docs/templates/index');
    const config = loadDocsConfig();
    const output = template(config);
    fs.writeFileSync('./docs/docs.html', output);
};

/**
 * the entry point
 */
renderPages();
renderHomePage();



import { h } from 'preact';

/**
 * Page component - the main component of extension.
 * Created: 02/12/2018
 * Usage:
 *          <Page
 *              youtubeID="nHN92cVgmm0"
 *          />
 */
export default class Page extends React.Component{

    /**
     * render the component
     * @return {string}
     */
    render(){

        return (
            <div>TEST</div>
        );
    }
}

Page.propTypes = {
    youtubeID: PropTypes.string
};
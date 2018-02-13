import { h } from 'preact';
import dataService from './services/data-service.jsx';

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
     * @constructor
     * @param props
     */
    constructor(props){
        super(props);

        this.state = {

            /* reponse from https://video.google.com/timedtext?type=list&v=... */
            availableLangs: null
        };
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted.
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     */
    componentDidMount() {

        console.log('componentDidMount');
        /**
         * get available languages
         */
        dataService.getAvailableLangs(

            (availableLangs) => {
                this.setState({
                    availableLangs: availableLangs
                });
            },
            (err) => {},
            this.props.youtubeID
        );
    }

    /**
     * render the component
     * @return {string}
     */
    render(){

        console.log(this.state.availableLangs);
        return (
            <div>TEST</div>
        );
    }
}

Page.propTypes = {
    youtubeID: PropTypes.string
};
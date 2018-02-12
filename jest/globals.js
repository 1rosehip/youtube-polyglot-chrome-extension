import React from 'preact-compat';
import PropTypes from 'prop-types';
global.React = React;
global.PropTypes = PropTypes;
global.externalLibrary = {
    logError: err => {
        console.log(err); // will output errors during Jest run
    },
    "snapshotSerializers": [ "preact-render-spy/snapshot" ]
};
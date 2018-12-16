/*global chrome*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

chrome.storage.local.get(['collected', 'response'], function(items) {
    console.log(items)
    ReactDOM.render(<App collected={items['collected']} 
        response={items['response']}/>, 
        document.getElementById('root'));
    registerServiceWorker();
});
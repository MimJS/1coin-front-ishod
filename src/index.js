import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import App from './App';
import registerServiceWorker from './sw';

// Init VK App
bridge.send('VKWebAppInit', {});

registerServiceWorker();

ReactDOM.render(<App />, document.getElementById('root'));

import {
    Config
} from './dtype.js';

let configuration: Config = {
    'backendURL': new URL( '' ),
    'defaultAuthErrorResolution': 'error'
};

const get = () => {
    return configuration;
};

const configure = ( config: Config ) => {
    configuration = config;
};

export default {
    configure,
    get
};

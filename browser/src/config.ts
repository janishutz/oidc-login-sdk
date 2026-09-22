export type AuthErrorResolution = 'resolve' | 'error';

export interface Config {
    'backendURL': URL;
    'defaultAuthErrorResolution': AuthErrorResolution;
    'authErrorEvent'?: string;
    'authCheckEndpoint'?: string;
    'loginEndpoint'?: string;
    'logoutEndpoint'?: string;
    'checkAutoRedirect'?: boolean;
}

let configuration: Config = {
    'backendURL': new URL( 'http://localhost:8080' ),
    'defaultAuthErrorResolution': 'error'
};

const get = () => {
    return configuration;
};

export const configure = ( config: Config ) => {
    configuration = config;
};

export default {
    configure,
    get
};

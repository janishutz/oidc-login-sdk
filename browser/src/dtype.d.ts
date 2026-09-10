export type AuthErrorResolution = 'resolve' | 'error';

export interface Config {
    'backendURL': URL;
    'defaultAuthErrorResolution': AuthErrorResolution;
    'authErrorEvent'?: string;
    'authCheckEndpoint'?: string;
    'loginEndpoing'?: string;
    'logoutEndpoint'?: string;
}

declare global {
    interface GlobalEventHandlersEventMap {
        'autherror': CustomEvent<void>
    }
}

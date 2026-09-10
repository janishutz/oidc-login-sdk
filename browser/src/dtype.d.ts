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

declare global {
    interface GlobalEventHandlersEventMap {
        'autherror': CustomEvent<void>
    }
}

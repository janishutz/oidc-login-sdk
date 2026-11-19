import config, {
    AuthErrorResolution
} from './config.js';
import {
    login
} from './auth.js';

export class AuthError extends Error {}

export class UnownedError extends Error {}

/**
 * Perform an HTTP GET request
 * @param url - The URL (just the path relative to website root) to fetch
 * @param authErrorResolution - The mean of authentication error resolution
 * @returns The reponse
 */
export const get = async ( url: string, authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    try {
        return await wrapper( url, {
            'credentials': 'include'
        }, authErrorResolution );
    } catch ( e ) {
        throw await e;
    }
};

/**
 * Perform an HTTP QUERY request
 * @param url - The URL (just the path relative to website root) to fetch
 * @param authErrorResolution - The mean of authentication error resolution
 * @returns The reponse
 */
export const query = async ( url: string, authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    try {
        return await wrapper( url, {
            'credentials': 'include'
        }, authErrorResolution );
    } catch ( e ) {
        throw await e;
    }
};

/**
 * Perform an HTTP POST request
 * @param url - The URL (just the path relative to website root) to fetch
 * @param payload - The request body to send as a string
 * @param mime - The MIME type of the payload
 * @param authErrorResolution - The mean of authentication error resolution
 * @returns The response
 */
export const post = async ( url: string, payload: string, mime: string = 'application/json', authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    try {
        return await wrapper( url, {
            'credentials': 'include',
            'body': payload,
            'method': 'POST',
            'headers': {
                'Content-Type': mime ?? 'application/json'
            }
        }, authErrorResolution );
    } catch ( e ) {
        throw await e;
    }
};

/**
 * Perform an HTTP PUT request
 * @param url - The URL (just the path relative to website root) to fetch
 * @param payload - The request body to send as a string
 * @param mime - The MIME type of the payload
 * @param authErrorResolution - The mean of authentication error resolution
 * @returns The response
 */
export const put = async ( url: string, payload: string, mime: string = 'application/json', authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    try {
        return await wrapper( url, {
            'credentials': 'include',
            'body': payload,
            'method': 'PUT',
            'headers': {
                'Content-Type': mime ?? 'application/json'
            }
        }, authErrorResolution );
    } catch ( e ) {
        throw await e;
    }
};

/**
 * Perform an HTTP PATCH request
 * @param url - The URL (just the path relative to website root) to fetch
 * @param payload - The request body to send as a string
 * @param mime - The MIME type of the payload
 * @param authErrorResolution - The mean of authentication error resolution
 * @returns The response
 */
export const patch = async ( url: string, payload: string, mime: string = 'application/json', authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    try {
        return await wrapper( url, {
            'credentials': 'include',
            'body': payload,
            'method': 'PATCH',
            'headers': {
                'Content-Type': mime ?? 'application/json'
            }
        }, authErrorResolution );
    } catch ( e ) {
        throw await e;
    }
};

/**
 * Perform an HTTP DELETE request
 * @param url - The URL (just the path relative to website root) to fetch
 * @param authErrorResolution - The mean of authentication error resolution
 * @returns The response
 */
export const deleteRequest = async ( url: string, authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    try {
        return await wrapper( url, {
            'credentials': 'include',
            'method': 'DELETE'
        }, authErrorResolution );
    } catch ( e ) {
        throw await e;
    }
};

/**
 * Send FormData via HTTP request
 * @param url - The URL (just the path relative to website root) to fetch
 * @param formdata - The FormData to send
 * @param method - The HTTP method to use. Defaults to 'PUT'
 * @param authErrorResolution - The mean of authentication error resolution
 * @returns The reponse
 */
export const sendFormData = async (
    url: string,
    formdata: FormData,
    method: 'PUT' | 'POST' | 'PATCH' = 'PUT',
    authErrorResolution?: AuthErrorResolution
): Promise<Response> => {
    if ( !method ) {
        method = 'PUT';
    }

    try {
        return await wrapper( url, {
            'credentials': 'include',
            'body': formdata,
            'method': method,
            'headers': {
                'Content-Type': 'multipart/form-data'
            }
        }, authErrorResolution );
    } catch ( e ) {
        throw await e;
    }
};


/**
 * Retrieve the configured backend URL
 * @returns The URL to the backend
 */
export const getBackendURL = () => {
    return new URL( config.get().backendURL.toString() );
};

const wrapper = async ( path: string, opts: RequestInit, authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    const url = getBackendURL();

    url.pathname = path;
    const res = await fetch( url.toString(), {
        'redirect': 'manual',
        ...opts
    } );

    if ( res.type === 'opaqueredirect' ) {
        handleUnauth( authErrorResolution );

        return res;
    } else {
        if ( res.ok )
            return res;
        else if ( res.status === 401 || res.status === 403 )
            throw new AuthError( 'ERR_USER_UNAUTHORIZED' );
        else
            throw new Error( 'ERR_' + res.status );
    }
};

const handleUnauth = ( authErrorResolution?: AuthErrorResolution ) => {
    if ( config.get().authErrorEvent ) {
        document.dispatchEvent( new CustomEvent( 'autherror' ) );
    }

    if ( ( authErrorResolution && authErrorResolution === 'resolve' ) || ( !authErrorResolution && config.get().defaultAuthErrorResolution === 'resolve' ) ) {
        login();
    } else {
        throw new AuthError( 'ERR_USER_UNAUTHORIZED' );
    }
};

export default {
    get,
    query,
    post,
    put,
    patch,
    'delete': deleteRequest,
    getBackendURL
};

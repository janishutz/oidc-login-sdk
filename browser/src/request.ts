import config from './config.js';
import {
    login
} from './auth.js';

export class AuthError extends Error {}

export class UnownedError extends Error {}


const get = async ( url: string ): Promise<Response> => {
    return await wrapper( url, {
        'credentials': 'include'
    } );
};

const post = async ( url: string, payload: string, mime: string = 'application/json' ): Promise<Response> => {
    return await wrapper( url, {
        'credentials': 'include',
        'body': payload,
        'method': 'post',
        'headers': {
            'Content-Type': mime ?? 'application/json'
        }
    } );
};

const wrapper = async ( url: string, opts: RequestInit ): Promise<Response> => {
    const res = await fetch( config.get().backendURL + url, {
        'redirect': 'manual',
        ...opts
    } );

    if ( res.type === 'opaqueredirect' ) {
        if ( config.get().authErrorEvent ) {
            document.dispatchEvent( new CustomEvent( 'autherror' ) );
        }

        if ( config.get().defaultAuthErrorResolution === 'resolve' ) {
            login();
        } else {
            throw new AuthError( 'ERR_USER_UNAUTHORIZED' );
        }
    } else {
        return res;
    }
};

export default {
    get,
    post
};

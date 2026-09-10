import {
    AuthErrorResolution
} from './dtype.js';
import config from './config.js';
import {
    login
} from './auth.js';

export class AuthError extends Error {}

export class UnownedError extends Error {}


const get = async ( url: string, authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    return await wrapper( url, {
        'credentials': 'include'
    }, authErrorResolution );
};

const post = async ( url: string, payload: string, mime: string = 'application/json', authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    return await wrapper( url, {
        'credentials': 'include',
        'body': payload,
        'method': 'post',
        'headers': {
            'Content-Type': mime ?? 'application/json'
        }
    }, authErrorResolution );
};

const wrapper = async ( url: string, opts: RequestInit, authErrorResolution?: AuthErrorResolution ): Promise<Response> => {
    const res = await fetch( config.get().backendURL + url, {
        'redirect': 'manual',
        ...opts
    } );

    if ( res.type === 'opaqueredirect' ) {
        if ( config.get().authErrorEvent ) {
            document.dispatchEvent( new CustomEvent( 'autherror' ) );
        }

        if ( ( authErrorResolution && authErrorResolution === 'resolve' ) || ( !authErrorResolution && config.get().defaultAuthErrorResolution === 'resolve' ) ) {
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

import request, {
    AuthError
} from './request.js';
import config from './config.js';

export const login = ( returnTo?: string ) => {
    sessionStorage.setItem( 'redirect', location.pathname );
    location.href = ( config.get().loginEndpoint ?? '/auth/v2/login' ) + ( returnTo ? returnTo : '' );
};

export const check = async () => {
    let status: boolean;

    try {
        status = ( await request.get( config.get().authCheckEndpoint ?? '/auth/v2/check' ) ).ok;
    } catch ( e ) {
        if ( e instanceof AuthError ) {
            status = false;
        } else {
            throw e;
        }
    }

    if ( !status && config.get().checkAutoRedirect ) {
        const redir = getRedirect();

        if ( redir )
            location.href = redir;
    }

    return status;
};

export const getRedirect = (): string | null => {
    const item = sessionStorage.getItem( 'redirect' );

    sessionStorage.removeItem( 'redirect' );

    return item;
};

export const logout = async () => {
    location.href = config.get().logoutEndpoint ?? '/auth/v2/logout';
};

import request, {
    AuthError
} from './request.js';
import config from './config.js';

/**
 * Start the login flow. Please note that upon calling this, the page will be reloaded after completion of the login flow
 * @param returnTo - The location to return to after login
 */
export const login = ( returnTo?: URL ) => {
    sessionStorage.setItem( 'redirect', location.pathname );
    location.href = ( config.get().loginEndpoint ?? '/auth/v2/login' ) + ( returnTo ? returnTo.toString() : '' );
};

/**
 * Check if a user is authenticated. This can also be done implicitly using a call to a protected endpoint
 * @returns A promise resolving to a boolean indicating authentication status
 */
export const check = async (): Promise<boolean> => {
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

/**
 * Use this, if you did not set the login returnTo path, or if in any other case you need to redirect the user after login,
 * such as after a navigation guard executing prior to state update
 * @returns The location to redirect to
 */
export const getRedirect = (): string | null => {
    const item = sessionStorage.getItem( 'redirect' );

    sessionStorage.removeItem( 'redirect' );

    return item;
};

/** Logs the user out */
export const logout = async () => {
    location.href = config.get().logoutEndpoint ?? '/auth/v2/logout';
};

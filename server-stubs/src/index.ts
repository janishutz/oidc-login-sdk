import connect from 'express-openid-connect';
import express from 'express';

/**
 * Set up the sdk. It is recommended that you use a custom SessionStore, such as RedisStore for express-session
 * Furthermore, see README for required environment variables
 * @param app - Express application
 * @param issuer - OIDC Issuer URL
 * @param appURL - URL of this application
 * @param authForAllRoutes - Whether or not to require authorization on all routes
 * @param scopes - Scopes to request
 * @param enableBackchannelLogout - Whether or not to enable backchannel logout. If true, must provide sessionStore
 * @param loginReturnURL - The URL to return to by default if none is specified as returnTo query parameter
 * @param userValidation - Function to validate the user
 * @param sessionStore - RECOMMENDED: Use any express-session SessionStore, like the RedisStore
 * @param extraOpts - Extra configuration options, or overwrite some set here
 */
export const configure = (
    app: express.Application,
    _issuer: URL,
    _appURL: URL,
    _authForAllRoutes: boolean,
    _scopes: ( 'profile' | 'email' )[],
    _enableBackchannelLogout: boolean,
    loginReturnURL?: URL,
    _userValidation?: ( req: express.Request, res: express.Response, session: connect.Session ) => Promise<connect.Session>,
    _sessionStore?: connect.SessionStore,
    extraOpts?: connect.ConfigParams
) => {
    app.get( '/auth/v2/check', ( _req, res ) => res.sendStatus( 200 ) );

    app.get( '/auth/v2/logout', ( _req, res ) => res.redirect( '/' ) );

    app.post( '/auth/v2/logout', ( _req, res ) => res.sendStatus( 200 ) );

    app.get( '/auth/v2/login', ( req, res ) => {
        res.redirect( req.query.returnTo ? String( req.query.returnTo ) : ( loginReturnURL?.href ?? '/' ) );
    } );
    console.debug( 'Extra config opts (ignored)', extraOpts );
};

export const requiresAuth = ( requiresLoginCheck?: ( req: express.Request ) => boolean ) => {
    if ( requiresLoginCheck ) console.log( 'Login check will be skipped due to usage of stubs' );

    return ( _req: express.Request, _res: express.Response, next: express.NextFunction ) => {
        next();
    };
};

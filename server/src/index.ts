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
    issuer: URL,
    appURL: URL,
    authForAllRoutes: boolean,
    scopes: ( 'profile' | 'email' )[],
    enableBackchannelLogout: boolean,
    loginReturnURL?: URL,
    userValidation?: ( req: express.Request, res: express.Response, session: connect.Session ) => Promise<connect.Session>,
    sessionStore?: connect.SessionStore,
    extraOpts?: connect.ConfigParams
) => {
    app.use( connect.auth( {
        'authRequired': authForAllRoutes,
        'issuerBaseURL': issuer.href,
        'baseURL': appURL.href,
        'clientID': process.env.OIDC_CLIENT_ID,
        'clientSecret': process.env.OIDC_CLIENT_SECRET,
        'secret': process.env.SIGNING_SECRET,
        'afterCallback': userValidation,
        'authorizationParams': {
            'scope': 'openid' + ( scopes.length > 0 ? ' ' + scopes.join( ' ' ) : '' ),
            'response_type': 'code'
        },
        'backchannelLogout': enableBackchannelLogout,
        'session': {
            'store': sessionStore
        },
        'enableTelemetry': false,
        'routes': {
            'callback': '/auth/v2/verify',
            'login': false,
            'logout': '/auth/v2/logout',
            'postLogoutRedirect': '/',
            'backchannelLogout': '/auth/v2/logout'
        },
        ...extraOpts
    } ) );

    app.get( '/auth/v2/check', connect.requiresAuth(), ( _req, res ) => res.sendStatus( 200 ) );

    app.get( '/auth/v2/login', ( req, res ) => {
        res.oidc.login( {
            'returnTo': req.query.returnTo ? String( req.query.returnTo ) : ( loginReturnURL.href ?? '/' ),
            'authorizationParams': {
                'redirect_uri': appURL.href + 'auth/v2/verify'
            }
        } );
    } );
};

/** Re-Export of express-openid-connect's requiresAuth function */
export const requiresAuth = connect.requiresAuth;

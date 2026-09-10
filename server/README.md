# janishutz/oidc-login-sdk-server
This SDK is designed to run together with my browser sdk.
It is a simple wrapper of `express-openid-connect`.

It is highly recommended that you use a proper session store (such as the redis store from express-session) to store the sessions.

## Usage
Make sure that you have the following environment variables set
```env
OIDC_CLIENT_ID=<CLIENT ID>
OIDC_CLIENT_SECRET=<CLIENT SECRET>
SIGNING_SECRET=<LONG RANDOM STRING FOR COOKIE SIGNING>
```

**More details to come**

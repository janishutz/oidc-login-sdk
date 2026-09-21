import config from './config.js';

export type * as dtype from './dtype.d.ts';

export const configure = config.configure;

export * as auth from './auth.js';

/**
 * Wrapper on top of fetch, with redirects from the backend handled according to your rules
 */
export * as request from './request.js';

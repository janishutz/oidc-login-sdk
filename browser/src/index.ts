import config from './config.js';

export const configure = config.configure;

/**
 * Wrapper on top of fetch, with redirects from the backend handled according to your rules
 */
export * as request from './request.js';

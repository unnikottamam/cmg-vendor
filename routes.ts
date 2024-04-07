/**
 * These are the routes that are considered as public routes.
 * These routes are accessible by everyone.
 * @type {string[]}
 */
export const publicRoutes: string[] = [];

/**
 * Array of routes that are considered as authentication routes.
 * Only logged in users can access these routes.
 * @type {string[]}
 */
export const authRoutes: string[] = [
    "/",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/new-password",
];

/**
 * The prefix for authentication API routes.
 * Routes starts with this prefix are used for authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * Default redirect URL after login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/products";
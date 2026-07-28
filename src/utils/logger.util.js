/**
 *
 * @param {*} context  e.g. "UserController"
 * @param {*} action  e.g. "remove" or "create"
 * @param {*} data Any data to print
 *
 * Usage: log('UserController','create', {})
 */
export function log(context, action, ...data) {
    console.log(`[INFO]  (${context}:${action}):`, ...data);
}

/**
 *
 * @param {*} context  e.g. "UserController"
 * @param {*} action  e.g. "remove" or "create"
 * @param {*} msg Any msg to print
 *
 * Usage: log('UserController','create', '')
 */
export function logMessage(context, action, msg) {
    console.log(`[INFO]  (${context}:${action}): ${msg}`);
}

/**
 *
 * @param {*} context  e.g. "UserController"
 * @param {*} action  e.g. "remove" or "create"
 * @param {*} err error details
 *
 * Usage: logError('UserController','create', {})
 */
export function logError(context, action, err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? `\n${err.stack}` : '';

    console.error(`![ERROR] (${context}:${action}) ${message}${stack}`);
}

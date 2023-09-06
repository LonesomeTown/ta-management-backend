import { PromiseTimeout } from './promiseTimeout.errors';

/**
 *
 * @param promise
 * @param ms the timeout in milliseconds
 *
 * This will make the promise fail if it
 * takes longer than the timeout
 */
export const promiseTimeout = async <T>(
    promise: Promise<T>
    , ms: number
): Promise<T> => {
    let timeoutRef: NodeJS.Timeout = setTimeout( () => null, ms );

    try {
        const result = await Promise.race( [
            promise
            , new Promise( ( resolve, reject ) => {
                timeoutRef = setTimeout(
                    () =>
                        reject( new PromiseTimeout( ms ) )
                    , ms
                );
            } )
        ] ) as T;

        clearTimeout( timeoutRef );

        return result;
    } catch ( error ) {
        clearTimeout( timeoutRef );
        throw error;
    }
};
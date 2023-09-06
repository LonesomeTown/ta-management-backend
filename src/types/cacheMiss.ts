import { ResourceError } from '../errors';

export class CacheMiss extends ResourceError {
    public constructor ( resourceName: string, error?: Error | unknown ) {
        const message = `Unable to find the ${ resourceName } from the redis cache.`;
        super( { message, error } );
    }
}
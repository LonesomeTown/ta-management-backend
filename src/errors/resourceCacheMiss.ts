import { ResourceNotFound } from './resourceNotFound';

export class ResourceCacheMiss extends ResourceNotFound {
    public constructor ( resourceName: string ) {
        const message = `Unable to find the ${ resourceName } from the redis cache.`;
        const code = 'RESOURCE_CACHE_MISS';
        super( { message, code } );
    }
}
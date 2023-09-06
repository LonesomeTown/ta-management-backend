import { promiseTimeout } from './promiseTimeout';
import { PromiseTimeout } from './promiseTimeout.errors';

describe( 'promiseTimeout', () => {
    const wait = (
        duration: number
    ) =>  new Promise( resolve => setTimeout( resolve, duration ) );

    it(
        'does not fail when timeout is less than duration of promise'
        , async () => {
            await expect( promiseTimeout( wait( 100 ), 200 ) )
                .resolves
                .not
                .toThrowError();
        }
    );

    it(
        'fails when timeout is longer than duration of promise'
        , async () => {
            await expect( promiseTimeout( wait( 200 ), 100 ) )
                .rejects
                .toThrowError( PromiseTimeout );
        }
    );
} );
import { jsonParse, jsonStringify } from './json';
import { Success, Error } from '../../types';
import { JsonParseError, JsonStringifyError } from './json.errors';

describe( 'jsonParse', () => {

    it(
        'returns the parsed value from the given string'
        , () => {
            const value = '[{"name":"Accounting","level":0},{"name":"Administrator","level":3}]';

            const parseResult = jsonParse<{name: string; level: number}[]>(
                value
            );

            expect( parseResult )
                .toBeInstanceOf( Success );
            expect( ( parseResult.value ) )
                .toHaveLength( 2 );
            expect( ( parseResult.value )[ 0 ] )
                .toMatchObject( { name: 'Accounting', level: 0 } );
        }
    );

    it(
        'errors out when an invalid value is given'
        , () => {
            const value = '[{"name":"Accounting","level":0},{"name":"Administrator"]';

            const parseResult = jsonParse( value );

            expect( parseResult )
                .toBeInstanceOf( Error );
            expect( ( parseResult.value ) )
                .toBeInstanceOf( JsonParseError );
        }
    );
} );

describe( 'jsonStringify', () => {

    it(
        'returns the stringified string from the given value'
        , () => {
            const value = [ { name: 'Accounting', level: 0 }, { name: 'Administrator', level: 3 } ];

            const parseResult = jsonStringify( value );

            expect( parseResult )
                .toBeInstanceOf( Success );
            expect( ( parseResult.value ) )
                .toBe( '[{"name":"Accounting","level":0},{"name":"Administrator","level":3}]' );
        }
    );

    it(
        'errors out when an invalid value is given'
        , () => {
            const value = { a: {} };
            value.a = { b: value };

            const parseResult = jsonStringify( value );

            expect( parseResult )
                .toBeInstanceOf( Error );
            expect( ( parseResult.value ) )
                .toBeInstanceOf( JsonStringifyError );
        }
    );
} );
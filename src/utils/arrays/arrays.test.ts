import { chunkArray } from './arrays';

describe( 'chunk array', () => {
    it(
        'returns array of arrays with subarray length equaling desired length'
        , () => {
            const array = [
                1
                , 2
                , 3
                , 4
                , 5
                , 6
                , 7
                , 8
                , 9
                , 10
            ];

            const chunksResult = chunkArray<number>( array, 3 );

            expect( chunksResult )
                .toBeInstanceOf( Array );
            expect( chunksResult )
                .toEqual( [
                    [ 1, 2, 3 ]
                    , [ 4, 5, 6 ]
                    , [ 7, 8, 9 ]
                    , [ 10 ]
                ] );
        }
    );

    it(
        'returns empty array if invalid chunkSize is passed'
        , () => {
            const array = [
                1
                , 2
                , 3
                , 4
                , 5
                , 6
                , 7
                , 8
                , 9
                , 10
            ];

            const chunksResult = chunkArray<number>( array, -5 );

            expect( chunksResult )
                .toEqual( [] );
        }
    );

    it(
        'returns empty array if passed an empty array'
        , () => {
            const array: number[] = [];

            const chunksResult = chunkArray<number>( array, 10 );

            expect( chunksResult )
                .toEqual( [] );
        }
    );
} );
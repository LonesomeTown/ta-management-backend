import { normalizeQueryText } from './normalizeQueryText';

describe( 'normalizeQueryText', () => {

    it(
        'removes all the new lines'
        , () => {
            const queryText = `
                SELECT id
                    , name
                FROM people;
            `;
            const normalizedQueryText = normalizeQueryText( queryText );

            expect( normalizedQueryText )
                .toBe(
                    'SELECT id, name FROM people;'
                );
            expect( normalizedQueryText )
                .toMatch(
                    'SELECT id, name'
                );
            expect( normalizedQueryText )
                .toMatch(
                    'FROM people'
                );
        }
    );

    it(
        'does not remove the inline spacing'
        , () => {
            const queryText = `
                INSERT INTO people
                ( id, name )
                VALUES ( $1, $2 );
            `;
            const normalizedQueryText = normalizeQueryText( queryText );

            expect( normalizedQueryText )
                .toBe(
                    'INSERT INTO people ( id, name ) VALUES ( $1, $2 );'
                );
        }
    );

    it(
        'removes vertically lined spaces'
        , () => {
            const queryText = `
                INSERT INTO people
                ( 
                    id
                    , name 
                )
                VALUES 
                ( 
                    $1
                    , $2 
                );
            `;
            const normalizedQueryText = normalizeQueryText( queryText );

            expect( normalizedQueryText )
                .toBe(
                    'INSERT INTO people ( id, name ) VALUES ( $1, $2 );'
                );
        }
    );
} );
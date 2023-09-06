import { ResourceError } from '../../errors';

export class ChunkArrayError extends ResourceError {
    public constructor (
        error: Error
    ) {
        const message = 'The array cannot be chunked.';
        const code = 'CHUNK_ARRAY';
        const statusCode = 500;

        super( {
            message
            , code
            , error
            , statusCode
        } );

    }
}
import {
    Either, success, error
} from '../../types';
import { JsonParseError, JsonStringifyError } from './json.errors';

export const jsonParse = <T = unknown>(
    value: string
): Either<JsonParseError, T> => {
    try {
        const result: unknown = JSON.parse( value );
        return success( result as T );
    } catch ( err ) {
        return error( new JsonParseError( err as Error ) );
    }
};

export const jsonStringify = (
    value: unknown
): Either<JsonStringifyError, string> => {
    try {
        const result = JSON.stringify( value );
        return success( result );
    } catch ( err ) {
        return error( new JsonStringifyError( err as Error ) );
    }
};
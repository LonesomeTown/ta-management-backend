import Joi, { ValidationError } from 'joi';
import { ResourceError } from '../../errors';
import {
    Either, error, success
} from '../../types';
import {
    RequestValidationError
    , MalformedExpressHeaders
    , MalformedJoiSchemaJson
} from './requestValidator.errors';
import { buildErrorMessage } from './requestValidator.helper';
import { SCHEMAS } from './requestValidator.schemas';
import { SchemaName } from './requestValidator.types';

export const BASE_HEADERS = Joi.object()
    .keys( { 'x-request-id': Joi.string().required() } )
    .unknown( true );

export const getValidatedHeaders = async (
    headers: Record<string, string> | unknown
    , schemaName: SchemaName
): Promise<Either<ResourceError, Record<string, string>>> => {
    const combinedHeaders = {};
    const schema = SCHEMAS[ schemaName ];

    if ( schema.describe().keys.headers ) {

        let endpointHeadersSchema: Joi.Schema;

        try {
            endpointHeadersSchema = schema.extract( 'headers' );
        } catch {
            const malformedExpressHeaders = new MalformedExpressHeaders();
            return error( malformedExpressHeaders );
        }

        const endpointHeaders: Joi.Description = endpointHeadersSchema
            .describe()
            .keys;

        for ( const [ key, value ] of Object.entries( endpointHeaders ) ) {
            if ( value.flags.presence === 'required' ) {
                combinedHeaders[ key ] = { type: 'string', flags: { presence: 'required' } };
            } else {
                combinedHeaders[ key ] = { type: 'string', flags: { presence: 'optional' } };
            }
        }
    }

    const baseHeaders: Joi.Description = BASE_HEADERS.describe().keys;

    for ( const [ key, value ] of Object.entries( baseHeaders ) ) {
        if ( value.flags.presence === 'required' ) {
            combinedHeaders[ key ] = { type: 'string', flags: { presence: 'required' } };
        } else {
            combinedHeaders[ key ] = { type: 'string', flags: { presence: 'optional' } };
        }
    }

    const headerValidationObjectLiteral = { type: 'object', keys: combinedHeaders };
    let headerValidationSchema: Joi.ObjectSchema;

    try {
        headerValidationSchema = Joi.build(
            headerValidationObjectLiteral
        );
    } catch {
        const malformedJoiSchemaJson = new MalformedJoiSchemaJson();
        return error( malformedJoiSchemaJson );
    }

    headerValidationSchema = headerValidationSchema
        .options( { stripUnknown: true } );
    let headerValidationResult: Record<string, string>;


    try {
        headerValidationResult = await headerValidationSchema
            .validateAsync( headers, { abortEarly: false } );
    } catch ( headerValidationError ) {
        let typedError = headerValidationError as string | ResourceError;

        if ( headerValidationError instanceof ValidationError ) {
            typedError = buildErrorMessage( headerValidationError );
        }

        const requestValidationError = new RequestValidationError(
                schemaName as string
                , typedError
        );

        return error( requestValidationError );
    }

    return success( headerValidationResult );
};

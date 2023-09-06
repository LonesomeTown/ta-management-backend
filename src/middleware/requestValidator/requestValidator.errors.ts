import { ResourceError } from '../../errors';

export class RequestValidationError extends ResourceError {
    public constructor (
        schemaName: string
        , error: string | ResourceError
    ) {
        const message = `Error Validating the ${ schemaName } Request.`;
        const statusCode = 400;
        const code = 'REQUEST_VALIDATION';
        super( {
            message, code, error, statusCode
        } );
    }
}

export class ExternalFieldValidationError<T = unknown> extends ResourceError {
    validValues: T[ keyof T ][];

    public constructor (
        value: T[ keyof T ]
        , validValues: T[ keyof T ][]
        , datumAttributeDescription: string
    ) {
        const message = `${ value } is an invalid ${ datumAttributeDescription }.`;
        super( { message } );

        this.validValues = validValues;
    }
}

export class ExternalFieldValidationDataFetchError<T = unknown>
    extends ResourceError {

    public constructor (
        value: T[ keyof T ]
        , datumAttributeDescription: string
    ) {
        const message = `${ value } might be an invalid ${ datumAttributeDescription }. We were unable to complete validation on this field.`;
        super( { message } );
    }
}

export class MalformedExpressHeaders extends ResourceError {
    public constructor () {
        const message = 'Error extracting Joi schema from express request headers.';
        const statusCode = 400;
        const code = 'MALFORMED_EXPRESS_HEADERS';
        super( { message, code, statusCode } );
    }
}

export class MalformedJoiSchemaJson extends ResourceError {
    public constructor () {
        const message = 'Error building a Joi schema from JSON.';
        const statusCode = 400;
        const code = 'MALFORMED_JOI_SCHEMA_JSON';
        super( { message, code, statusCode } );
    }
}
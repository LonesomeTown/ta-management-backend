import { ValidationError } from 'joi';
import {
    Request, Response, NextFunction
} from 'express';
import { ResourceError } from '../../errors';
import { RequestValidationError } from './requestValidator.errors';
import {
    buildErrorMessage
    , buildRequestContent
} from './requestValidator.helper';
import { SchemaName } from './requestValidator.types';
import { SCHEMAS } from './requestValidator.schemas';
import { getValidatedHeaders } from './requestValidator.headers';


export const requestValidator = ( schemaName: SchemaName ) => {
    return async (
        req: Request
        , res: Response<RequestValidationError>
        , next: NextFunction
    ): Promise<Response<RequestValidationError> | void> => {

        const content = buildRequestContent( req );
        const headersContent = content.headers;
        const schema = SCHEMAS[ schemaName ];

        try {
            delete content.headers;

            await schema.validateAsync( content, { abortEarly: false } );

        } catch ( validationError ) {
            let error = validationError as string | ResourceError;

            if ( validationError instanceof ValidationError ) {
                error = buildErrorMessage( validationError );
            }

            const requestValidationError = new RequestValidationError(
                schemaName as string
                , error
            );
            return res.status( requestValidationError.statusCode )
                .json( requestValidationError );
        }

        const getValidatedHeadersResult = await getValidatedHeaders(
            headersContent
            , schemaName
        );

        if ( getValidatedHeadersResult.isError() ) {
            return res
                .status( getValidatedHeadersResult.value.statusCode )
                .json( getValidatedHeadersResult.value );
        }

        req.headers = getValidatedHeadersResult.value;

        return next();
    };
};
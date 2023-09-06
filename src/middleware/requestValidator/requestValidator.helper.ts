import Joi from 'joi';
import { Request } from 'express';
import {
    ValidationError
    , ValidationErrorItem
    , ValidationResult
} from 'joi';
import { RequestContent } from './requestValidator.types';
import { isObjectEmpty } from '../../utils';
import { Either } from '../../types';
import { ResourceError } from '../../errors';
import {
    ExternalFieldValidationDataFetchError
    , ExternalFieldValidationError
} from './requestValidator.errors';

/*
 *This removes empty attributes from
 *the request before the content can
 *be used for validation
 */
export const buildRequestContent = ( req: Request ): RequestContent => {
    const {
        query
        , params
        , body
        , headers
    } = req;
    const content: RequestContent = {};

    if ( !isObjectEmpty( query ) ) content.query = query;
    if ( !isObjectEmpty( params ) ) content.params = params;
    if ( !isObjectEmpty( body ) ) content.body = body;
    if ( !isObjectEmpty( headers ) ) content.headers = headers;

    if ( req.method === 'GET' ) delete content.body;

    return content;
};

export const externalFieldValidator = async <T, K extends keyof T>(
    fnToFetchExternalData: () => Promise<Either<ResourceError, T[]>>
    , datumAttributeName: K
    , datumAttributeDescription: string
    , value: T[ K ]
): Promise<T[ K ]> => {
    const dataFetchResult = await fnToFetchExternalData();

    if ( dataFetchResult.isError() ) {
        throw new ExternalFieldValidationDataFetchError(
            value
            , datumAttributeDescription
        );
    }

    const data = dataFetchResult.value;

    const validValues: T[ K ][] = [];

    for ( const datum of data ) {
        if ( datum[ datumAttributeName ] === value ) {
            return value;
        }

        validValues.push( datum[ datumAttributeName ] );
    }

    throw new ExternalFieldValidationError(
        value
        , validValues
        , datumAttributeDescription
    );
};

export const validateStringCombination = (
    validStrings: string[]
): ValidationResult => {
    const lastIdx = validStrings.length - 1;

    let validationErrorString = '';

    for ( let i = 0; i < lastIdx; i++ ) {
        validationErrorString += `'${ validStrings[ i ] }', `;
    }

    return (
        Joi.extend( joi => ( {
            base: joi.array()
            , messages: {
                'strings.base':
                    `{{#label}} must only contain a combination of ${ validationErrorString }or '${ validStrings[ lastIdx ] }' (e.g. '${ validStrings[ lastIdx ] },${ validStrings[ 0 ] }')`
            }
            , coerce: ( value ) => ( { value: value.split( ',' ) } )
            , validate ( value, helpers ) {
                for ( const string of value ) {
                    if ( !validStrings.includes( string ) ) {
                        return { value, errors: helpers.error( 'strings.base' ) };
                    }
                }
            }
            , type: 'strings'
        } ) ).strings()
    );
};

export const buildErrorMessage = (
    validationError: ValidationError
): string => {
    const { details } = validationError;
    const errorMessage = details
        .map( ( i: ValidationErrorItem ) => i.message )
        .join( ', ' );
    return errorMessage;
};
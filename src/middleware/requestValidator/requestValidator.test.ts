import express from 'express';
import supertest from 'supertest';
import Joi from 'joi';

import { requestValidator } from './requestValidator';
import { wrapAsync } from '../../server/server.helper';
import { SchemaName } from './requestValidator.types';


const app = express();
app.use( express.json() );

const testRequestValidatorHandler = async (
    req: express.Request
    , res: express.Response
): Promise<express.Response<Record<string, unknown>>> => {
    return res
        .status( 200 )
        .json( req.headers );
};

const requestValidatorTestRouter = express.Router();

requestValidatorTestRouter
    .post(
        '/'
        , requestValidator( 'mockCreateRequestSchema' as SchemaName )
        , wrapAsync( testRequestValidatorHandler )
    );

app.use( '/test-request-validator', requestValidatorTestRouter );

const server = app.listen();
const request = supertest( server );

jest.mock( './requestValidator.schemas', () => ( {
    [ 'SCHEMAS' ]: {
        mockCreateRequestSchema: Joi.object( {
            body: Joi.object( {
                isCool: Joi.boolean()
                , context: Joi
                    .string()
                    .valid( 'Parker is cool', 'Parker is definitely not cool' )
                , comment: Joi.string()
                    .required()
            } )
                .options( { presence: 'required' } )
                .required()
            , headers: Joi
                .object( {
                    [ 'required-endpoint-scoped-header' ]: Joi.string().required()
                    , [ 'optional-endpoint-scoped-header' ]: Joi.string().optional()
                } )
        } )
    }
} ) );


afterAll( () => {
    server.close();
} );

describe( 'requestValidator()', () => {

    const xRequestIdHeader = 'abcd-1234-efgh-5678';
    const requiredEndpointScopedHeader = 'This is a required endpoint scoped header';
    const optionalEndpointScopedHeader = 'This is an optional endpoint scoped header';
    const userAgentHeader = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0';
    const connectionHeader = 'Connection: keep-alive';
    const acceptEncodingHeader = 'Accept-Encoding: gzip, deflate, br';
    const hostHeaderInjectionAttempt = 'Dangerous host header injection attempt. This must be sanitized!';

    it(
        'returns an error when a required base header is not included'
        , async () => {

            const result = await request
                .post( '/test-request-validator' )
                .set( 'required-endpoint-scoped-header', requiredEndpointScopedHeader )
                .send(
                    {
                        isCool: 'true'
                        , context: 'Parker is cool'
                        , comment: 'Parker is indeed, cool.'
                    }
                )
                .type( 'application/json' );

            expect( result.body ).toStrictEqual( {
                code: 'REQUEST_VALIDATION'
                , error: '"x-request-id" is required'
                , message: 'Error Validating the mockCreateRequestSchema Request.'
                , statusCode: 400
            } );

            expect( result.status ).toBe( 400 );
        }
    );

    it(
        'returns an error when a required endpoint scoped header is not included'
        , async () => {

            const result = await request
                .post( '/test-request-validator' )
                .set( 'x-request-id', xRequestIdHeader )
                .send(
                    {
                        isCool: 'true'
                        , context: 'Parker is cool'
                        , comment: 'Parker is indeed, cool.'
                    }
                )
                .type( 'application/json' );

            expect( result.body ).toStrictEqual( {
                code: 'REQUEST_VALIDATION'
                , error: '"required-endpoint-scoped-header" is required'
                , message: 'Error Validating the mockCreateRequestSchema Request.'
                , statusCode: 400
            } );
            expect( result.status ).toBe( 400 );
        }
    );

    it(
        'sanitizes to include only the required headers'
        , async () => {

            const result = await request
                .post( '/test-request-validator' )
                .set( 'x-request-id', xRequestIdHeader )
                .set( 'required-endpoint-scoped-header', requiredEndpointScopedHeader  )
                .set( 'User-Agent', userAgentHeader  )
                .set( 'Connection', connectionHeader  )
                .set( 'Accept-Encoding', acceptEncodingHeader  )
                .set( 'Host', hostHeaderInjectionAttempt  )
                .send(
                    {
                        isCool: 'true'
                        , context: 'Parker is cool'
                        , comment: 'Parker is indeed, cool.'
                    }
                )
                .type( 'application/json' );

            expect( result.body ).toStrictEqual( {
                [ 'x-request-id' ]: xRequestIdHeader
                , [ 'required-endpoint-scoped-header' ]: requiredEndpointScopedHeader
            } );

            expect( result.status ).toBe( 200 );
        }
    );

    it(
        'sanitizes to include the optional and required headers'
        , async () => {

            const result = await request
                .post( '/test-request-validator' )
                .set( 'x-request-id', xRequestIdHeader )
                .set( 'required-endpoint-scoped-header', requiredEndpointScopedHeader )
                .set( 'optional-endpoint-scoped-header', optionalEndpointScopedHeader )
                .set( 'User-Agent', userAgentHeader  )
                .set( 'Connection', connectionHeader  )
                .set( 'Accept-Encoding', acceptEncodingHeader  )
                .set( 'Host', hostHeaderInjectionAttempt  )
                .send(
                    {
                        isCool: 'true'
                        , context: 'Parker is cool'
                        , comment: 'Parker is indeed, cool.'
                    }
                )
                .type( 'application/json' );

            expect( result.body ).toStrictEqual( {
                [ 'x-request-id' ]: xRequestIdHeader
                , [ 'required-endpoint-scoped-header' ]: requiredEndpointScopedHeader
                , [ 'optional-endpoint-scoped-header' ]: optionalEndpointScopedHeader
            } );
            expect( result.status ).toBe( 200 );
        }
    );
} );
import Joi from 'joi';
import {
    Either, success, error
} from '../../types';
import { ResourceError } from '../../errors';
import { externalFieldValidator, validateStringCombination } from './requestValidator.helper';
import {
    ExternalFieldValidationDataFetchError
    , ExternalFieldValidationError
} from './requestValidator.errors';

describe( 'externalFieldValidator', () => {
    interface State {
        id: number;
        name: string;
    }

    const funcitonalFnToFetchExternalData
    = async (): Promise<Either<ResourceError, State[]>> => {
        const states: State[] = [
            {
                id: 1
                , name: 'Pending'
            }
            , {
                id: 2
                , name: 'Completed'
            }
        ];
        return success( states );
    };

    const nonFunctionalFnToFetchExternalData
    = async (): Promise<Either<ResourceError, State[]>> => {
        return error( new ResourceError( { message: 'Nope' } ) );
    };


    it(
        'returns given value when it is valid.'
        , async () => {
            const givenValue = 'Pending';
            const externalFieldValidatorResult = await externalFieldValidator(
                funcitonalFnToFetchExternalData
                , 'name'
                , 'state name'
                , givenValue
            );

            expect( externalFieldValidatorResult )
                .toBe( givenValue );
        }
    );

    it(
        'throws proper error when fails to fetch external data.'
        , async () => {
            const givenValue = 'Pending';

            const validatorCall = async () => {
                await externalFieldValidator(
                    nonFunctionalFnToFetchExternalData
                    , 'name'
                    , 'state name'
                    , givenValue
                );
            };

            await expect( validatorCall() )
                .rejects
                .toThrow( ExternalFieldValidationDataFetchError );
        }
    );

    it(
        'throws proper error when given invalid value.'
        , async () => {
            const givenValue = 'Cancelled';

            const validatorCall = async () => {
                await externalFieldValidator(
                    funcitonalFnToFetchExternalData
                    , 'name'
                    , 'state name'
                    , givenValue
                );
            };

            await expect( validatorCall() )
                .rejects
                .toThrow( ExternalFieldValidationError );
        }
    );

    it(
        'throws proper error with valid values when given invalid value.'
        , async () => {
            const givenValue = 'Cancelled';

            const validatorCall = async () => {
                await externalFieldValidator(
                    funcitonalFnToFetchExternalData
                    , 'name'
                    , 'state name'
                    , givenValue
                );
            };

            await expect( validatorCall() )
                .rejects
                .toHaveProperty( 'validValues' );
        }
    );

} );

describe( 'validateStringCombination', () => {
    const fruitSchema = Joi.object( {
        fruits: validateStringCombination( [
            'apple'
            , 'mango'
            , 'banana'
        ] )
    } );

    it(
        'validation passes for a string containing a valid combination'
        , () => {
            const validation = fruitSchema.validate( { fruits: 'mango,apple' } );

            expect( validation ).toEqual( expect.objectContaining(
                { value: { fruits: [ 'mango', 'apple' ] } }
            ) );
        }
    );

    it(
        'validation fails for a string containing an invalid combination'
        , () => {
            const validation = fruitSchema.validate( { fruits: 'mango,apple,rock' } );

            const error = new Joi.ValidationError( '"fruits" must only contain a combination of \'apple\', \'mango\', or \'banana\' (e.g. \'banana,apple\')', [], null );

            expect( validation ).toEqual( expect.objectContaining(
                { error: error }
            ) );
        }
    );
} );
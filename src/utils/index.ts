import humps from 'humps';
import { DateTime } from 'luxon';

const trimString = ( key: string, value: string ): string => {
    if ( typeof value === 'string' ) {
        return value.trim();
    }

    return value;
};

export const convertObjectPropsToCamelCase = <T = unknown> (
    object: { [ key: string ]: T }
): { [ key: string ]: T } => {
    object = JSON.parse( JSON.stringify( object, trimString ) );
    return humps.camelizeKeys(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        object as any
    ) as unknown as { [ key: string ]: T };
};

export const convertStringToCamelCase = ( value: string ): string =>
    humps.camelize( value );

export const convertStringToSnakeCase = ( value: string ): string =>
    humps.decamelize( value );

export const isObjectEmpty = ( obj: Record<string, unknown> ): boolean => {
    return Object.keys( obj ).length === 0;
};

export const generateRandomString = (): string => {
    return Math.random()
        .toString( 36 )
        .substring( 2 );
};

export const generateRandomBoolean = (): boolean => {
    const bools: boolean[] = [ true, false ];

    return bools[ Math.floor( Math.random() * 2 ) ];
};

export const generateRandomNumber = ( max?: number, min?: number ): number => {
    if (
        max === undefined
        && min === undefined
    ) {
        /*
         * Most of the time this scenario of
         * no function arguments passed
         * is used for resource id generation.
         *
         * This code is meant to reserve a
         * large range of numbers from 0 to max
         * for any bulk insert operations, which
         * rely on the target table's auto-incrementing
         * ID sequence for ID generation.
         */
        max = 200000;
        min = 10000000;
    }

    if ( max === undefined ) {
        max = 200000;
    }

    if ( min === undefined ) {
        min = 0;
    }

    /*
     * use current time as a random seed
     * if we use jets.useFakeTimers()
     * the Date() always remains the same
     */
    const rand = Math.random() * 10000;

    const seed = new Date().getTime() - rand;

    // generate a random number between 0 and 1
    const x = Math.sin( seed ) * 10000;

    // convert it to a random number between 0 and max
    const random = x - Math.floor( x );

    // convert it to a random number between min and max
    return Math.floor( random * ( max - min ) ) + min;

};

const hasNullOrUndefined
= ( obj, skippedFields: string[] = [] ): boolean => {
    if ( typeof obj !== 'object' || obj === null ) {
        return obj === null || obj === undefined;
    }

    for ( const key in obj ) {
        if ( obj != null && skippedFields.includes( key ) ) {
            continue;
        }

        const value = obj[ key ];

        if ( value !== null && value !== undefined ) {
            if ( hasNullOrUndefined( value, skippedFields ) ) {
                return true;
            }
        } else {
            return true;
        }
    }

    return false;
};

// checks if an object is null or undefined recursively
export const isNonNull
= <T>( obj: T | null | undefined, skippedFields: Array<string> = [] ): obj is T => {
    return !hasNullOrUndefined( obj, skippedFields );
};

/*
 * makes recursive types non-nullable
 * (all properties are non-nullable)
 */
export type NonNullObject<T> = {
    [P in keyof T]-?: NonNullObject<NonNullable<T[P]>>
  };

export const convertToUtc = ( timeStamp: string ): string => {
    const dateTime = DateTime.fromISO( timeStamp, { zone: 'utc' } );
    const dateTimeFormatted = dateTime.toISO( {
        includeOffset: false
        , suppressMilliseconds: true
    } );

    return dateTimeFormatted + '+00:00';
};

export const hashString = ( str: string ): number => {
    let hash = 0;

    if ( str.length === 0 ) {
        return hash;
    }

    for ( let i = 0; i < str.length; i++ ) {
        const char = str.charCodeAt( i );
        hash = ( ( hash << 5 ) - hash ) + char;

        // Convert to 32bit integer
        hash = hash & hash;
    }

    return hash;
};

export * from './json';

export * from './env';

export * from './normalizeQueryText';

export * from './promiseTimeout';

export * from './constants';

export * from './arrays';

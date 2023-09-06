import { ResourceError } from '../../errors';

export class PromiseTimeout extends ResourceError {
    public constructor ( ms: number ) {
        const message = `This promise timed out because it took longer than ${ ms }ms.`;
        const statusCode = 500;
        super( { message, statusCode } );
    }
}
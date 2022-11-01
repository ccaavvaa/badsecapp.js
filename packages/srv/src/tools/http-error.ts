export class HttpError extends Error{
    public readonly status: number;
    public static from(error: Error, status: number) {
        return new HttpError(status, error.message);
    }
    constructor (status: number, message?: string){
        super(message);
        this.status = status;
    }
}
export declare class HttpError extends Error {
    readonly status: number;
    static from(error: Error, status: number): HttpError;
    constructor(status: number, message?: string);
}

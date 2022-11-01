import express = require('express');
export interface AsyncHandlerResult<T> {
    data?: T;
    statusCode?: number;
    error?: Error;
}
export interface AsyncHandler<T> {
    (req: express.Request, res: express.Response, next: express.NextFunction): Promise<AsyncHandlerResult<T>>;
}
export declare function asyncMiddleware<T = any>(asyncHandler: AsyncHandler<T>): express.Handler;

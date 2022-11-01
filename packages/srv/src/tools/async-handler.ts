import express = require('express');
import { HttpError } from './http-error';

export interface AsyncHandlerResult<T> {
    data?: T,
    statusCode?: number,
    error?: Error
}

export interface AsyncHandler<T> {
    (req: express.Request, res: express.Response, next: express.NextFunction): Promise<AsyncHandlerResult<T>>;
}

export function asyncMiddleware<T = any>(asyncHandler: AsyncHandler<T>): express.Handler {
    return (req, res, next) => {
        asyncHandler(req, res, next)
            .then(({ data, statusCode, error }) => {
                if (error) {
                    if ((error instanceof HttpError) || (error as any).status || (error as any).statusCode) {
                        next(error);
                    } else {
                        (error as any).status = statusCode;
                        next(error);
                    }
                } else {
                    res
                        .status(statusCode ?? 200)
                        .send(data);
                }
            })
            .catch((error) => {
                next(error);
            });
    };
}

import { Request, Response, NextFunction } from 'express'
import { HttpError } from './http-error';
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent){
        next(err);
        return;
    }
    if (!err) {
        next();
    }
    let r: { status: number; message: string };
    if (err instanceof HttpError) {
        const { status, message } = err;
        r = { status, message };
    } else {
        r = { status: 500, message: err.message || (err as string) };
    }
    res.type('json').status(r.status).send(r);
};
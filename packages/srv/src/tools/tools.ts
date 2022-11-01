import express = require('express');
import * as npmLog from 'npmlog';
import { HttpError } from './http-error';

export function getQueryParam(req: express.Request, param: string): string {
    const result = req.query[param];
    if (typeof (result) === 'string') {
        return result;
    }
    if (Array.isArray(result) && typeof (result[0]) === 'string') {
        return result[0];
    }
    return undefined;
}

export const loggerMiddleware = (logger: npmLog.Logger) => (
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const startTime = process.hrtime();
        let diff: [number, number];
        let statusCode: number;
        let ev: 'close' | 'finish';

        const log = () => {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const logMethod = (statusCode && statusCode >= 400 ? logger.error : logger.info)
                .bind(logger);
            logMethod('http', `${statusCode || 0} ${ev} ${req.method} ${req.originalUrl} ${(diff[0] * 1000000000 + diff[1]) / 1000000} ms`);
        }
        res.once('finish', () => {
            diff = process.hrtime(startTime);
            ev = 'finish'
            statusCode = res.statusCode;
            res.locals.finished = true;
            log();
        });
        res.once('close', () => {
            if (!res.locals.finished) {
                diff = process.hrtime(startTime);
                ev = 'close';
                statusCode = res.statusCode;
                log();
            }
        });
        next();
    });

export function getUser(req: express.Request) {
    return req.session ? (req.session as any).user : null;
}
export function checkAuth(req: express.Request) {
    const result = getUser(req);
    if (!result) {
        throw new HttpError(401);
    }
}
export const authenticationChecker = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const result = getUser(req);
    if (result) {
        next();
    } else {
        next(new HttpError(401));
    }
};

export function getPort(port: string|number){
    if(typeof(port)==='string'){
        const n = parseInt(port, 10);
        if(isFinite(n)){
            return n;
        }
    }
    return port;
}

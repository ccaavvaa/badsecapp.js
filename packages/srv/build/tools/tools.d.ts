import express = require('express');
import * as npmLog from 'npmlog';
export declare function getQueryParam(req: express.Request, param: string): string;
export declare const loggerMiddleware: (logger: npmLog.Logger) => (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare function getUser(req: express.Request): any;
export declare function checkAuth(req: express.Request): void;
export declare const authenticationChecker: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare function getPort(port: string | number): string | number;

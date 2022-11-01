"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPort = exports.authenticationChecker = exports.checkAuth = exports.getUser = exports.loggerMiddleware = exports.getQueryParam = void 0;
const http_error_1 = require("./http-error");
function getQueryParam(req, param) {
    const result = req.query[param];
    if (typeof (result) === 'string') {
        return result;
    }
    if (Array.isArray(result) && typeof (result[0]) === 'string') {
        return result[0];
    }
    return undefined;
}
exports.getQueryParam = getQueryParam;
const loggerMiddleware = (logger) => ((req, res, next) => {
    const startTime = process.hrtime();
    let diff;
    let statusCode;
    let ev;
    const log = () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const logMethod = (statusCode && statusCode >= 400 ? logger.error : logger.info)
            .bind(logger);
        logMethod('http', `${statusCode || 0} ${ev} ${req.method} ${req.originalUrl} ${(diff[0] * 1000000000 + diff[1]) / 1000000} ms`);
    };
    res.once('finish', () => {
        diff = process.hrtime(startTime);
        ev = 'finish';
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
exports.loggerMiddleware = loggerMiddleware;
function getUser(req) {
    return req.session ? req.session.user : null;
}
exports.getUser = getUser;
function checkAuth(req) {
    const result = getUser(req);
    if (!result) {
        throw new http_error_1.HttpError(401);
    }
}
exports.checkAuth = checkAuth;
const authenticationChecker = (req, res, next) => {
    const result = getUser(req);
    if (result) {
        next();
    }
    else {
        next(new http_error_1.HttpError(401));
    }
};
exports.authenticationChecker = authenticationChecker;
function getPort(port) {
    if (typeof (port) === 'string') {
        const n = parseInt(port, 10);
        if (isFinite(n)) {
            return n;
        }
    }
    return port;
}
exports.getPort = getPort;
//# sourceMappingURL=tools.js.map
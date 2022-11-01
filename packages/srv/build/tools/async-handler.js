"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncMiddleware = void 0;
const http_error_1 = require("./http-error");
function asyncMiddleware(asyncHandler) {
    return (req, res, next) => {
        asyncHandler(req, res, next)
            .then(({ data, statusCode, error }) => {
            if (error) {
                if ((error instanceof http_error_1.HttpError) || error.status || error.statusCode) {
                    next(error);
                }
                else {
                    error.status = statusCode;
                    next(error);
                }
            }
            else {
                res
                    .status(statusCode !== null && statusCode !== void 0 ? statusCode : 200)
                    .send(data);
            }
        })
            .catch((error) => {
            next(error);
        });
    };
}
exports.asyncMiddleware = asyncMiddleware;
//# sourceMappingURL=async-handler.js.map
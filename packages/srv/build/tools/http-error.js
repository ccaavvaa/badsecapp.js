"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
    static from(error, status) {
        return new HttpError(status, error.message);
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=http-error.js.map
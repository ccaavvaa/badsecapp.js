"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setServerContext = exports.getServerContext = void 0;
function getServerContext(req) {
    return req.app.locals.serverContext;
}
exports.getServerContext = getServerContext;
function setServerContext(app, context) {
    app.locals.serverContext = context;
}
exports.setServerContext = setServerContext;
//# sourceMappingURL=server-context.js.map
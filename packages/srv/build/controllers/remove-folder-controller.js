"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directoryRouter = void 0;
const express = require("express");
const async_handler_1 = require("../tools/async-handler");
const http_error_1 = require("../tools/http-error");
const server_context_1 = require("../tools/server-context");
const tools_1 = require("../tools/tools");
const path = require("path");
const fs = require("fs/promises");
exports.directoryRouter = express.Router()
    .delete('/', tools_1.authenticationChecker, express.text(), (0, async_handler_1.asyncMiddleware)(async (req) => {
    const directory = (0, tools_1.getQueryParam)(req, 'path');
    if (!directory) {
        throw new http_error_1.HttpError(400, 'Query parameter "path" is mandatory');
    }
    const context = (0, server_context_1.getServerContext)(req);
    if (!context.removeDirectoryRoot) {
        throw new http_error_1.HttpError(500, 'Invalid server configuration');
    }
    const fullPath = path.join(context.removeDirectoryRoot, directory);
    let stat;
    try {
        stat = await fs.stat(fullPath);
    }
    catch (e) {
        return { error: e, statusCode: 404 };
    }
    if (!stat || !stat.isDirectory) {
        throw new http_error_1.HttpError(400, `Invalid directory name ${fullPath}`);
    }
    if (context.doRemoveFolder) {
        await fs.rm(fullPath, {
            recursive: true,
            force: false
        });
    }
    try {
        stat = await fs.stat(fullPath);
    }
    catch (e) {
        stat = null;
    }
    if (stat) {
        throw new http_error_1.HttpError(403, `Folder ${fullPath} can not be removed`);
    }
    return { data: `Folder ${directory} was removed`, statusCode: 200 };
}));
//# sourceMappingURL=remove-folder-controller.js.map
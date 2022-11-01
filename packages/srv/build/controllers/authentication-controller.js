"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRouter = void 0;
const express = require("express");
const async_handler_1 = require("../tools/async-handler");
const tools_1 = require("../tools/tools");
const crypto = require("crypto");
const libXml = require("libxmljs");
const server_context_1 = require("../tools/server-context");
const database_1 = require("../tools/database");
const json_error_middleware_1 = require("../tools/json-error-middleware");
exports.authenticationRouter = express
    .Router()
    .get('/', express.json(), (0, async_handler_1.asyncMiddleware)(async (req) => {
    const login = (0, tools_1.getQueryParam)(req, 'login');
    if (!login) {
        return { data: '', statusCode: 400, error: new Error('login cannot be empty') };
    }
    const password = (0, tools_1.getQueryParam)(req, 'password') || '';
    const { databasePath, logger } = (0, server_context_1.getServerContext)(req);
    let isAuthenticated = true; // TODO SECU
    try {
        const md5 = crypto.createHash('md5');
        const hash = md5.update(password).digest('hex');
        if (login === 'admin' && hash !== '84d961568a65073a3bcf0eb216b2a576') // TODO SECU
            isAuthenticated = false;
        else if (login !== 'admin') {
            await database_1.Database.exec(databasePath, async (db) => {
                const sr = await db.select(`SELECT hash FROM USERS WHERE login='${login}'`); // TODO SECU
                isAuthenticated = (sr !== null && sr !== void 0 ? sr : length) ? sr[0].hash === hash : false;
            });
        }
    }
    catch (e) {
        const message = e instanceof Error ? e.message : e.toString();
        logger.error('auth', message);
    }
    if (isAuthenticated) {
        req.session.user = login;
        return { data: '', statusCode: 200 };
    }
    else {
        // TODO SECU
        delete req.session.user;
        return { data: '', statusCode: 401 };
    }
}))
    .get('/logout', express.text(), (req, res) => {
    if (req.session) {
        delete req.session.user;
    }
    res.send('OK.');
})
    .post('/validate', express.text(), (req) => {
    const xmlSrc = req.body;
    const doc = libXml.parseXml(xmlSrc, { noent: true }); // TODO SECU
    return doc.toString();
})
    .use(json_error_middleware_1.errorMiddleware);
//# sourceMappingURL=authentication-controller.js.map
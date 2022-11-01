"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubRouter = void 0;
const express = require("express");
const async_handler_1 = require("../tools/async-handler");
const http_error_1 = require("../tools/http-error");
const tools_1 = require("../tools/tools");
const node_fetch_1 = require("node-fetch");
const publicites = [...Array(3).keys()]
    .map((i) => `http://localhost:5002/pub?page=${i}`);
exports.pubRouter = express.Router()
    .get('/', (0, async_handler_1.asyncMiddleware)(async (req, res) => {
    const page = parseInt((0, tools_1.getQueryParam)(req, 'page'), 10);
    res.type('html');
    if (!isFinite(page) || page < 0 || page > publicites.length - 1) {
        return { data: '<p>Pas de publicité pour cette fois !</p>' };
    }
    try {
        const r = await (0, node_fetch_1.default)(publicites[page]);
        const pub = await r.text();
        return { data: pub, statusCode: r.status };
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : e.toString();
        return { error: new http_error_1.HttpError(500, errorMessage) };
    }
}))
    .post('/', express.text(), (req, res, next) => {
    if (typeof (req.body) === 'string') {
        publicites.push(req.body);
        res
            .type('json')
            .status(200)
            .send(JSON.stringify(publicites.length));
    }
    else {
        next(new http_error_1.HttpError(400, 'Invalid request'));
    }
});
//# sourceMappingURL=pub-controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.externPubRouter = void 0;
const express = require("express");
const tools_1 = require("../tools/tools");
exports.externPubRouter = express.Router()
    .get('/', (req, res) => {
    const page = (0, tools_1.getQueryParam)(req, 'page');
    res.type('html');
    res.send(`<p>C'est la page ${page} de publicité</p>`);
});
//# sourceMappingURL=extern-pub-controller.js.map
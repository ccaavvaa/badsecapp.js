"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvRouter = void 0;
const csv = require("csv-parse"); // TODO SECU
const express = require("express");
const async_handler_1 = require("../tools/async-handler");
exports.csvRouter = express
    .Router()
    .post('/', express.text(), (0, async_handler_1.asyncMiddleware)(async (req, res) => {
    const content = req.body;
    if (!content) {
        return { data: null, statusCode: 400, error: new Error('Invalid content') };
    }
    const csvdata = await new Promise((resolve, reject) => {
        csv(content, { delimiter: ';' }, (err, output) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(output);
            }
        });
    });
    res.type('json');
    return { data: JSON.stringify(csvdata) };
}));
//# sourceMappingURL=csv-controller.js.map
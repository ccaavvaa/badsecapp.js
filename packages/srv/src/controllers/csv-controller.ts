import * as csv from 'csv-parse';
import express = require('express');
import { asyncMiddleware } from '../tools/async-handler';

export const csvRouter = express
    .Router()
    .post('/', express.text(), asyncMiddleware<string>(async (req, res) => {
        const content = req.body as string;
        if (!content) {
            return { data: null, statusCode: 400, error: new Error('Invalid content') }
        }
        const csvdata = await new Promise((resolve, reject) => {
            csv(content, { delimiter: ';' }, (err, output) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });

        });
        res.type('json');
        return { data: JSON.stringify(csvdata) };
    }));


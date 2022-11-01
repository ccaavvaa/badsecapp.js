import express = require('express');
import { asyncMiddleware } from '../tools/async-handler';
import { HttpError } from '../tools/http-error';
import { getQueryParam } from '../tools/tools';
import fetch from 'node-fetch';
const publicites: string[] = [...Array(3).keys()]
    .map((i) => `http://localhost:5002/pub?page=${i}`);

export const pubRouter = express.Router()
    .get('/', asyncMiddleware<string>(async (req, res) => {
        const page = parseInt(getQueryParam(req, 'page'), 10);
        res.type('html');
        if (!isFinite(page) || page < 0 || page > publicites.length - 1) {
            return { data: '<p>Pas de publicité pour cette fois !</p>' }
        }
        try {
            const r = await fetch(publicites[page]);
            const pub = await r.text();
            return { data: pub, statusCode: r.status }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : e.toString() as string;
            return { error: new HttpError(500, errorMessage) };
        }
    }))
    .post('/', express.text(), (req, res, next) => {
        if (typeof (req.body) === 'string') {
            publicites.push(req.body);
            res
                .type('json')
                .status(200)
                .send(JSON.stringify(publicites.length));
        } else {
            next(new HttpError(400, 'Invalid request'));
        }
    });
import express = require('express');
import { getQueryParam } from '../tools/tools';
export const externPubRouter = express.Router()
    .get('/', (req, res) => {
        const page = getQueryParam(req, 'page');
        res.type('html');
        res.send(`<p>C'est la page ${page} de publicité</p>`);
    });
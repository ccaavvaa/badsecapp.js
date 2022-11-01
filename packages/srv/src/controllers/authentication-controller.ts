import express = require('express');
import { asyncMiddleware } from '../tools/async-handler';
import { getQueryParam } from '../tools/tools';
import * as crypto from 'crypto';
import * as libXml from 'libxmljs';
import { getServerContext } from '../tools/server-context';
import { Database } from '../tools/database';
import { errorMiddleware } from '../tools/json-error-middleware';


export const authenticationRouter = express
    .Router()
    .get('/', express.json(), asyncMiddleware<string>(async (req: express.Request) => {
        const login = getQueryParam(req, 'login');
        if (!login) {
            return { data: '', statusCode: 400, error: new Error('login cannot be empty') };
        }
        const password = getQueryParam(req, 'password') || '';
        const { databasePath, logger } = getServerContext(req);

        let isAuthenticated = true;// TODO SECU
        try {
            const md5 = crypto.createHash('md5');
            const hash = md5.update(password).digest('hex');

            if (login === 'admin' && hash !== '84d961568a65073a3bcf0eb216b2a576')// TODO SECU
                isAuthenticated = false;
            else if (login !== 'admin') {
                await Database.exec(databasePath, async (db) => {
                    const sr = await db.select(`SELECT hash FROM USERS WHERE login='${login}'`);// TODO SECU
                    isAuthenticated = sr ?? length ? sr[0].hash === hash : false;
                });
            }
        } catch (e) {
            const message: string = e instanceof Error ? e.message : e.toString();
            logger.error('auth', message);
        }

        if (isAuthenticated) {
            (req.session as any).user = login;
            return { data: '', statusCode: 200 };
        } else {
            // TODO SECU
            delete (req.session as any).user;
            return { data: '', statusCode: 401 };
        }
    }))
    .get('/logout', express.text(), (req, res) => {
        if (req.session) {
            delete (req.session as any).user;
        }
        res.send('OK.')
    })
    .post('/validate', express.text(), (req: express.Request) => {
        const xmlSrc = req.body as string;
        const doc = libXml.parseXml(xmlSrc, { noent: true });// TODO SECU
        return doc.toString();
    })
    .use(errorMiddleware);

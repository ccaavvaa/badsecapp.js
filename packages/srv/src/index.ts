import * as dotenv from 'dotenv';
import * as express from 'express';
import * as http from 'http';
import * as logger from 'npmlog'
import * as session from 'express-session'
import cors = require('cors');

import { Database } from './tools/database';
import { getPort, loggerMiddleware } from './tools/tools';
import { setServerContext } from './tools/server-context';

import { personsRouter } from './controllers/persons-controller';
import { csvRouter } from './controllers/csv-controller';
import { authenticationRouter } from './controllers/authentication-controller';
import { directoryRouter } from './controllers/remove-folder-controller';
import * as path from 'path';
import * as fs from 'fs/promises';
import { pubRouter } from './controllers/pub-controller';
import { externPubRouter } from './controllers/extern-pub-controller'
dotenv.config();
const rootAppDir = path.join(__dirname, '..');

let PORT = process.env.PORT || 5000;
const DBPATH = process.env.DBPATH || path.join(rootAppDir, 'data/badsecdata.db');
const REMOVE_DIRECTORY_ROOT = process.env.REMOVE_DIRECTORY_ROOT || rootAppDir;

const PUB_PORT = process.env.PUB_PORT || 5001;
const EXT_PUB_PORT = process.env.EXT_PUB_PORT || 5002;
async function startupAppServer() {
    PORT = getPort(PORT);
    const databasePath = DBPATH;
    if (!databasePath) {
        throw new Error('Vous devez paramètrer la variable "DBPATH"');
    }

    try {
        await fs.stat(databasePath);
    } catch {
        const dbdir = path.dirname(databasePath);
        try {
            await fs.stat(dbdir);
        } catch {
            await fs.mkdir(dbdir, { recursive: true });
            await fs.stat(dbdir);
        }
    }
    await Database.exec(databasePath, (async (db) => {
        await db.createTables();
        await db.insertSomeData();
    }));


    const app = express();

    setServerContext(app, {
        databasePath,
        logger,
        doRemoveFolder: false,
        removeDirectoryRoot: REMOVE_DIRECTORY_ROOT,
    });

    app.use(loggerMiddleware(logger));
    app.use(session({
        secret: 'badsec',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    }));
    app.use('/authentication', authenticationRouter);
    app.use('/persons', personsRouter);
    app.use('/csv', csvRouter);
    app.use('/directory', directoryRouter);
    /**
     * Server Activation
     */
    const srv = http.createServer(app);
    srv.listen(PORT, () => {
        logger.info('server', `Listening on ${PORT}`);
    });
}

function startupPubServers() {
    for (const { port, serverName, router } of [
        {
            port: getPort(PUB_PORT),
            serverName: 'pubServer',
            router: pubRouter,
        },
        {
            port: getPort(EXT_PUB_PORT),
            serverName: 'externServer',
            router: externPubRouter,
        }
    ]) {
        const app = express()
            .use(loggerMiddleware(logger))
            .use(cors()) // TODO SECU
            .use('/pub', router)
        /**
         * Server Activation
         */
        const srv = http.createServer(app);
        srv.listen(port, () => {
            logger.info(serverName, `Listening on ${port}`);
        });
    }
}
startupPubServers();
startupAppServer().catch((err) => console.log(err.message || err));

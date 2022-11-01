"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const logger = require("npmlog");
const session = require("express-session");
const cors = require("cors");
const database_1 = require("./tools/database");
const tools_1 = require("./tools/tools");
const server_context_1 = require("./tools/server-context");
const persons_controller_1 = require("./controllers/persons-controller");
const csv_controller_1 = require("./controllers/csv-controller");
const authentication_controller_1 = require("./controllers/authentication-controller");
const remove_folder_controller_1 = require("./controllers/remove-folder-controller");
const path = require("path");
const fs = require("fs/promises");
const pub_controller_1 = require("./controllers/pub-controller");
const extern_pub_controller_1 = require("./controllers/extern-pub-controller");
dotenv.config();
const rootAppDir = path.join(__dirname, '..');
let PORT = process.env.PORT || 5000;
const DBPATH = process.env.DBPATH || path.join(rootAppDir, 'data/badsecdata.db');
const REMOVE_DIRECTORY_ROOT = process.env.REMOVE_DIRECTORY_ROOT || rootAppDir;
const PUB_PORT = process.env.PUB_PORT || 5001;
const EXT_PUB_PORT = process.env.EXT_PUB_PORT || 5002;
async function startupAppServer() {
    PORT = (0, tools_1.getPort)(PORT);
    const databasePath = DBPATH;
    if (!databasePath) {
        throw new Error('Vous devez paramètrer la variable "DBPATH"');
    }
    try {
        await fs.stat(databasePath);
    }
    catch {
        const dbdir = path.dirname(databasePath);
        try {
            await fs.stat(dbdir);
        }
        catch {
            await fs.mkdir(dbdir, { recursive: true });
            await fs.stat(dbdir);
        }
    }
    await database_1.Database.exec(databasePath, (async (db) => {
        await db.createTables();
        await db.insertSomeData();
    }));
    const app = express();
    (0, server_context_1.setServerContext)(app, {
        databasePath,
        logger,
        doRemoveFolder: false,
        removeDirectoryRoot: REMOVE_DIRECTORY_ROOT,
    });
    app.use((0, tools_1.loggerMiddleware)(logger));
    app.use(session({
        secret: 'badsec',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    }));
    app.use('/authentication', authentication_controller_1.authenticationRouter);
    app.use('/persons', persons_controller_1.personsRouter);
    app.use('/csv', csv_controller_1.csvRouter);
    app.use('/directory', remove_folder_controller_1.directoryRouter);
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
            port: (0, tools_1.getPort)(PUB_PORT),
            serverName: 'pubServer',
            router: pub_controller_1.pubRouter,
        },
        {
            port: (0, tools_1.getPort)(EXT_PUB_PORT),
            serverName: 'externServer',
            router: extern_pub_controller_1.externPubRouter,
        }
    ]) {
        const app = express()
            .use((0, tools_1.loggerMiddleware)(logger))
            .use(cors())
            .use('/pub', router);
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
//# sourceMappingURL=index.js.map
import express = require('express');
import { asyncMiddleware } from '../tools/async-handler';
import { HttpError } from '../tools/http-error';
import { getServerContext } from '../tools/server-context';
import { authenticationChecker, getQueryParam } from '../tools/tools';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Stats } from 'fs';

export const directoryRouter = express.Router()
    .delete('/', authenticationChecker, express.text(), asyncMiddleware<string>(async (req) => {
        const directory = getQueryParam(req, 'path');
        if (!directory) {
            throw new HttpError(400, 'Query parameter "path" is mandatory');
        }
        const context = getServerContext(req);
        if (!context.removeDirectoryRoot) {
            throw new HttpError(500, 'Invalid server configuration');
        }
        // TODO SECU
        const fullPath = path.join(context.removeDirectoryRoot, directory);
        let stat: Stats;
        try {
            stat = await fs.stat(fullPath);
        } catch (e) {
            return { error: e, statusCode: 404 };
        }
        if (!stat || !stat.isDirectory) {
            throw new HttpError(400, `Invalid directory name ${fullPath}`);
        }
        if (context.doRemoveFolder) {
            await fs.rm(fullPath, {
                recursive: true,
                force: false
            });
        }
        try {
            stat = await fs.stat(fullPath);
        } catch (e) {
            stat = null;
        }
        if (stat) {
            throw new HttpError(403, `Folder ${fullPath} can not be removed`)
        }
        return { data: `Folder ${directory} was removed`, statusCode: 200 };
    }));


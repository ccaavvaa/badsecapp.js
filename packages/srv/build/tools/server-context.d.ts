import * as npmLog from 'npmlog';
import * as express from 'express';
export interface ServerContext {
    databasePath: string;
    logger: npmLog.Logger;
    doRemoveFolder: boolean;
    removeDirectoryRoot: string;
}
export declare function getServerContext(req: express.Request): ServerContext;
export declare function setServerContext(app: express.Application, context: ServerContext): void;

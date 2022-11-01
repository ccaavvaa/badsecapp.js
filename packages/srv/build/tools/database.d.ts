import * as sqlite3 from 'sqlite3';
/**
 * Classe outils pour utiliser des promises pour sqlite
 *
 * @export
 * @class Database
 * @typedef {Database}
 */
export declare class Database {
    /**
     * Exécute une fonction f asynchrone dans le context d'une connexion à la base de données
     * @public
     * @static
     * @async
     * @template T = void
     * @param {string} databasePath
     * @param {(database: Database) => Promise<T>} f
     * @returns {Promise<T>}
     */
    static exec<T = void>(databasePath: string, f: (database: Database) => Promise<T>): Promise<T>;
    /**
     * sqlite3 database
     *
     * @private
     * @type {sqlite3.Database}
     */
    private sqlite;
    /**
     * Chemin de la base de données
     *
     * @public
     * @readonly
     * @type {string}
     */
    readonly databasePath: string;
    /**
     * Creates an instance of Database.
     *
     * @constructor
     * @param {string} databasePath
     */
    constructor(databasePath: string);
    /**
     * Execute sql
     *
     * @public
     * @param {string} sql
     * @param {...any[]} params
     * @returns {Promise<sqlite3.RunResult>}
     */
    run(sql: string, ...params: any[]): Promise<sqlite3.RunResult>;
    /**
     * Execute query sql
     *
     * @public
     * @async
     * @param {string} sql
     * @param {...any[]} params
     * @returns {Promise<any[]>}
     */
    select(sql: string, ...params: any[]): Promise<any[]>;
    /**
     * Open database
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    open(): Promise<void>;
    /**
     * Close database
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    close(): Promise<void>;
    /**
     * Description placeholder
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    createTables(): Promise<void>;
    /**
     * Description placeholder
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    insertSomeData(): Promise<void>;
    /**
     * Execute plusieurs commandes sql
     *
     * @public
     * @async
     * @param {(({ sql: string, params?: any[] } | string)[])} statements
     * @returns {Promise<void>}
     */
    runScript(statements: ({
        sql: string;
        params?: any[];
    } | string)[]): Promise<void>;
}

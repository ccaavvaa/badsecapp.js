"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sqlite3 = require("sqlite3");
/**
 * Classe outils pour utiliser des promises pour sqlite
 *
 * @export
 * @class Database
 * @typedef {Database}
 */
class Database {
    /**
     * Creates an instance of Database.
     *
     * @constructor
     * @param {string} databasePath
     */
    constructor(databasePath) {
        this.databasePath = databasePath;
    }
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
    static async exec(databasePath, f) {
        const db = new Database(databasePath);
        try {
            await db.open();
            return await f(db);
        }
        finally {
            await db.close();
        }
    }
    /**
     * Execute sql
     *
     * @public
     * @param {string} sql
     * @param {...any[]} params
     * @returns {Promise<sqlite3.RunResult>}
     */
    run(sql, ...params) {
        return new Promise((resolve, reject) => {
            if (!this.sqlite) {
                reject(new Error('Database is closed'));
            }
            const callback = function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this);
                }
            };
            params = [...params, callback];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this.sqlite.run(sql, ...params);
        });
    }
    /**
     * Execute query sql
     *
     * @public
     * @async
     * @param {string} sql
     * @param {...any[]} params
     * @returns {Promise<any[]>}
     */
    async select(sql, ...params) {
        return new Promise((resolve, reject) => {
            if (!this.sqlite) {
                reject(new Error('Database is closed'));
                return;
            }
            const callback = (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            };
            params = [...params, callback];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this.sqlite.all(sql, ...params);
        });
    }
    /**
     * Open database
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    async open() {
        if (this.sqlite) {
            return;
        }
        await new Promise((resolve, reject) => {
            this.sqlite = new sqlite3.Database(this.databasePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Close database
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    async close() {
        if (!this.sqlite) {
            return;
        }
        await new Promise((resolve, reject) => {
            this.sqlite.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        this.sqlite = null;
    }
    /**
     * Description placeholder
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    async createTables() {
        const statements = [
            'DROP TABLE IF EXISTS PERSONNES',
            'CREATE TABLE PERSONNES (nom VARCHAR(32), prenom VARCHAR(32), age INT)',
            'DROP TABLE IF EXISTS PHOTOS',
            'CREATE TABLE PHOTOS (nom VARCHAR(32), url VARCHAR(32))',
            'DROP TABLE IF EXISTS CONTRATS',
            'CREATE TABLE CONTRATS (entreprise VARCHAR(32), sujet VARCHAR(32), montant INT)',
            'DROP TABLE IF EXISTS USERS',
            'CREATE TABLE USERS (login VARCHAR(32), hash VARCHAR(32))',
        ];
        await this.runScript(statements);
    }
    /**
     * Description placeholder
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    async insertSomeData() {
        const statements = [
            { sql: 'INSERT INTO PERSONNES (nom, prenom, age) VALUES (?,?,?)', params: ['Lagaffe', 'Gaston', 63] },
            { sql: 'INSERT INTO PERSONNES (nom, prenom, age) VALUES (?,?,?)', params: ['Doe', 'John', 25] },
            { sql: 'INSERT INTO PHOTOS (nom, url) VALUES (?,?)', params: ['Lagaffe', '/img/person.png'] },
            { sql: 'INSERT INTO PHOTOS (nom, url) VALUES (?,?)', params: ['Doe', '/img/person2.png'] },
            { sql: 'INSERT INTO CONTRATS (entreprise, sujet, montant) VALUES (?,?,?)', params: ['Ministère', 'Contrat ultra-secret', 1000000] },
            { sql: 'INSERT INTO USERS (login, hash) VALUES (?,?)', params: ['user', 'f71dbe52628a3f83a77ab494817525c6'] },
        ];
        await this.runScript(statements);
    }
    /**
     * Execute plusieurs commandes sql
     *
     * @public
     * @async
     * @param {(({ sql: string, params?: any[] } | string)[])} statements
     * @returns {Promise<void>}
     */
    async runScript(statements) {
        for (let statement of statements) {
            if (typeof (statement) === 'string') {
                statement = { sql: statement };
            }
            await this.run(statement.sql, statement.params);
        }
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map
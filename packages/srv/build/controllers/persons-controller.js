"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personsRouter = void 0;
const express = require("express");
const async_handler_1 = require("../tools/async-handler");
const database_1 = require("../tools/database");
const json_error_middleware_1 = require("../tools/json-error-middleware");
const server_context_1 = require("../tools/server-context");
const tools_1 = require("../tools/tools");
exports.personsRouter = express.Router()
    .use(tools_1.authenticationChecker)
    .post('/', express.json(), (0, async_handler_1.asyncMiddleware)(async (req) => {
    const { databasePath } = (0, server_context_1.getServerContext)(req);
    const result = await database_1.Database.exec(databasePath, async (db) => {
        const person = await createPerson(db, req.body);
        const debugMessage = `Person created in ${databasePath}`;
        const data = [person, debugMessage];
        return { data, statusCode: 201 };
    });
    return result;
}))
    .get('/', express.json(), (0, async_handler_1.asyncMiddleware)(async (req) => {
    const nameHint = (0, tools_1.getQueryParam)(req, 'search');
    const { databasePath } = (0, server_context_1.getServerContext)(req);
    const result = await database_1.Database.exec(databasePath, async (db) => {
        const persons = await getPersons(db, nameHint);
        return { data: persons, statusCode: 200 };
    });
    return result;
}))
    .get('/:name/fiche', (0, async_handler_1.asyncMiddleware)(async (req, res) => {
    const name = req.params.name;
    const { databasePath } = (0, server_context_1.getServerContext)(req);
    const result = await database_1.Database.exec(databasePath, async (db) => {
        const fiche = await getFiche(db, name);
        return { data: fiche, statusCode: 200 };
    });
    res.type('html');
    return result;
}))
    .use(json_error_middleware_1.errorMiddleware);
async function createPerson(db, data) {
    const person = {
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        photoUrl: data.photoUrl,
    };
    const statements = [
        `INSERT INTO PERSONNES(nom,prenom,age) VALUES ('${person.lastName}', '${person.firstName}', ${person.age})`, // TODO SECU
    ];
    if (data.photoUrl) {
        statements.push(`INSERT INTO PHOTOS (nom, url) VALUES ('${person.lastName}', '${person.photoUrl}')`); // TODO SECU
    }
    await db.runScript(statements);
    return person;
}
async function getPersons(db, nameHint, exactMatch = false) {
    let sql = 'SELECT nom, prenom, age FROM PERSONNES';
    if (nameHint) { // TODO SECU
        const where = exactMatch ? `nom='${nameHint}'` : `nom LIKE '%${nameHint}%'`;
        sql += ` WHERE ${where}`;
    }
    const data = await db.select(sql);
    const persons = data.map((v) => ({
        firstName: v.prenom,
        lastName: v.nom,
        age: v.age,
    }));
    // TODO SECU
    for (const person of persons) {
        const urls = await db.select(`SELECT url FROM PHOTOS WHERE nom='${person.lastName}'`);
        if (urls && urls.length) {
            person.photoUrl = urls[0].url;
        }
    }
    return persons;
}
async function getFiche(db, name) {
    const persons = await getPersons(db, name, true);
    const person = persons && persons.length ? persons[0] : null;
    let body;
    // TODO SECU
    if (person) {
        const img = person.photoUrl ?
            `<img src="${person.photoUrl}" />` : '';
        body = [
            `<h1>${person.firstName} ${person.lastName}</h1>`,
            `<p>Age: ${person.age.toFixed(0)}</p>`,
            img
        ].join('\n');
    }
    else {
        body = `<h1>${name} ne fait pas partie de notre annuaire</h1>`;
    }
    const html = [
        '<html>',
        '<body>',
        body,
        '</body>',
        '</html>'
    ].join('\n');
    return html;
}
//# sourceMappingURL=persons-controller.js.map
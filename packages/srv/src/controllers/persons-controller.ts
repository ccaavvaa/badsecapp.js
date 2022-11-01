import { Person } from '@bad-sec-app/shared';
import express = require('express');
import { asyncMiddleware } from '../tools/async-handler';
import { Database } from '../tools/database';
import { errorMiddleware } from '../tools/json-error-middleware';
import { getServerContext } from '../tools/server-context';
import { authenticationChecker, getQueryParam } from '../tools/tools';

export const personsRouter = express.Router()
    .use(authenticationChecker)
    .post('/', express.json(), asyncMiddleware<[Person, string]>(async (req: express.Request) => {
        const { databasePath } = getServerContext(req);
        const result = await Database.exec(databasePath, async (db) => {
            const person = await createPerson(db, req.body);
            const debugMessage = `Person created in ${databasePath}`;
            const data: [Person, string] = [person, debugMessage];
            return { data, statusCode: 201 };
        });
        return result;
    }))
    .get('/', express.json(), asyncMiddleware<Person[]>(async (req: express.Request) => {
        const nameHint = getQueryParam(req, 'search');
        const { databasePath } = getServerContext(req);
        const result = await Database.exec(databasePath, async (db) => {
            const persons = await getPersons(db, nameHint);
            return { data: persons, statusCode: 200 };
        });
        return result;
    }))
    .get('/:name/fiche', asyncMiddleware<string>(async (req: express.Request, res: express.Response) => {
        const name = req.params.name;
        const { databasePath } = getServerContext(req);
        const result = await Database.exec(databasePath, async (db) => {
            const fiche = await getFiche(db, name);
            return { data: fiche, statusCode: 200 };
        });
        res.type('html');
        return result;
    }))
    .use(errorMiddleware);

async function createPerson(db: Database, data: any) {
    const person: Person = {
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        photoUrl: data.photoUrl,
    }
    const statements: string[] = [
        `INSERT INTO PERSONNES(nom,prenom,age) VALUES ('${person.lastName}', '${person.firstName}', ${person.age})`, // TODO SECU
    ];
    if (data.photoUrl) {
        statements.push(`INSERT INTO PHOTOS (nom, url) VALUES ('${person.lastName}', '${person.photoUrl}')`); // TODO SECU
    }
    await db.runScript(statements);
    return person;
}

async function getPersons(db: Database, nameHint: string, exactMatch = false): Promise<Person[]> {
    let sql = 'SELECT nom, prenom, age FROM PERSONNES'
    if (nameHint) { // TODO SECU
        const where = exactMatch ? `nom='${nameHint}'` : `nom LIKE '%${nameHint}%'`
        sql += ` WHERE ${where}`;
    }
    const data = await db.select(sql);
    const persons: Person[] = data.map((v) => ({
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

async function getFiche(db: Database, name: string) {
    const persons = await getPersons(db, name, true);
    const person = persons && persons.length ? persons[0] : null;
    let body: string;
    // TODO SECU
    if (person) {
        const img = person.photoUrl ?
            `<img src="${person.photoUrl}" />` : '';
        body = [
            `<h1>${person.firstName} ${person.lastName}</h1>`,
            `<p>Age: ${person.age.toFixed(0)}</p>`,
            img
        ].join('\n');
    } else {
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

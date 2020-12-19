'use strict';

// mysql.js prevede solo callback
// Per poter gestire le query tramite promises (e quindi async/await) uso promise-mysql.js
const promise_mysql = require('promise-mysql'); 

/**
 * Classe che si occupa di tutti gli aspetti legati all'interazione col DB
 */
class DBManager {
    constructor() {
        const config = {
            host: "localhost",
            user: "root",
            password: "root",
            database: "CDCP_DB"
        }

        this.connect(config);
    }

    async connect(config) {
        try {
            this._con = await promise_mysql.createConnection(config);
        }
        
        catch(err) {
            throw err;
        }
    }

    async execQuery(sql, params = []) {
        try {
            const result = await this._con.query(sql, params);

            // ritorno direttamente il risultato in JSON
            return JSON.parse(JSON.stringify(result));
        }

        catch(err) {
            throw err;
        }
    }

    async close() {
        try {
            await this._con.end();
        }

        catch(err) {
            throw err;
        }
    }
}

module.exports = DBManager;
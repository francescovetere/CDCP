'use strict';

// non uso mysql standard, che prevede solo callback,
// ma promise-mysql, che ammette anche le promise (e quindi async/await)
const mysql = require('promise-mysql'); 

/**
 * Classe DBManager, utile per utilizzare query senza callback, ma con async/await
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
            this._con = await mysql.createConnection(config);
        }
        
        catch(err) {
            console.log(err);
        }
    }

    async simpleQuery(sql) {
        try {
            const result = await this._con.query(sql);
            // console.log(result); --> Posso farlo, grazie ad async/await

            // ritorno direttamente il risultato nel modo più conveniente per le API
            return JSON.parse(JSON.stringify(result)); 
        }

        catch(err) {
            console.log(err);
        }
    }

    // Per eseguire query preparate:
    // https://github.com/mysqljs/mysql#preparing-queries
    async preparedQuery(sql, params) {
        try {
            const result = await this._con.format(sql, params)
            // console.log(result); --> Posso farlo, grazie ad async/await

            // ritorno direttamente il risultato nel modo più conveniente per le API
            return JSON.parse(JSON.stringify(result));
        }

        catch(err) {
            console.log(err);
        }
    }

    async close() {
        try {
            await this._con.end();
        }

        catch(err) {
            console.log(err);
        }
    }
}

module.exports = DBManager;
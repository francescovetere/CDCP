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
            database: "testDB"
        }
        try {
            this._con = mysql.createConnection(config);
        }
        
        catch(err) {
            console.log(err);
        }
    }

    async query(sql) {
        try {
            const result = (await this._con).query(sql);
            return result;
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
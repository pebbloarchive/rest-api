const { Client } = require('pg')

interface Database {
    client: void;
}

class Database {
    constructor() {
        this.client = new Client({
            user: process.env.db_user,
            host: process.env.db_host,
            database: process.env.db_name,
            password: process.env.db_pass,
            port: 5432
        });
    }
    connect() {
        try {
            // @ts-ignore
            this.client.connect();
            return console.log('Connected to the database');
        } catch(err) {
            return console.log(`Unable to connect to the databse ${err}`);
        }
    }
}

export default Database;
module.exports = Database;
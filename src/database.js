const sequelize = require('sequelize');

module.exports = class Database {
    constructor() {
        this.databaseConnection = new sequelize({
            host: process.env.POSTGRE_HOST || '40.117.115.62',
            port: process.env.POSTGRE_PORT || '5432',
            username: process.env.POSTGRE_USER ,
            password: process.env.POSTGRE_PASS,
            database: process.env.POSTGRE_NAME || 'risuto_data',
            dialect: 'postgres',
            logging: false,
            define: {
                timestamps: false,
                freezeTableName: true
            }
        });
    }

    async connect() {
        try {
            await this.databaseConnection.authenticate();
            return console.log('Successfully connected to database.');
        } catch (error) {
            return console.error(`Unable to connect to database : ${error}`);
        }
    }


   async destroy() {
        await this.databaseConnection.close();
        return console.error('Closed connection to database.')
    }

    async sync() {
        await this.databaseConnection.authenticate().then(() => {
            return this.databaseConnection.sync({ force: true })
        });
        return console.log('Synced the database.')
    }
    
};
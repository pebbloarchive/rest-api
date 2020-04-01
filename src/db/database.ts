import { Sequelize } from 'sequelize';
import Logger from '../util/Logger';

interface Database {
    databaseConnection: Sequelize;
    logger: Logger;
}

class Database {
    constructor() {
        this.databaseConnection = new Sequelize(process.env.db_name as string, process.env.db_user as string, process.env.db_pass as string, {
            host: process.env.db_host as string,
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
            return console.log(`Unable to connect to database : ${error}`);
        }
    }

   async destroy() {
        await this.databaseConnection.close();
        return console.log('Closed connection to database.')
    }

    async sync() {
        await this.databaseConnection.authenticate().then(() => {
            return this.databaseConnection.sync({ alter: true })
        });
        return console.log('Synced the database.')
    }
    
};

export default Database;
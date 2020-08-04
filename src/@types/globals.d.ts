import Database from '../postgres';

declare global {
  var database: Database;
  namespace NodeJS {
    interface Global {
      database: Database;
    }
  }
}
type db = (name: string) => void;

declare module NodeJS {
    interface Global {
        database: db;
    }
}

declare const database: db;

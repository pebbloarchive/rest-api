const minio = require('minio');

interface Minio {
    minio: void;
    client: void;
}

class Minio {
    constructor() {
        this.minio = minio;
        this.client = new minio({
            endpoint: 'http://45.33.97.68',
            port: 9000,
            useSSL: false,
            accessKey: process.env.minio_access,
            secretKey: process.env.minio_secret
        });
    }
}

module.exports = Minio;
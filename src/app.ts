import server from './index';
const config = require('../config.json');

server.listen(config.server.port, () => console.log(`Running the server on port ${config.server.port}`));
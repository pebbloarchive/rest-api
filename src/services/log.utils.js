//
const colors = require('colors');
// const color = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];

module.exports = class Logger {
    static log(...msg) {
        // if(msg != color) return Error('Invalid color provided.');
        console.log(`${msg}`.green);
    } 
}
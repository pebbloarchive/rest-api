import { inspect } from 'util';
import leeks from 'leeks.js';

enum LogLevel {
  INFO,
  WARN,
  ERROR,
  CONNECTION
}

/** Object of the months from `Date#getMonth` */
const MONTHS = {
  // All of the months are 0-indexed
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sept',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec'
};

export default class Logger {
  public colors: typeof leeks.colors = leeks.colors;

  /**
   * Function to get the ordinal of any number (i.e: 1 -> 1st)
   * @param {number} int The number to get the ordinal
   * @credit [ThatTonybo/num-ord](https://github.com/ThatTonybo/num-ord)
   */
  getNumberOrdinal(int) {
    return int == 1 ? `${int}st` : int == 2 ? `${int}nd` : int == 3 ? `${int}rd` : int >= 4 ? `${int}th` : null;
  }

  /**
   * Returns the current date; humanized
   */
  getDate() {
    const now = new Date(); // Get the current date

    // We do this to prevent: '002'
    const hours = `0${now.getHours()}`.slice(-2);
    const minutes = `0${now.getMinutes()}`.slice(-2);
    const seconds = `0${now.getSeconds()}`.slice(-2);
    const month = MONTHS[now.getMonth()];
    const day = this.getNumberOrdinal(now.getDate()) === null ? '' : this.getNumberOrdinal(now.getDate());
    const year = now.getFullYear();
    const ap = now.getHours() >= 12 ? 'PM' : 'AM';

    return this.colors.gray(`[${month} ${day}, ${year} | ${hours}:${minutes}:${seconds}${ap}]`);
  }

  private write(level: LogLevel, ...message: (string | object)[]) {
    let lvlText!: string;

    switch (level) {
      case LogLevel.INFO: {
        lvlText = this.colors.cyan(`[INFO/${process.pid}]`);
      } break;

      case LogLevel.WARN: {
        lvlText = this.colors.yellow(`[WARN/${process.pid}]`);
      } break;

      case LogLevel.ERROR: {
        lvlText = this.colors.red(`[ERROR/${process.pid}]`);
      } break;

      case LogLevel.CONNECTION: {
        lvlText = this.colors.magenta(`[CONNECTION/${process.pid}]`);
      } break;
    }

    const msg = message.map(m => m instanceof Object ? inspect(m) : m).join('\n');
    process.stdout.write(`${this.getDate()} ${lvlText} => ${msg}\n`);
  }

  info(...message: (string | object)[]) {
    this.write(LogLevel.INFO, ...message);
  }

  warn(...message: (string | object)[]) {
    this.write(LogLevel.WARN, ...message);
  }

  error(...message: (string | object)[]) {
    this.write(LogLevel.ERROR, ...message);
  }

  connection(...message: (string | object)[]) {
    this.write(LogLevel.CONNECTION, ...message);
  }
}
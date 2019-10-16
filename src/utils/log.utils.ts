export const colors: {
    [key in LogColor]: string
} = {
    BLACK: '\x1b[30m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    RESET: '\x1b[0m'
}

type LogColor = 'BLACK' | 'RED' | 'GREEN' | 'YELLOW' | 'BLUE' | 'MAGENTA' | 'CYAN' | 'WHITE' | 'RESET';

export const logColors: LogColor[] = [ 'RED', 'GREEN', 'YELLOW', 'BLUE', 'MAGENTA', 'CYAN' ];

export interface LogPrefix {
    content: string;
    color?: LogColor;
}

export default (msg: string, prefixes: LogPrefix[] | string, color: LogColor = 'GREEN') => {
    let prefix = '';
    if(!prefixes) { prefixes = [] }
    if(prefixes) {
        if((prefixes[0] as LogPrefix).content) {
            prefix = (prefixes as LogPrefix[]).map(prefixItem => {
                return `[${prefixItem.color ? colors[prefixItem.color] : colors['GREEN']}${prefixItem.content.toUpperCase()}${colors['RESET']}]`}).join(' ');
        } else {
            prefix = `[${color ? colors[color] : colors['GREEN']}${(prefixes as string).toUpperCase()}${colors.RESET}]`;
        }
    }
    return console.log(`[RISUTO-API-${process.env.NODE_ENV.toUpperCase()}] ${prefix} ${msg}`);
}
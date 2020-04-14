import Event from 'rabbitmq-event-manager';
let manager = Event ? Event : null;

export function initEManager(): Event {
    manager = new manager({
        url: process.env.rabbit_url,
        application:  'PEBBLO'
    });
}

export default function getEManager(): Event {
    if(manager) return manager
    else return new Error('Unable to retrieve manager');
}
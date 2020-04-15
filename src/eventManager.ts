import EventManager from "rabbitmq-event-manager";
let manager: EventManager | null = null
export const initEventManager: Function = async () => {
  return new Promise(resolve => {
    manager = new EventManager({
      url: process.env.RABBITMQ_URI || 'amqp://localhost',
      application: 'core-api',
    })
    manager.initialize().then(() => {
      resolve(manager)
    })
  })
}

export function getEventManager(): EventManager {
  if (manager) {
    return manager;
  }
  throw new Error('EventManager has not been initialized')
}
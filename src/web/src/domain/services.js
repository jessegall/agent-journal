export const RUNNING = ["ready", "starting"];

export const isRunning = (service) => !!service && RUNNING.includes(service.state);

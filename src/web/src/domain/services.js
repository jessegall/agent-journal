export const RUNNING = ["ready", "starting"];

const WORDS = {ready: "running", starting: "starting", failed: "failing", blocked: "failing", exited: "stopped", stopped: "stopped"};

export const stateWord = (service) => WORDS[service.state] || service.state;

export const isRunning = (service) => !!service && RUNNING.includes(service.state);

const DOTS = {ready: "done", starting: "running", failed: "failed", blocked: "blocked"};

export const dotOf = (service) => DOTS[service.state] || "";

export const isFailing = (service) => ["failed", "blocked"].includes(service.state);

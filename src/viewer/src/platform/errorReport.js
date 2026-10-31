// Every error the page raises, from a script, a promise nobody caught or console.error, is sent once to the journal, so the agent hears of it without being told.
const WINDOW_MS = 10000;
const SENDS_PER_WINDOW = 5;

function describe(value) {
    if (value instanceof Error) return {message: value.message, stack: value.stack || ""};
    return {message: typeof value === "string" ? value : JSON.stringify(value) ?? String(value), stack: ""};
}

export function reportErrors(win, send, now = () => Date.now()) {
    const sent = new Set();
    let began = 0;
    let count = 0;
    let sending = false;

    function report({message, stack}) {
        const key = `${message}\n${stack}`;
        if (sending || sent.has(key)) return;
        if (now() - began >= WINDOW_MS) {
            began = now();
            count = 0;
            sent.clear();
        }
        if (count >= SENDS_PER_WINDOW) return;
        count += 1;
        sent.add(key);
        sending = true;
        try {
            Promise.resolve(send({message, stack})).catch(() => {});
        } finally {
            sending = false;
        }
    }

    win.addEventListener("error", (event) => report(event.error ? describe(event.error) : {message: event.message, stack: ""}));
    win.addEventListener("unhandledrejection", (event) => report(describe(event.reason)));
    const original = win.console.error.bind(win.console);
    win.console.error = (...args) => {
        original(...args);
        report({message: args.map((arg) => describe(arg).message).join(" "), stack: args.map((arg) => describe(arg).stack).find(Boolean) || new Error().stack || ""});
    };
}

const BEAT_MS = 2000;

// what a frame window imports from /viewer/kit/frame-bridge.js: the window context, reached through the shell's
// bridge, read and run answering {ok, value} or {ok, failure, error}, and follow sending each declared event it hears
export async function connect() {
    let next = 1;
    const waiting = new Map();
    const followers = new Map();
    const shell = window.parent;

    window.addEventListener("message", (message) => {
        if (message.source !== shell || !message.data) return;
        const {id, answer} = message.data;
        if (followers.has(id)) {
            if (answer.value) followers.get(id)(answer.value);
            return;
        }
        waiting.get(id)?.(answer);
        waiting.delete(id);
    });

    const ask = (request) =>
        new Promise((resolve) => {
            const id = next++;
            waiting.set(id, resolve);
            shell.postMessage({...request, id}, "*");
        });

    shell.postMessage({type: "beat"}, "*");
    setInterval(() => shell.postMessage({type: "beat"}, "*"), BEAT_MS);

    return {
        read: (line) => ask({type: "read", line}),
        run: (line) => ask({type: "run", line}),
        follow: (patterns, heard) => {
            const id = next++;
            followers.set(id, heard);
            shell.postMessage({type: "follow", patterns, id}, "*");
        },
    };
}

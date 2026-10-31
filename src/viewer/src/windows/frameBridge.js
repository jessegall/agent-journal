const SILENT_MS = 10000;

// the shell's side of a frame window's bridge: it answers only the frame it made, sends each line through the window
// context, so the server sees the window's own name, hands the follows to the host, and notes when the frame last spoke
export class FrameBridge {
    constructor(frame, context) {
        this.frame = frame;
        this.context = context;
        this.heardAt = null;
        this.received = this.received.bind(this);
    }

    start() {
        window.addEventListener("message", this.received);
    }

    stop() {
        window.removeEventListener("message", this.received);
    }

    silent(now = Date.now()) {
        return this.heardAt !== null && now - this.heardAt > SILENT_MS;
    }

    async received(message) {
        if (message.source !== this.frame.contentWindow) return;
        this.heardAt = Date.now();
        const request = message.data;
        if (!request || typeof request.id !== "number") return;
        if (request.type === "read") this.send(request.id, await this.context.read(request.line));
        if (request.type === "run") this.send(request.id, await this.context.run(request.line));
        if (request.type === "option") this.send(request.id, {ok: true, value: this.context.option(request.key).value ?? null});
        if (request.type === "follow") {
            this.context.follow(request.patterns, (event) => this.send(request.id, {ok: true, value: event}));
            this.send(request.id, {ok: true, value: null});
        }
    }

    send(id, answer) {
        this.frame.contentWindow?.postMessage({id, answer}, "*");
    }
}

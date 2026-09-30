const HEADERS = {"Content-Type": "application/json", "X-Phone": "1"};

export class PhoneError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

async function answered(got) {
    const body = await got.json().catch(() => ({}));
    if (!got.ok) throw new PhoneError(got.status, body.error || "Your computer did not answer");
    return body;
}

async function sent(path, body) {
    return answered(await fetch(path, {method: "POST", headers: HEADERS, body: JSON.stringify(body), cache: "no-store"}));
}

const got = async (path) => answered(await fetch(path, {cache: "no-store"}));

export const phone = {
    pair: (code, device) => sent("./pair", {code, device}),
    state: () => got("./state"),
    feed: () => got("./feed"),
    bar: () => got("./bar"),
    places: () => got("./places"),
    source: (q) => got(`./source?q=${encodeURIComponent(q)}`),
    attached: async (path) => (await fetch(`./file/${path}`, {cache: "no-store"})).text(),
    list: (type) => got(`./list?type=${encodeURIComponent(type)}`),
    arrange: (cards) => sent("./arrange", {cards}),
    pushKey: () => got("./push-key"),
    subscribe: (endpoint) => sent("./push", {endpoint}),
    move: (journal, environment) => sent("./switch", {journal, environment}),
    start: (journal, environment, agent) => sent("./start", {journal, environment, agent}),
    row: (ref) => got(`./row/${ref.replace(":", "/")}`),
    say: (brief, idempotency, about = "") => sent("./message", {brief, idempotency, about}),
    attach: async (n, file) =>
        answered(
            await fetch(`./attach/${n}/${encodeURIComponent(file.name)}`, {
                method: "POST",
                headers: {"Content-Type": "application/octet-stream", "X-Phone": "1"},
                body: file,
            })
        ),
    answer: (n, answer) => sent("./answer", {n, answer}),
    dismiss: (n) => sent("./dismiss", {n}),
    react: (n, face) => sent("./react", {n, face}),
    approve: (n, updated) => sent("./approve", {n, updated}),
    press: (ref, label) => sent("./press", {ref, label}),
};

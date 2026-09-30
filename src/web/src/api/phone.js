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

async function got(path) {
    const answer = await fetch(path, {cache: "no-cache"});
    return answered(answer.status === 304 ? await fetch(path, {cache: "no-store"}) : answer);
}

export const phone = {
    pair: (code, device) => sent("./pair", {code, device}),
    state: () => got("./state"),
    feed: () => got("./feed"),
    older: (before) => got(`./feed?before=${encodeURIComponent(before)}`),
    bar: () => got("./bar"),
    places: () => got("./places"),
    source: (q) => got(`./source?q=${encodeURIComponent(q)}`),
    attached: async (path) => {
        const answer = await fetch(`./file/${path}`, {cache: "no-cache"});
        if (!answer.ok) throw new PhoneError(answer.status, (await answer.text().catch(() => "")) || "The file could not be loaded");
        return answer.text();
    },
    picture: async (path, name) => {
        const answer = await fetch(`./file/${path}`, {cache: "no-cache"});
        if (!answer.ok) throw new PhoneError(answer.status, "The picture could not be loaded");
        const blob = await answer.blob();
        return new File([blob], name, {type: blob.type});
    },
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
    react: (n, face, type = "message") => sent("./react", {n, face, type}),
    approve: (n, updated) => sent("./approve", {n, updated}),
    press: (ref, label) => sent("./press", {ref, label}),
    comment: (ref, text) => sent("./comment", {ref, text}),
    close: (n) => sent("./close", {n}),
    share: (ref) => sent("./share", {ref}),
    exportUrl: (ref) => `./export/${ref.replace(":", "/")}`,
    exported: async (ref, fallback) => {
        const answer = await fetch(`./export/${ref.replace(":", "/")}`, {cache: "no-cache"});
        if (!answer.ok) throw new PhoneError(answer.status, "The document could not be made");
        const told = answer.headers.get("Content-Disposition") || "";
        const coded = told.match(/filename\*=UTF-8''([^;]+)/i);
        const plain = told.match(/filename="?([^";]+)"?/i);
        const name = coded ? decodeURIComponent(coded[1]) : plain ? plain[1] : fallback;
        const blob = await answer.blob();
        return new File([blob], name, {type: blob.type || "application/octet-stream"});
    },
};

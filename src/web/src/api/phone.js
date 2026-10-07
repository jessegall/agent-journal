import {answered as checked} from "./transport.js";

const HEADERS = {"Content-Type": "application/json", "X-Phone": "1"};

export class PhoneError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const answered = (got) => checked(got, "Your computer did not answer", (status, message) => new PhoneError(status, message));

async function fetchedFile(path, failText) {
    const answer = await fetch(path, {cache: "no-cache"});
    if (!answer.ok) throw new PhoneError(answer.status, (await answer.text().catch(() => "")) || failText);
    return answer;
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
    passkeyBegin: () => sent("./passkey/begin", {}),
    passkey: (made) => sent("./passkey", made),
    unlockBegin: (request) => sent("./unlock/begin", {request}),
    unlock: (answer) => sent("./unlock", answer),
    feed: () => got("./feed"),
    older: (before) => got(`./feed?before=${encodeURIComponent(before)}`),
    bar: () => got("./bar"),
    places: () => got("./places"),
    source: (q) => got(`./source?q=${encodeURIComponent(q)}`),
    fileAt: (path) => `./file/${path}`,
    fileUrl: (type, n, name) => phone.fileAt(`${type}/${n}/${encodeURIComponent(name)}`),
    attached: async (path) => (await fetchedFile(phone.fileAt(path), "The file could not be loaded")).text(),
    picture: async (path, name) => {
        const answer = await fetchedFile(phone.fileAt(path), "The picture could not be loaded");
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
    suggestion: (n, act, how = "") => sent("./suggestion", {n, act, how}),
    react: (n, face, type = "message") => sent("./react", {n, face, type}),
    approve: (n, updated) => sent("./approve", {n, updated}),
    proceed: (n, updated) => sent("./continue", {n, updated}),
    press: (ref, label) => sent("./press", {ref, label}),
    comment: (ref, text) => sent("./comment", {ref, text}),
    close: (n) => sent("./close", {n}),
    share: (ref) => sent("./share", {ref}),
    pause: () => sent("./pause", {}),
    resume: () => sent("./resume", {}),
    stop: () => sent("./stop", {}),
    auto: (on) => sent("./auto", {on}),
    mode: (mode) => sent("./mode", {mode}),
    helper: (n) => got(`./helper?n=${n}`),
    permit: (helper, allow) => sent("./permit", {helper, allow}),
    helperStop: (n) => sent("./helper/stop", {n}),
    exportUrl: (ref) => `./export/${ref.replace(":", "/")}`,
    exported: async (ref, fallback) => {
        const answer = await fetchedFile(phone.exportUrl(ref), "The document could not be made");
        const disposition = answer.headers.get("Content-Disposition") || "";
        const coded = disposition.match(/filename\*=UTF-8''([^;]+)/i);
        const plain = disposition.match(/filename="?([^";]+)"?/i);
        const name = coded ? decodeURIComponent(coded[1]) : plain ? plain[1] : fallback;
        const blob = await answer.blob();
        return new File([blob], name, {type: blob.type || "application/octet-stream"});
    },
};

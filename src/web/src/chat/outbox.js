import {remember, remembered} from "../platform/storage.js";
import {api} from "../api/client.js";
import {pollNow, startPoll} from "../composables/poll.js";

const KEY = "journal.outbox.v4";
const DELIVERY = "journal.outbox.delivery";
const RETRY_MS = 5000;
const OUTBOX = "outbox";
const chains = {};
let active = null;
let polling = false;
let changed = () => {};

function serial(lock, work) {
    const run = globalThis.navigator?.locks ? () => navigator.locks.request(lock, work) : work;
    const task = (chains[lock] || Promise.resolve()).then(run, run);
    chains[lock] = task.catch(() => {});
    return task;
}

const readQueue = async () => remembered(KEY, []);

async function writeQueue(queue) {
    if (!remember(KEY, queue)) throw new Error("Could not save the message for retry");
}

export function token() {
    if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function encode(bytes) {
    let binary = "";
    for (let at = 0; at < bytes.length; at += 0x8000) binary += String.fromCharCode(...bytes.subarray(at, at + 0x8000));
    return btoa(binary);
}

async function fileRecord(file) {
    return {name: file.name, type: file.type, lastModified: file.lastModified, data: encode(new Uint8Array(await file.arrayBuffer()))};
}

function fileFrom(record) {
    const binary = atob(record.data);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new File([bytes], record.name, {type: record.type, lastModified: record.lastModified});
}

function enqueue(record) {
    return serial(KEY, async () => {
        const queue = await readQueue();
        queue.push(record);
        await writeQueue(queue);
    });
}

function stored(record) {
    return serial(KEY, async () => {
        const queue = await readQueue();
        await writeQueue(queue.map((kept) => (kept.id === record.id ? record : kept)));
    });
}

function removed(id) {
    return serial(KEY, async () => writeQueue((await readQueue()).filter((kept) => kept.id !== id)));
}

async function deliver(record) {
    const server = api.at(record.origin, record.env);
    const message = await server.create("messages", {text: record.text, reply_to: record.reply_to, idempotency: record.id});
    record.message = message.id;
    record.uploaded = Array.isArray(record.uploaded) ? record.uploaded : [];
    await stored(record);
    for (let n = 0; n < record.files.length; n += 1) {
        if (record.uploaded[n]) continue;
        await server.upload("messages", record.message, fileFrom(record.files[n]));
        record.uploaded[n] = true;
        await stored(record);
    }
}

function flush(env, origin) {
    return serial(DELIVERY, async () => {
        const queue = await serial(KEY, readQueue);
        const delivered = [];
        for (const record of queue) {
            if (record.env !== env || record.origin !== origin) continue;
            try {
                await deliver(record);
                await removed(record.id);
                delivered.push(record.id);
            } catch (e) {}
        }
        return delivered;
    });
}

function report(ids) {
    if (ids.length) changed(ids);
}

const retry = async () => active && report(await flush(active.env, active.origin));

export function onOutboxChange(fn) {
    changed = fn;
}

export function startOutbox(env) {
    active = {env, origin: location.origin};
    if (polling) {
        pollNow(OUTBOX);
        return;
    }
    polling = true;
    window.addEventListener("online", () => pollNow(OUTBOX));
    startPoll(OUTBOX, retry, RETRY_MS);
}

export async function sendMessage(env, body, files = [], id = token()) {
    const record = {
        id,
        origin: location.origin,
        env,
        text: body.text,
        reply_to: body.reply_to,
        files: await Promise.all(files.map(fileRecord)),
        uploaded: [],
    };
    await enqueue(record);
    const delivered = flush(record.env, record.origin).then((ids) => {
        report(ids);
        return ids.includes(record.id);
    });
    return {id: record.id, delivered};
}

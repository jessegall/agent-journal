import {remember, remembered} from "../platform/storage.js";
import {api} from "../api/client.js";
import {pollNow, startPoll} from "../composables/poll.js";

const KEY = "journal.outbox.v4";
const DELIVERY = "journal.outbox.delivery";
const chains = {};
// the files of a message too big for the browser's storage, kept in this page's memory until the message is sent
const held = new Map();
export const STORE_BYTES = 2 * 1024 * 1024;
let active = null;
let polling = false;
const listeners = [];

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

// a refusal is answered the same however often it is asked, so it is given up; only a send that never arrived is tried again
const isRefused = (e) => e.status >= 400 && e.status < 500;

function keepTrying(e) {
    if (!isRefused(e)) throw e;
}

// a message asked of the environment's host on another machine has no number until the host has made it and it has come back
const notYet = (e) => {
    throw e.status === 404 ? new Error("the environment's host has not made the message yet") : e;
};

async function messageNumber(server, record) {
    if (!record.asked) {
        const message = await server.create("messages", {text: record.text, reply_target: record.reply_target, on: record.on, refers: record.refers, idempotency: record.id});
        if (message.id) return message.id;
        if (message.notice) noticed(message.notice);
        record.asked = true;
        await stored(record);
    }
    return record.files.length || record.held ? (await server.sentMessage(record.id).catch(notYet)).id : 0;
}

async function deliver(record) {
    const server = api.at(record.origin, record.env);
    record.message = record.message || (await messageNumber(server, record));
    record.uploaded = Array.isArray(record.uploaded) ? record.uploaded : [];
    await stored(record);
    const sources = record.files.length ? record.files.map(fileFrom) : held.get(record.id) || [];
    for (let n = 0; n < sources.length; n += 1) {
        if (record.uploaded[n]) continue;
        await server.upload("messages", record.message, sources[n]).catch(keepTrying);
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
                held.delete(record.id);
                delivered.push(record.id);
            } catch (e) {
                if (isRefused(e)) {
                    await removed(record.id);
                    held.delete(record.id);
                }
            }
        }
        return delivered;
    });
}

let noticed = () => {};

function report(ids) {
    if (ids.length) listeners.forEach((listen) => listen(ids));
}

const retry = async () => active && report(await flush(active.env, active.origin));

// the server a message goes to: this page's origin with the client's own base, /p on the phone
const here = () => `${location.origin}${api.base}`;

export function onOutboxChange(fn) {
    listeners.push(fn);
}

export const isQueued = async (id) => (await serial(KEY, readQueue)).some((kept) => kept.id === id);

// a message asked of a session whose holder is offline is answered with what happens to it, which the thread shows its writer
export function onOutboxNotice(fn) {
    noticed = fn;
}

export function startOutbox(env) {
    active = {env, origin: here()};
    if (polling) {
        pollNow("outbox.retry");
        return;
    }
    polling = true;
    window.addEventListener("online", () => pollNow("outbox.retry"));
    startPoll("outbox.retry", {params: () => ({retry})});
}

export async function sendMessage(env, body, files = [], id = token()) {
    const storable = files.reduce((sum, file) => sum + file.size, 0) <= STORE_BYTES;
    if (!storable) held.set(id, files);
    const record = {
        id,
        origin: here(),
        env,
        text: body.text,
        reply_target: body.reply_target,
        on: body.on,
        refers: body.refers,
        files: storable ? await Promise.all(files.map(fileRecord)) : [],
        held: storable ? 0 : files.length,
        uploaded: [],
    };
    await enqueue(record);
    const delivered = flush(record.env, record.origin).then((ids) => {
        report(ids);
        return ids.includes(record.id);
    });
    return {id: record.id, delivered};
}

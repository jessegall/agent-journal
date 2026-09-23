import {remember, remembered} from "../composables/remembered.js";
import {api} from "../api/client.js";
import {tellExtension} from "../platform/extension.js";

const KEY = "journal.outbox.v1";
const BRIDGE_WAIT = 500;
const RETRY_MS = 5000;
const bridge = new Map();
let request = 0;
let queueTask = Promise.resolve();
let storageMode = "";
let active = null;
let retrying = 0;
let retryTimer = 0;
let onlineBound = false;
let changed = () => {};

window.addEventListener("message", (event) => {
    if (
        event.source !== window ||
        event.origin !== window.location.origin ||
        !event.data ||
        event.data.source !== "journal-extension" ||
        event.data.kind !== "outbox"
    )
        return;
    const resolve = bridge.get(event.data.request);
    if (!resolve) return;
    bridge.delete(event.data.request);
    resolve(event.data.value);
});

function shared(work) {
    return globalThis.navigator?.locks ? () => navigator.locks.request(KEY, work) : work;
}

function serial(work) {
    const task = queueTask.then(shared(work), shared(work));
    queueTask = task.catch(() => {});
    return task;
}

function bridgeCall(kind, value) {
    const id = `outbox-${++request}`;
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            bridge.delete(id);
            resolve(undefined);
        }, BRIDGE_WAIT);
        bridge.set(id, (result) => {
            clearTimeout(timeout);
            resolve(result);
        });
        tellExtension(kind, {request: id, value});
    });
}

function directStorage() {
    return globalThis.chrome?.storage?.local || globalThis.browser?.storage?.local || null;
}

async function remoteRead() {
    const storage = directStorage();
    if (storage) {
        try {
            const got = await storage.get(KEY);
            return Array.isArray(got[KEY]) ? got[KEY] : [];
        } catch (e) {}
    }
    const got = await bridgeCall("outbox-get");
    return got === undefined ? undefined : Array.isArray(got) ? got : [];
}

async function remoteWrite(queue) {
    const storage = directStorage();
    if (storage) {
        try {
            await storage.set({[KEY]: queue});
            return true;
        } catch (e) {}
    }
    const got = await bridgeCall("outbox-set", queue);
    return got === true;
}

function localRead() {
    return remembered(KEY, []);
}

function localWrite(queue) {
    return remember(KEY, queue);
}

async function readQueue() {
    const remote = await remoteRead();
    if (remote !== undefined) {
        storageMode = "extension";
        const local = localRead();
        const known = new Set(remote.map((record) => record.id));
        const merged = [...remote, ...local.filter((record) => !known.has(record.id))];
        if (merged.length !== remote.length) await remoteWrite(merged);
        return merged;
    }
    storageMode = "local";
    return localRead();
}

async function writeQueue(queue) {
    const local = localWrite(queue);
    const remote = storageMode === "extension" ? await remoteWrite(queue) : false;
    if (!local && !remote) throw new Error("Could not save the message for retry");
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

async function enqueue(record) {
    return serial(async () => {
        const queue = await readQueue();
        queue.push(record);
        await writeQueue(queue);
    });
}

async function deliver(record, queue) {
    const server = api.at(record.origin, record.env);
    const message = await server.create("message", {
        title: record.title,
        brief: record.brief,
        about: record.about,
        idempotency: record.id,
        ...(record.newWork ? {new_work: true} : {}),
    });
    record.message = message.n;
    record.uploaded = Array.isArray(record.uploaded) ? record.uploaded : [];
    await writeQueue(queue);
    for (let n = 0; n < record.files.length; n += 1) {
        if (record.uploaded[n]) continue;
        await server.upload("message", record.message, fileFrom(record.files[n]));
        record.uploaded[n] = true;
        await writeQueue(queue);
    }
}

async function flush(env, origin) {
    return serial(async () => {
        const queue = await readQueue();
        const delivered = [];
        for (const record of [...queue]) {
            if (record.env !== env || record.origin !== origin) continue;
            try {
                await deliver(record, queue);
                queue.splice(queue.indexOf(record), 1);
                await writeQueue(queue);
                delivered.push(record.id);
            } catch (e) {}
        }
        return delivered;
    });
}

function report(ids) {
    if (ids.length) changed(ids);
}

async function retry() {
    if (!active || retrying) return;
    retrying = 1;
    try {
        report(await flush(active.env, active.origin));
    } catch (e) {
    } finally {
        retrying = 0;
    }
}

export function onOutboxChange(fn) {
    changed = fn;
}

export function startOutbox(env) {
    active = {env, origin: location.origin};
    if (!onlineBound) {
        window.addEventListener("online", retry);
        onlineBound = true;
    }
    if (!retrying) retry();
    if (!retryTimer) retryTimer = setInterval(retry, RETRY_MS);
}

export async function sendMessage(env, body, files = [], id = token()) {
    const record = {
        id,
        origin: location.origin,
        env,
        title: body.title,
        brief: body.brief,
        about: body.about,
        newWork: body.newWork,
        files: await Promise.all(files.map(fileRecord)),
        uploaded: [],
    };
    await enqueue(record);
    const delivered = await flush(record.env, record.origin);
    report(delivered);
    return {id: record.id, queued: !delivered.includes(record.id)};
}

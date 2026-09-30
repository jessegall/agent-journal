import {ref} from "vue";
import {phone, PhoneError} from "../api/phone.js";

const KEY = "phone-outbox";
const ENDED = [401, 410];

function kept() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
}

function keep(list) {
    try {
        localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
}

export const waitingToSend = ref(kept());
export const justSent = ref([]);
const carried = new Map();

export const ended = (error) => error instanceof PhoneError && ENDED.includes(error.status);

export function hold(brief, about, files = []) {
    const line = {brief, about, idempotency: crypto.randomUUID(), at: Date.now(), files: files.map((file) => file.name)};
    carried.set(line.idempotency, files);
    waitingToSend.value = [...waitingToSend.value, line];
    keep(waitingToSend.value);
}

export async function flush() {
    for (const line of [...waitingToSend.value]) {
        const made = await phone.say(line.brief, line.idempotency, line.about);
        for (const file of carried.get(line.idempotency) || []) await phone.attach(made.n, file);
        carried.delete(line.idempotency);
        waitingToSend.value = waitingToSend.value.filter((held) => held.idempotency !== line.idempotency);
        justSent.value = [...justSent.value, line];
        keep(waitingToSend.value);
    }
}

export function forget() {
    waitingToSend.value = [];
    keep([]);
}

export function settle(items) {
    const shown = new Set(items.map((item) => item.data && item.data.idempotency).filter(Boolean));
    justSent.value = justSent.value.filter((line) => !shown.has(line.idempotency));
}

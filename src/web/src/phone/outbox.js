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

export const ended = (error) => error instanceof PhoneError && ENDED.includes(error.status);

export function hold(brief, about) {
    waitingToSend.value = [...waitingToSend.value, {brief, about, idempotency: crypto.randomUUID(), at: Date.now()}];
    keep(waitingToSend.value);
}

export async function flush() {
    for (const line of [...waitingToSend.value]) {
        await phone.say(line.brief, line.idempotency, line.about);
        waitingToSend.value = waitingToSend.value.filter((held) => held.idempotency !== line.idempotency);
        keep(waitingToSend.value);
    }
}

export function forget() {
    waitingToSend.value = [];
    keep([]);
}

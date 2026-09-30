import {ref} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import {emptied, stash, unstash, unstashed} from "./stash.js";

const KEY = "phone-outbox";
const ACTIONS = "phone-actions";
const ENDED = [401, 410];
const RUN = {
    answer: (action) => phone.answer(action.n, action.answer),
    dismiss: (action) => phone.dismiss(action.n),
    approve: (action) => phone.approve(action.n, action.updated),
};

function kept(key = KEY) {
    try {
        return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
        return [];
    }
}

function keep(list, key = KEY) {
    try {
        localStorage.setItem(key, JSON.stringify(list));
    } catch {}
}

export const place = ref("");
const belongs = (item) => (item.place ? item.place === place.value : Boolean(place.value));
export const atThisPlace = (list) => list.filter(belongs);

export function setPlace(where) {
    place.value = where;
}

export const waitingToSend = ref(kept());
export const waitingActions = ref(kept(ACTIONS));
const unreachable = (error) => !(error instanceof PhoneError) || error.status >= 500;

function done(action) {
    waitingActions.value = waitingActions.value.filter((held) => held.id !== action.id);
    keep(waitingActions.value, ACTIONS);
}

async function sendActions(asked = "") {
    for (const action of [...waitingActions.value]) {
        if (!belongs(action)) continue;
        try {
            await RUN[action.kind](action);
            done(action);
        } catch (error) {
            if (unreachable(error)) return false;
            done(action);
            if (action.id === asked) throw error;
        }
    }
    return true;
}

export async function perform(action) {
    const held = {...action, id: crypto.randomUUID(), place: place.value};
    waitingActions.value = [...waitingActions.value, held];
    keep(waitingActions.value, ACTIONS);
    return (await sendActions(held.id)) ? "sent" : "held";
}
export const justSent = ref([]);
const carried = new Map();

export const ended = (error) => error instanceof PhoneError && ENDED.includes(error.status);

export function hold(brief, about, files = []) {
    const line = {brief, about, idempotency: crypto.randomUUID(), at: Date.now(), files: files.map((file) => file.name), place: place.value};
    carried.set(line.idempotency, files);
    if (files.length) stash(line.idempotency, files);
    waitingToSend.value = [...waitingToSend.value, line];
    keep(waitingToSend.value);
}

export async function flush() {
    await sendActions();
    for (const line of [...waitingToSend.value]) {
        if (!belongs(line) || line.lost) continue;
        const files = carried.get(line.idempotency) || (line.files.length ? await unstash(line.idempotency) : []);
        if (line.files.length && !files?.length) {
            lose(line);
            continue;
        }
        const made = await phone.say(line.brief, line.idempotency, line.about);
        for (const file of files) await phone.attach(made.n, file);
        carried.delete(line.idempotency);
        unstashed(line.idempotency);
        waitingToSend.value = waitingToSend.value.filter((held) => held.idempotency !== line.idempotency);
        justSent.value = [...justSent.value, line];
        keep(waitingToSend.value);
    }
}

function lose(line) {
    waitingToSend.value = waitingToSend.value.map((held) => (held.idempotency === line.idempotency ? {...held, lost: true} : held));
    keep(waitingToSend.value);
}

export function discard(idempotency) {
    carried.delete(idempotency);
    unstashed(idempotency);
    waitingToSend.value = waitingToSend.value.filter((held) => held.idempotency !== idempotency);
    keep(waitingToSend.value);
}

export function forget() {
    carried.clear();
    emptied();
    waitingToSend.value = [];
    keep([]);
}

export function settle(items) {
    const shown = new Set(items.map((item) => item.data && item.data.idempotency).filter(Boolean));
    justSent.value = justSent.value.filter((line) => !shown.has(line.idempotency));
}

import {ref} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import {stash, unstash, unstashed} from "./stash.js";

const KEY = "phone-outbox";
const ACTIONS = "phone-actions";
const ENDED = [401, 410];
const RUN = {
    answer: (action) => phone.answer(action.n, action.answer),
    dismiss: (action) => phone.dismiss(action.n),
    approve: (action) => phone.approve(action.n, action.updated),
    proceed: (action) => phone.proceed(action.n, action.updated),
    react: (action) => phone.react(action.n, action.face, action.type || "message"),
    comment: (action) => phone.comment(action.ref, action.text),
    close: (action) => phone.close(action.n),
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

const inFlight = new Set();

async function sendActions(asked = "") {
    for (const action of [...waitingActions.value]) {
        if (!belongs(action) || inFlight.has(action.id)) continue;
        inFlight.add(action.id);
        try {
            await RUN[action.kind](action);
            done(action);
        } catch (error) {
            if (unreachable(error)) return false;
            if (ended(error)) {
                if (action.id === asked) throw error;
                return false;
            }
            done(action);
            if (action.id === asked) throw error;
        } finally {
            inFlight.delete(action.id);
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
    const line = {
        brief,
        about,
        idempotency: crypto.randomUUID(),
        at: Date.now(),
        files: files.map((file) => file.name),
        place: place.value,
    };
    carried.set(line.idempotency, files);
    if (files.length) stash(line.idempotency, files);
    waitingToSend.value = [...waitingToSend.value, line];
    keep(waitingToSend.value);
    return line;
}

async function flushOnce() {
    if (!(await sendActions())) return;
    for (const line of [...waitingToSend.value]) {
        if (!belongs(line) || line.lost) continue;
        const files = carried.get(line.idempotency) || (line.files.length ? await unstash(line.idempotency) : []);
        if (line.files.length && !files?.length) {
            lose(line, "The attached file was lost, so this was not sent. Attach it again in a new message.");
            continue;
        }
        let made;
        try {
            made = await phone.say(line.brief, line.idempotency, line.about);
        } catch (error) {
            if (ended(error) || unreachable(error)) throw error;
            lose(line, `This was not sent: ${error.message}. Write it again in a new message.`);
            continue;
        }
        const missing = [];
        for (const [index, file] of files.entries()) {
            if (line.attached?.includes(index)) continue;
            try {
                await phone.attach(made.n, file);
                line.attached = [...(line.attached || []), index];
                keep(waitingToSend.value);
            } catch (error) {
                if (ended(error) || unreachable(error)) throw error;
                missing.push(file.name);
            }
        }
        if (missing.length) line.reason = `Message sent, but ${missing.join(", ")} could not be attached. Attach again in a new message.`;
        carried.delete(line.idempotency);
        unstashed(line.idempotency);
        waitingToSend.value = waitingToSend.value.filter((held) => held.idempotency !== line.idempotency);
        justSent.value = [...justSent.value, line];
        keep(waitingToSend.value);
    }
}

let flushing = null;
let again = false;

async function flushAll() {
    do {
        again = false;
        await flushOnce();
    } while (again);
}

export function flush() {
    if (flushing) {
        again = true;
        return flushing;
    }
    flushing = flushAll().finally(() => (flushing = null));
    return flushing;
}

function lose(line, reason) {
    carried.delete(line.idempotency);
    unstashed(line.idempotency);
    waitingToSend.value = waitingToSend.value.map((held) => (held.idempotency === line.idempotency ? {...held, lost: true, reason} : held));
    keep(waitingToSend.value);
}

export function discard(idempotency) {
    carried.delete(idempotency);
    unstashed(idempotency);
    waitingToSend.value = waitingToSend.value.filter((held) => held.idempotency !== idempotency);
    keep(waitingToSend.value);
}

export function settle(items) {
    const shown = new Set(items.map((item) => item.data && item.data.idempotency).filter(Boolean));
    justSent.value = justSent.value.filter((line) => !shown.has(line.idempotency));
}

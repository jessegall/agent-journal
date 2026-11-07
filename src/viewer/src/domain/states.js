import {transport} from "../api/transport.js";
import {wordLabel} from "./labels.js";

// the states the installed modules add, by type of row and word, read once when the windows start
let added = {};

export async function loadStates(read = (url) => transport.raw(url)) {
    const answer = await read("/api/states").catch(() => null);
    if (answer?.ok) added = (await answer.json()).states;
}

const addedState = (type, state) => added[type]?.[state];

// the words and look of a row's state: an added state's own label and the state it looks like, else the state itself
export const stateLabel = (type, state) => addedState(type, state)?.label ?? wordLabel(state);
export const stateLook = (type, state) => addedState(type, state)?.looks_like ?? state;
export const stateTipRead = (type, state) => addedState(type, state)?.tip_read ?? "";
export const stateOpenMoves = (type, state) => addedState(type, state)?.open_moves ?? null;

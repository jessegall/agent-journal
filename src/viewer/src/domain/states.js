import {wordLabel} from "./labels.js";

// the states the installed modules add, by kind of row and word, read once when the windows start
let added = {};

export async function loadStates(read = fetch) {
    const answer = await read("/api/states").catch(() => null);
    if (answer?.ok) added = (await answer.json()).states;
}

const addedState = (kind, state) => added[kind]?.[state];

// the words and look of a row's state: an added state's own label and the state it looks like, else the state itself
export const stateLabel = (kind, state) => addedState(kind, state)?.label ?? wordLabel(state);
export const stateLook = (kind, state) => addedState(kind, state)?.looks_like ?? state;
export const stateOpenMoves = (kind, state) => addedState(kind, state)?.open_moves ?? null;

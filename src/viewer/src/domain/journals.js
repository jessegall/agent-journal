import {SILENT, SILENT_WORD} from "./agentState.js";

export const STATE_WORDS = {
    working: "Working",
    busy: "Busy",
    waiting: "Waiting",
    compacting: "Compacting",
    idle: "Idle",
    [SILENT]: SILENT_WORD,
    stopped: "No agent",
};

export const sentence = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1) + ".";

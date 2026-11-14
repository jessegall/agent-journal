import {ago} from "../src/format/time.js";

const ACTIVITIES = {working: {state: "working", words: "Working"}, paused: {state: "paused", words: "Paused"}, "at usage limit": {state: "limited", words: "At usage limit"}, ended: {state: "idle", words: "Idle"}};
const RETIRED = {state: "retired", words: "Retired"};

// the dot and the word of what an agent is doing: retired beats whatever it did last
export const agentLook = (tip) => (tip.retired ? RETIRED : ACTIVITIES[tip.activity]);

// the program line: the program, its model and effort, and the agent's role with its number, whichever are known
export const agentIdentity = (tip) => [tip.program, tip.model, tip.effort, tip.role_label].filter(Boolean).join(", ");

// when an agent's state began, and when it was last heard from, as the agent card's dot says them
export const sinceWords = (at, now) => (at ? `Since: ${new Date(at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}, ${ago(at, now)}` : "");
export const seenWords = (at, now) => (at ? `Seen: ${ago(at, now)}` : "");

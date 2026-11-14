import {go, peekRef} from "../route.js";

// the marks of something that stopped short, whose detail says why
export const STOPPED_VARIANTS = new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]);
import {actionLabel, refAction} from "./markAction.js";

const AGENT_MODEL = "agents";
const OUTCOME_TONES = {passed: "good", failed: "danger", warned: "warn", running: ""};
// a mark whose variant is a tone, as a plugin's cards are, is drawn in it
const VARIANT_TONES = {good: "good", warn: "warn", danger: "danger"};

// what a click does besides unfolding a second line, which ChatMark does itself: open the row or the page the mark names
const OPENERS = {
    "open row": (mark) => peekRef(`${mark.target_model}:${mark.target_id}`),
    "open page": (mark) => go(mark.target_model, mark.target_id || 0),
};
const ACTIONS = {"open row": (mark) => refAction(mark.target_model), "open page": () => actionLabel("pages")};

// the mark object ChatMark draws, from a chat mark row and its type's declaration: the fields Turn.vue built in version 4
export function markLook(mark, declaration) {
    const type = declaration || {};
    const opens = OPENERS[type.click] && mark.target_model ? type.click : "";
    return {
        key: `chat_mark:${mark.id}`,
        icon: type.family_icon || (declaration ? "" : "dot"),
        markIcon: type.mark_icon || "",
        group: type.group || "",
        tone: type.colouring === "outcome" ? OUTCOME_TONES[mark.outcome] || "" : VARIANT_TONES[mark.variant] || "",
        label: mark.text,
        // a mark about an agent shows the agent's tooltip on its icon
        agentId: mark.target_model === AGENT_MODEL ? mark.target_id : 0,
        // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
        detail: type.body_url || mark.lines ? "" : mark.detail || "",
        figure: mark.figure || "",
        fraction: mark.fraction || 0,
        // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
        ended: Boolean(type.process) && mark.state === "ended",
        active: Boolean(type.process) && mark.state === "shown",
        time: Date.parse(mark.created_at) / 1000,
        action: opens ? ACTIONS[opens](mark) : "",
        handlers: opens ? {onAct: () => OPENERS[opens](mark)} : {},
    };
}

import {go, peekRef} from "../route.js";
import {actionLabel, refAction} from "./markAction.js";

const OUTCOME_TONES = {passed: "good", failed: "danger", warned: "warn", running: ""};

// what a click does besides unfolding a second line, which ChatMark does itself: open the row or the page the mark names
const OPENERS = {
    "open row": (mark) => peekRef(`${mark.target_model}:${mark.target_id}`),
    "open page": (mark) => go(mark.target_model, mark.target_id || 0),
};
const ACTIONS = {"open row": (mark) => refAction(mark.target_model), "open page": () => actionLabel("pages")};

// the mark object ChatMark draws, from a chat mark row and its type's declaration: the fields Turn.vue built in version 4
export function markLook(mark, declaration) {
    const kind = declaration || {};
    const opens = OPENERS[kind.click] && mark.target_model ? kind.click : "";
    return {
        key: `chat_mark:${mark.id}`,
        icon: kind.family_icon || (declaration ? "" : "dot"),
        markIcon: kind.mark_icon || "",
        group: kind.group || "",
        tone: kind.colouring === "outcome" ? OUTCOME_TONES[mark.outcome] || "" : "",
        label: mark.text,
        // a mark with a body of its module's own keeps its lines for that body, and its cut-off first part is not a second line
        detail: kind.body_url ? "" : mark.detail || "",
        figure: mark.figure || "",
        fraction: mark.fraction || 0,
        // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
        ended: Boolean(kind.process) && mark.state === "ended",
        active: Boolean(kind.process) && mark.state === "shown",
        time: mark.created_at,
        action: opens ? ACTIONS[opens](mark) : "",
        handlers: opens ? {onAct: () => OPENERS[opens](mark)} : {},
    };
}

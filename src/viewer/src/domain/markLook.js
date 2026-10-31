import {peekRef} from "../route.js";
import {refAction} from "./markAction.js";

const OUTCOME_TONES = {passed: "good", failed: "danger", warned: "warn", running: ""};

// the mark object ChatMark draws, from a chat mark row and its type's declaration: the fields Turn.vue built in version 4
export function markLook(mark, declaration) {
    const kind = declaration || {};
    const opensRow = kind.click === "open row" && Boolean(mark.target_model && mark.target_id);
    return {
        key: `chat_mark:${mark.id}`,
        icon: kind.family_icon || "",
        markIcon: kind.mark_icon || "",
        group: kind.group || "",
        tone: kind.colouring === "outcome" ? OUTCOME_TONES[mark.outcome] || "" : "",
        label: mark.text,
        detail: mark.detail || "",
        figure: mark.figure || "",
        fraction: mark.fraction || 0,
        ended: mark.state === "ended",
        active: Boolean(kind.process) && mark.state === "shown",
        time: mark.created_at,
        action: opensRow ? refAction(mark.target_model) : "",
        handlers: opensRow ? {onAct: () => peekRef(`${mark.target_model}:${mark.target_id}`)} : {},
    };
}

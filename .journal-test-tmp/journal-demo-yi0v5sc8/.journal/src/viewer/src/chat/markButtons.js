import {CHAT_WINDOW} from "../windows/chatOptions.js";
import {lineResult, lineWords} from "../windows/windowContext.js";
import {allowed} from "@journal/window-kit";

export {CHAT_WINDOW};

// the command arguments a button sends, with its field values kept whole
const buttonLine = (button, row, values = {}) => lineWords(button.runs).map((word) =>
    word.replace(/\{(\w+)\}/g, (_, name) => name === "row_id" ? String(row?.id ?? "") : values[name]));

// a button sends its declared command after the person allows its module
export async function pressButton(button, row, environment, values = {}) {
    try {
        if (!(await allowed(button.module, environment))) return {ok: false, error: ""};
        return lineResult(CHAT_WINDOW, buttonLine(button, row, values), environment);
    } catch (error) {
        return {ok: false, error: error.message};
    }
}

// the buttons a person may press: all of them when nothing limits the lines they may run, else those whose line, its first two words, is allowed
export const pressable = (buttons, allowedRuns) =>
    allowedRuns ? buttons.filter((button) => allowedRuns.includes(button.runs.split(" ").slice(0, 2).join(" "))) : buttons;

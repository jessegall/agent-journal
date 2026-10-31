import {lineResult} from "../windows/windowContext.js";

export const CHAT_WINDOW = "chat";

// the line a button sends: its declared line with {row_id} filled from the mark's row
export const buttonLine = (button, mark) => button.runs.replaceAll("{row_id}", String(mark.target_id ?? ""));

// a button sends only its declared line, to the line route, as the chat window
export const pressButton = (button, mark, environment) => lineResult(CHAT_WINDOW, buttonLine(button, mark), environment);

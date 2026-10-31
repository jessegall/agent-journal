import {familyOptions} from "../domain/markFamilies.js";

export const CHAT_WINDOW = "messages.chat";

// the catalogue's windows with the chat window's options followed by the families'
export const withFamilyOptions = (windows, declarations) =>
    windows.map((window) => (window.name === CHAT_WINDOW ? {...window, options: [...(window.options || []), ...familyOptions(declarations)]} : window));

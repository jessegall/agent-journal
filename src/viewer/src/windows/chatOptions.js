import {familyOptions, familyPresets} from "../domain/markFamilies.js";

export const CHAT_WINDOW = "messages.chat";

const presetOption = (declarations) => ({control: "preset", key: "show-preset", label: "Show in chat", presets: familyPresets(declarations)});

// the catalogue's windows with the chat window's options followed by the marks' preset and the families'
export const withFamilyOptions = (windows, declarations) =>
    windows.map((window) => (window.name === CHAT_WINDOW ? {...window, options: [...(window.options || []), presetOption(declarations), ...familyOptions(declarations)]} : window));

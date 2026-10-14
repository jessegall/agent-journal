import {span} from "./time.js";

export const usedPercent = (window) => Math.max(0, Math.min(100, Math.round(Number(window.used ?? 100 - window.remaining))));

export function resetLabel(window) {
    const seconds = window.resets - Date.now() / 1000;
    return seconds > 0 ? `resets in ${span(seconds)}` : "reset due";
}

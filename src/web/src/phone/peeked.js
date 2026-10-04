import {chipTarget} from "../route.js";
export function peeked(event) {
    const chip = chipTarget(event);
    if (chip) return chip.split("@")[0];
    const pill = event.target.closest("a.file-pill");
    if (!pill) return "";
    event.preventDefault();
    event.stopPropagation();
    const asked = new URLSearchParams(pill.getAttribute("href").split("?")[1] || "");
    return `source:${encodeURIComponent(asked.get("q") || "")}${asked.get("line") ? `#L${asked.get("line")}` : ""}`;
}

export const chipOpener = (open) => (event) => {
    const target = peeked(event);
    if (target) open(target);
};

import {chipTarget} from "../route.js";
export function peeked(event) {
    const chip = chipTarget(event);
    if (chip) return chip.split("@")[0];
    const commit = event.target.closest("a[data-commit]");
    if (commit) {
        event.preventDefault();
        event.stopPropagation();
        return `commit:${commit.dataset.commit}`;
    }
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

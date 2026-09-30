export function peeked(event) {
    const pill = event.target.closest("a.file-pill");
    const chip = event.target.closest("[data-peek]");
    if (!pill && !chip) return "";
    event.preventDefault();
    event.stopPropagation();
    if (chip) return chip.dataset.peek.split("@")[0];
    const asked = new URLSearchParams(pill.getAttribute("href").split("?")[1] || "");
    return `source:${encodeURIComponent(asked.get("q") || "")}${asked.get("line") ? `#L${asked.get("line")}` : ""}`;
}

export const chipOpener = (open) => (event) => {
    const target = peeked(event);
    if (target) open(target);
};

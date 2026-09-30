export function peeked(event) {
    const chip = event.target.closest("[data-peek]");
    if (!chip) return "";
    event.preventDefault();
    event.stopPropagation();
    return chip.dataset.peek.split("@")[0];
}

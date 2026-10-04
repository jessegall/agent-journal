export function fitLines(box, lines) {
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${Math.min(box.scrollHeight, lines * parseFloat(getComputedStyle(box).lineHeight))}px`;
}

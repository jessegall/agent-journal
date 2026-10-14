const coarse = () => window.matchMedia?.("(pointer: coarse)").matches;

export function tick() {
    if (navigator.vibrate) return navigator.vibrate(10);
    if (!coarse()) return;
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.ariaHidden = "true";
    label.style.display = "none";
    input.type = "checkbox";
    input.setAttribute("switch", "");
    label.appendChild(input);
    document.head.appendChild(label);
    label.click();
    label.remove();
}

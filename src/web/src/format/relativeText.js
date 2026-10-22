const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// a line the viewer shows, with the project folder left out of its paths
export function relativeText(text, project = "") {
    const plain = String(text || "").trim();
    return project ? plain.replaceAll(new RegExp(`(?:/[^\\s"']+)*?/${escaped(project)}/`, "g"), "") : plain;
}

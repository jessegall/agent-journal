const LONGEST = 80;

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const relative = (text, project) => (project ? text.replaceAll(new RegExp(`(?:/[^\\s"']+)*?/${escaped(project)}/`, "g"), "") : text);

function commandHead(command) {
    const [word, ...rest] = String(command || "").trim().split(/\s+/);
    const path = rest.find((part) => part.includes("/") && !part.startsWith("-"));
    return path ? `${word} ${path}` : word;
}

export function oneLine(text, project = "") {
    const plain = relative(String(text || "").trim(), project);
    return plain.includes("\n") || plain.length > LONGEST ? commandHead(plain) : plain;
}

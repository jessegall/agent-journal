const transformers = [];

export function register(fn) {
    transformers.push(fn);
}

export function escape(text) {
    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function transformed(text, context) {
    const blocks = [{kind: "text", text: escape(text).replace(/\r\n/g, "\n")}];
    for (const fn of transformers) {
        for (let i = blocks.length - 1; i >= 0; i--) {
            const b = blocks[i];
            if (b.kind !== "text") continue;
            const made = fn(b.text, context);
            if (typeof made === "string") b.text = made;
            else if (made) blocks.splice(i, 1, ...made);
        }
    }
    return blocks;
}

export function render(text, context) {
    return transformed(text, context)
        .map((b) => (b.kind === "text" ? paragraphs(b.text) : b.html))
        .filter(Boolean)
        .join("");
}

export function inline(text, context) {
    return transformed(text, context)
        .map((b) => (b.kind === "text" ? b.text : b.html))
        .join("");
}

function paragraphs(text) {
    return text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("");
}

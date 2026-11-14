// the colour of code in the file reader: comments, strings, keywords and the names of calls, cut out in that order so no word is coloured inside a string
const KEYWORDS = /\b(from|import|const|def|class|return|for|in|if|else|export|template|script)\b/g;
const CALLS = /\b([A-Z][A-Za-z]+)(?=\()/g;
const ESCAPES = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"};
const LANGUAGES = {py: "Python", vue: "Vue", md: "Markdown", css: "CSS", js: "JavaScript", json: "JSON", html: "HTML", sh: "Shell", yml: "YAML", yaml: "YAML", toml: "TOML", go: "Go"};

const escapeHtml = (text) => text.replace(/[&<>"']/g, (mark) => ESCAPES[mark]);

export function tint(line) {
    if (/^\s*(#|\/\/)/.test(line)) return `<span class="tk-c">${escapeHtml(line)}</span>`;
    return line
        .split(/("[^"]*")/)
        .map((part, at) => (at % 2 ? `<span class="tk-s">${escapeHtml(part)}</span>` : escapeHtml(part).replace(KEYWORDS, '<span class="tk-k">$1</span>').replace(CALLS, '<span class="tk-f">$1</span>')))
        .join("");
}

export const languageOf = (path) => LANGUAGES[path.split(".").pop()] ?? "Text";

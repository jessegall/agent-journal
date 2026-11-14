export const skillMarkdown = (text) => String(text || "").replace(/^---\n[\s\S]*?\n---\n+/, "");

export function splitQuote(text) {
    const lines = String(text || "").split("\n");
    let at = 0;
    while (at < lines.length && (lines[at].startsWith(">") || (at > 0 && !lines[at].trim() && lines.slice(0, at).every((line) => line.startsWith(">"))))) at += 1;
    const quote = lines
        .slice(0, at)
        .filter((line) => line.startsWith(">"))
        .map((line) => line.replace(/^>\s?/, ""))
        .join(" ")
        .trim();
    return {quote, body: lines.slice(at).join("\n").trim()};
}

export function quoted(text) {
    const lines = String(text ?? "").split("\n");
    const quote = [];
    while (lines.length && lines[0].startsWith(">")) quote.push(lines.shift().replace(/^> ?/, ""));
    return {quote: quote.join("\n"), text: lines.join("\n").trim()};
}

export function withQuote(quote, text) {
    return quote ? `> ${quote.replace(/\n/g, "\n> ")}\n\n${text}` : text;
}

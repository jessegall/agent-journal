// a card's title with the number its text sets in place of N, and the count's name in place of "a count"
const N = /\bN(th)?\b/;

export function cardTitle(entry, node, limit = null) {
    const title = entry.title || "";
    if (!N.test(title) || !node.text) return title;
    const [name, written] = node.text.trim().split(/\s+/);
    const number = limit ? String(limit.number) : written;
    const numbered = (value) => title.replace(N, (match, th) => `${value}${th || ""}`);
    if (title.includes("a count")) return number ? numbered(number).replace("a count", `the count ${name}`) : title;
    return numbered(node.text.trim());
}

// what a count check's number is, when it comes from a setting
export function limitNote(limit) {
    return limit && limit.setting ? `${limit.number} is the setting ${limit.setting}` : "";
}

// a message's words as far as three lines hold them, its [key] left to the side panel, cut after a whole word, with how many more there are
export const SHOWN_CHARACTERS = 96;

export function messageShown(text) {
    const words = (text || "")
        .replace(/^\[[\w.]+\]\s*/, "")
        .split(/\s+/)
        .filter(Boolean);
    const shown = [];
    for (const word of words) {
        if ([...shown, word].join(" ").length > SHOWN_CHARACTERS) break;
        shown.push(word);
    }
    const more = words.length - shown.length;
    return more ? `${shown.join(" ")} … ${more} more ${more === 1 ? "word" : "words"}` : shown.join(" ");
}

const END = /^(.+?[.!?])(\s|$)/s;

export function firstSentence(text) {
    const flat = String(text || "")
        .trim()
        .replace(/\s+/g, " ");
    return (END.exec(flat) || [, flat])[1];
}

// words with their first letter a capital, to start a sentence
export const capitalised = (words) => `${words.charAt(0).toUpperCase()}${words.slice(1)}`;

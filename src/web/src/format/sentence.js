const END = /^(.+?[.!?])(\s|$)/s;

export function firstSentence(text) {
    const flat = String(text || "").trim().replace(/\s+/g, " ");
    return (END.exec(flat) || [, flat])[1];
}

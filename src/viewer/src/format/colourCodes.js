const CODES = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g;

// a text without the colour and cursor codes a program printed, so a mark or a card never shows an escape, also from output kept before the journal took them out
export const withoutColourCodes = (text) => String(text ?? "").replace(CODES, "");

// the forms a list setting is kept and sent in, shared by every screen that draws one: the server lists a list as
// a JSON list, takes a list as JSON and a number list as comma text, and a user types one entry on each line

export function listItems(value) {
    if (Array.isArray(value)) return value;
    return value ? JSON.parse(value) : [];
}

export const listLines = (value) => listItems(value).join("\n");

export const itemsOfLines = (text) => text.split("\n").map((item) => item.trim()).filter(Boolean);

export const sentList = (items, isNumbers) => (isNumbers ? items.join(",") : JSON.stringify(items));

// the entries of a list written as text: JSON text or comma text
export const textItems = (text) => (text.trim().startsWith("[") ? JSON.parse(text) : text.split(",").map((item) => item.trim()).filter(Boolean));

// what the row shows once the text is saved: JSON text, from JSON text or comma text
export function shownList(text, isNumbers) {
    const items = textItems(text);
    return JSON.stringify(isNumbers ? items.map(Number) : items);
}

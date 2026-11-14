export function matchesSearch(row, words, fields = []) {
    const text = fields.length ? fields.map((field) => row[field]).join(" ") : JSON.stringify(row);
    return text.toLowerCase().includes(words.trim().toLowerCase());
}

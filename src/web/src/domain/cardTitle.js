// a card's title with the number its text sets in place of N, and the count's name in place of "a count"
const N = /\bN(th)?\b/;

export function cardTitle(entry, node) {
    const title = entry.title || "";
    if (!N.test(title) || !node.text) return title;
    const [name, number] = node.text.trim().split(/\s+/);
    const numbered = (value) => title.replace(N, (match, th) => `${value}${th || ""}`);
    if (title.includes("a count")) return number ? numbered(number).replace("a count", `the count ${name}`) : title;
    return numbered(name);
}

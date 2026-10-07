const BLOCKS = 5;

export const statFiles = (stat) =>
    (stat || "")
        .split("\n")
        .filter((l) => l.includes("|"))
        .map((l) => {
            const [path, change] = l.split("|").map((x) => x.trim());
            return {
                path,
                adds: (change.match(/\+/g) || []).length,
                dels: (change.match(/-/g) || []).length,
                count: Number(change.split(" ")[0]) || 0,
            };
        });

export const renamedTo = (path) => path.replace(/\{.*=> (.*)\}/, "$1");

export function statBlocks(file, largest) {
    const filled = Math.max(file.count ? 1 : 0, Math.round((BLOCKS * file.count) / largest));
    const marks = file.adds + file.dels;
    const green = marks ? Math.round((filled * file.adds) / marks) : 0;
    return Array.from({length: BLOCKS}, (_, i) => (i < green ? "adds" : i < filled ? "dels" : "none"));
}

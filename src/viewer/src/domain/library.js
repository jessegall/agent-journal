// What a library item's version carries that its import writes, shown before the import: a reader's pattern or script
export function readerScript(version) {
    return version ? JSON.parse(version.body || "{}").text || "" : "";
}

// Where an import of a skill writes its folder
export const skillFolder = (name) => `.claude/skills/${name}`;

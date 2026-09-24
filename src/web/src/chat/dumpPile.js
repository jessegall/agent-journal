export const TEXT_ITEM = "text";

export const itemLabel = (name) => (name === TEXT_ITEM ? "Pasted text" : name.startsWith("added-") ? "Added note" : name);

export function fileKind(name) {
    if (name === TEXT_ITEM || name.startsWith("added-") || !name.includes(".")) return "TXT";
    const ext = name.split(".").pop().toUpperCase();
    return ext.length <= 4 ? ext : "FILE";
}

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

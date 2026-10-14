export const TEXT_ITEM = "text";

export const DUMP_OFFER = {
    title: (n) => `${n} files. Send as a dump instead?`,
    text: "The agent reads them together and files each subject as its own document with a proper name, in a new collection you can remove in one step.",
    action: "Send as a dump",
};

export const PHASE_WORDS = {
    removed: "Removed",
    stopped: "Stopped",
    done: "Filed",
    queued: "Queued",
    asking: "Needs you",
    quiet: "Quiet",
    filing: "Filing",
    waiting: "Filing",
};

export const itemLabel = (name) => (name === TEXT_ITEM ? "Pasted text" : name.startsWith("added-") ? "Added note" : name);

export function fileKind(name) {
    if (name === TEXT_ITEM || name.startsWith("added-") || !name.includes(".")) return "TXT";
    const ext = name.split(".").pop().toUpperCase();
    return ext.length <= 4 ? ext : "FILE";
}

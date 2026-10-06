const ROW_LIST = /^\s*[\w-]+:\d+(\s*,\s*[\w-]+:\d+)*\s*$/;

export function isProcessedPart(part) {
    return ROW_LIST.test(String(part.body ?? ""));
}

export function textParts(sections) {
    return (sections || []).filter((part) => !isProcessedPart(part));
}

// what a node's runs and a run's reads say on the canvas
export function nodeRunWords(node) {
    if (!node || !node.runs) return "";
    return node.runs === 1 ? "ran once" : `ran ${node.runs} times`;
}

export function readWords(read, nodeId) {
    const value = read && read[String(nodeId)];
    return value === undefined ? "" : `read ${value}`;
}

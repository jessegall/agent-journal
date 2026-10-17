// where each agent stands in a workflow, as its nodes say it
export function waitingAt(standing, nodeId) {
    return (standing?.agents || []).filter((a) => a.waits && String(a.node) === String(nodeId));
}

export function waitingWords(standing, nodeId) {
    const waiting = waitingAt(standing, nodeId).length;
    if (!waiting) return "";
    return waiting === 1 ? "Waiting here" : `${waiting} agents waiting here`;
}

// a count check's text is the count's name, then its number or a setting's name
export function countWords(standing, node) {
    const [name, limit] = (node.text || "").trim().split(/\s+/);
    const agent = waitingAt(standing, node.id)[0] || (standing?.agents || [])[0];
    if (!name || !agent) return "";
    const value = name in (agent.counts || {}) ? agent.counts[name] : (agent.readings || {})[name];
    if (value === undefined) return "";
    const number = standing?.limits?.[String(node.id)]?.number ?? (/^\d+$/.test(limit || "") ? limit : null);
    return number ? `${name} ${value} of ${number}` : `${name} ${value}`;
}

export function standingLines(standing, nodeId) {
    return waitingAt(standing, nodeId).map((a) => ({
        label: `Agent ${a.n}`,
        words:
            Object.entries({...(a.counts || {}), ...(a.readings || {})})
                .map(([name, value]) => `${name} ${value}`)
                .join(", ") || "waits here",
    }));
}

export function readingLines(standing) {
    return Object.entries(standing?.readings || {}).map(([name, meaning]) => ({label: `${name}, a reading`, words: meaning}));
}

// the number a count check compares with, and the setting it comes from when it names one
export function limitOf(standing, node) {
    return standing?.limits?.[String(node.id)] || null;
}

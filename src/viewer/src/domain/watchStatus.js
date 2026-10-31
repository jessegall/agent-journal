const PREFIX = "now: ";
const SOURCE = /^(\S+): /;

// the lines a watched output prints, split into what is happening now, the latest of each source, and the steps; a source is a plugin's name before its status, the journal's own status has none
export function watchLines(lines) {
    const statuses = new Map();
    const steps = [];
    for (const line of lines) {
        if (!line.startsWith(PREFIX)) {
            steps.push(line);
            continue;
        }
        const text = line.slice(PREFIX.length);
        statuses.set(text.match(SOURCE)?.[1] || "", text);
    }
    return {statuses: [...statuses.values()], steps};
}

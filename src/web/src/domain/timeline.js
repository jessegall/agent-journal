export const MOMENTS = {
    started: {icon: "play", word: "Started"},
    log: {icon: "pencil", word: "Logged"},
    ended: {icon: "flag", word: "Work ended"},
    done: {icon: "tick", word: "Done"},
};

const dayOf = (at) => new Date(at * 1000).toLocaleDateString(undefined, {weekday: "short", day: "numeric", month: "short"});

export const timeOf = (at) => new Date(at * 1000).toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"});

export function momentDays(items) {
    const grouped = [];
    for (const item of [...items].reverse()) {
        const day = dayOf(item.at);
        if (grouped.at(-1)?.day !== day) grouped.push({day, items: []});
        grouped.at(-1).items.push(item);
    }
    return grouped;
}

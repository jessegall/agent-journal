// The order of the agents window: working agents always come first, then those waiting for input, then the idle and the stopped; the order picked sorts within each.
const GROUP = {working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped"};
const stateGroup = (entry) => GROUP[entry.card.state] || "idle";

const byNumber = (a, b) => a.n - b.n || a.type.localeCompare(b.type) || a.key.localeCompare(b.key);

const RANK = {working: 0, waiting: 1, idle: 2, stopped: 3};
const byRank = (a, b) => RANK[stateGroup(a)] - RANK[stateGroup(b)];
const BY = {
    state: (a, b) => b.time - a.time,
    active: (a, b) => b.time - a.time,
};

export const ordered = (entries, order, slots = []) =>
    order === "number"
        ? [...entries].sort((a, b) => byRank(a, b) || slots.indexOf(a.key) - slots.indexOf(b.key) || byNumber(a, b))
        : [...entries].sort((a, b) => byRank(a, b) || (BY[order] || BY.state)(a, b));

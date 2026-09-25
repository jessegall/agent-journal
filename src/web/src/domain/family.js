const TREE = ["started", "dispatched"];
const LIVE = ["running", "working", "busy", "compacting"];
const RESTED = ["stopped", "done"];
const ROOTS = "fold:";
const PAD = 16;

const NODE = {h: 30, row: 38, gap: 12};

export const SIZES = {wide: {w: 212, col: 264}, compact: {w: 140, col: 168}};

export const live = (member) => LIVE.includes(member.status);

const rested = (member) => RESTED.includes(member.status);

const dotState = (member) => (live(member) ? "running" : member.status === "done" ? "done" : "");

const ICONS = {main: "agents", ticket: "ticket", plan: "plan", role: "agents", subagent: "branch", peer: "chat"};

function parenting(family, byId) {
    const kids = new Map();
    const parent = new Map();
    const kind = new Map();
    const above = (id, other) => {
        for (let at = id; at; at = parent.get(at)) if (at === other) return true;
        return false;
    };
    const adopt = (from, to, how) => {
        if (from === to || parent.has(to) || above(from, to)) return;
        parent.set(to, from);
        kind.set(to, how);
        kids.set(from, [...(kids.get(from) || []), to]);
    };
    const known = family.links.filter((l) => byId.has(l.source) && byId.has(l.target));
    known.filter((l) => TREE.includes(l.kind)).forEach((l) => adopt(l.source, l.target, l.kind));
    const outside = (id) => byId.get(id).kind === "peer";
    known
        .filter((l) => l.kind === "messaged" && outside(l.source) !== outside(l.target))
        .forEach((l) => (outside(l.target) ? adopt(l.source, l.target, "messaged") : adopt(l.target, l.source, "messaged")));
    return {kids, parent, kind};
}

const PEERS_SHOWN = 3;

function folded(key, ids, byId, kids, unfolded, weight) {
    const finished = ids.filter((id) => rested(byId.get(id)) && !(kids.get(id) || []).length);
    const peers = ids.filter((id) => byId.get(id).kind === "peer").sort((a, b) => (weight.get(b) || 0) - (weight.get(a) || 0));
    const quiet = peers.slice(PEERS_SHOWN);
    const hidden = [...finished, ...quiet];
    if (hidden.length < 2) return ids;
    const label = quiet.length
        ? finished.length
            ? `${hidden.length} more`
            : `${quiet.length} more sessions`
        : `${finished.length} finished`;
    const fold = {fold: key, count: hidden.length, label, open: unfolded.has(key), hidden};
    return fold.open ? [...ids, fold] : [...ids.filter((id) => !hidden.includes(id)), fold];
}

function weighing(family) {
    const weight = new Map();
    family.links
        .filter((l) => l.kind === "messaged")
        .forEach((l) => [l.source, l.target].forEach((id) => weight.set(id, (weight.get(id) || 0) + l.count)));
    return weight;
}

export function familyTree(family, unfolded, size = SIZES.wide) {
    const byId = new Map(family.members.map((m) => [m.id, m]));
    const {kids, parent, kind} = parenting(family, byId);
    const weight = weighing(family);
    const nodes = [];
    const edges = [];
    const shown = new Map();
    let row = 0;

    function place(item, level, from, how) {
        const id = item.fold ? item.fold : item;
        const node = {
            id,
            level,
            x: PAD + level * size.col,
            y: 0,
            w: size.w,
            h: NODE.h,
            fold: item.fold ? item : null,
            member: item.fold ? null : byId.get(item),
        };
        nodes.push(node);
        if (from) edges.push({id: `${from.id}>${id}`, kind: how, from, to: node, said: 0});
        if (item.fold) {
            if (!item.open) item.hidden.forEach((hid) => shown.set(hid, node));
            node.y = PAD + row++ * NODE.row;
            return node;
        }
        shown.set(id, node);
        const below = folded(`${ROOTS}${id}`, kids.get(id) || [], byId, kids, unfolded, weight).map((child) =>
            place(child, level + 1, node, child.fold ? "fold" : kind.get(child))
        );
        node.y = below.length ? (below[0].y + below[below.length - 1].y) / 2 : PAD + row++ * NODE.row;
        return node;
    }

    const roots = family.members.filter((m) => !parent.has(m.id)).map((m) => m.id);
    const ordered = [...roots.filter((id) => !rested(byId.get(id))), ...roots.filter((id) => rested(byId.get(id)))];
    folded(ROOTS, ordered, byId, kids, unfolded, weight).forEach((top, at) => {
        if (at) row += NODE.gap / NODE.row;
        place(top, 0, null, "");
    });

    const between = new Map(edges.map((e) => [[e.from.id, e.to.id].sort().join("~"), e]));
    family.links
        .filter((l) => l.kind === "messaged" && shown.has(l.source) && shown.has(l.target))
        .forEach((l) => {
            const a = shown.get(l.source);
            const b = shown.get(l.target);
            if (a === b) return;
            const key = [a.id, b.id].sort().join("~");
            const held = between.get(key) || {id: key, kind: "talk", from: a, to: b, said: 0};
            held.said += l.count;
            between.set(key, held);
        });

    return {
        nodes,
        edges: [...between.values()],
        width: Math.max(0, ...nodes.map((n) => n.x)) + size.w + PAD,
        height: Math.max(0, ...nodes.map((n) => n.y)) + NODE.h + PAD,
    };
}

export function edgePath(edge) {
    const {from, to} = edge;
    const mid = NODE.h / 2;
    if (edge.kind !== "talk" || from.level !== to.level) {
        const [a, b] = from.x <= to.x ? [from, to] : [to, from];
        const x1 = a.x + a.w;
        const x2 = b.x;
        const bend = Math.max((x2 - x1) / 2, 24);
        return `M${x1},${a.y + mid} C${x1 + bend},${a.y + mid} ${x2 - bend},${b.y + mid} ${x2},${b.y + mid}`;
    }
    const x = from.x + from.w;
    const reach = Math.min(28 + Math.abs(to.y - from.y) / 6, 72);
    return `M${x},${from.y + mid} C${x + reach},${from.y + mid} ${x + reach},${to.y + mid} ${x},${to.y + mid}`;
}

export function edgeLabel(edge) {
    const {from, to} = edge;
    const mid = NODE.h / 2 - 4;
    if (edge.kind !== "talk") return {x: to.x - 8, y: to.y + mid, end: true};
    if (from.level === to.level)
        return {x: from.x + from.w + Math.min(28 + Math.abs(to.y - from.y) / 6, 72) * 0.75 + 4, y: (from.y + to.y) / 2 + mid, end: false};
    return {x: (from.x + from.w + to.x) / 2, y: (from.y + to.y) / 2 + mid, end: false};
}

export function nodeLook(node) {
    if (node.fold)
        return {
            label: node.fold.open ? "Fold these back" : node.fold.label,
            note: "",
            icon: node.fold.open ? "up" : "plus",
            state: null,
        };
    const m = node.member;
    const [name, task] = m.kind === "subagent" && m.label.includes(": ") ? m.label.split(/: (.*)/s) : [m.label, ""];
    return {
        label: name,
        note: task || (m.kind === "peer" ? "another session" : m.detail),
        icon: ICONS[m.kind] || "agents",
        state: m.kind === "peer" ? null : dotState(m),
    };
}

export function familyCounts(family) {
    const members = family.members;
    return {
        live: members.filter(live).length,
        agents: members.filter((m) => !["subagent", "peer"].includes(m.kind)).length,
        subagents: members.filter((m) => m.kind === "subagent").length,
        messages: family.links.filter((l) => l.kind === "messaged").reduce((n, l) => n + l.count, 0),
    };
}

import {questionAbout} from "./records.js";
import {statusOf, waitOf} from "./taskBoard.js";

export const NODE = {width: 188, height: 52, gap: 40, rowHeight: 64, foldWidth: 168, foldHeight: 30};
const LONGEST_CHAIN = 3;

const live = (tasks) => tasks.filter((t) => statusOf(t) !== "done");

// What a task waits on as a node of the graph: another task, a question or a command; a task blocked by a reason alone has none.
export function waitTarget(task, tasks) {
    if (statusOf(task) === "asked") return {key: `q${questionAbout(task).id}`, kind: "question", id: questionAbout(task).id};
    const wait = waitOf(task);
    if (!wait || wait.kind === "reason") return null;
    if (wait.kind === "task") {
        const target = tasks.find((t) => t.id === wait.id);
        return target ? {key: `t${target.id}`, kind: "task", task: target} : null;
    }
    if (wait.kind === "question") return {key: `q${wait.id}`, kind: "question", id: wait.id};
    return {key: `c${task.id}`, kind: "command", id: wait.id, owner: task.id};
}

export const waitersOf = (id, tasks) => live(tasks).filter((t) => waitOf(t)?.kind === "task" && waitOf(t).id === id);

function model(tasks) {
    const nodes = new Map();
    const edges = [];
    for (const task of live(tasks)) {
        const target = waitTarget(task, tasks);
        if (!target && waitOf(task)?.kind !== "reason") continue;
        nodes.set(`t${task.id}`, {key: `t${task.id}`, kind: "task", task});
        if (!target) continue;
        if (!nodes.has(target.key)) nodes.set(target.key, target);
        edges.push([`t${task.id}`, target.key]);
    }
    return {nodes, edges};
}

function components({nodes, edges}) {
    const near = new Map([...nodes.keys()].map((k) => [k, new Set()]));
    for (const [a, b] of edges) {
        near.get(a).add(b);
        near.get(b).add(a);
    }
    const seen = new Set();
    const found = [];
    for (const start of nodes.keys()) {
        if (seen.has(start)) continue;
        const todo = [start];
        const keys = [];
        seen.add(start);
        while (todo.length) {
            const key = todo.pop();
            keys.push(key);
            for (const next of [...near.get(key)].filter((k) => !seen.has(k))) {
                seen.add(next);
                todo.push(next);
            }
        }
        found.push(keys);
    }
    return found;
}

// A long single chain shows its two ends and one node for the tasks between them, until it is unfolded.
function folded(keys, edges, unfolded) {
    const into = (k) => edges.filter((e) => e[1] === k);
    const out = (k) => edges.filter((e) => e[0] === k);
    if (keys.length <= LONGEST_CHAIN || !keys.every((k) => into(k).length <= 1 && out(k).length <= 1)) return null;
    const chain = [keys.find((k) => !into(k).length)];
    while (out(chain.at(-1)).length) chain.push(out(chain.at(-1))[0][1]);
    if (unfolded[chain[0]]) return null;
    const fold = {key: `f${chain[0]}`, kind: "fold", count: chain.length - 2, head: chain[0]};
    return {
        keys: [chain[0], fold.key, chain.at(-1)],
        edges: [
            [chain[0], fold.key],
            [fold.key, chain.at(-1)],
        ],
        fold,
        hidden: chain.slice(1, -1),
    };
}

function grouped(tasks, unfolded) {
    const whole = model(tasks);
    const order = (keys) => Math.min(...keys.map((k) => tasks.findIndex((t) => `t${t.id}` === k)).filter((i) => i >= 0));
    return components(whole)
        .map((keys) => {
            const own = whole.edges.filter((e) => keys.includes(e[0]));
            const nodes = new Map(keys.map((k) => [k, whole.nodes.get(k)]));
            const fold = folded(keys, own, unfolded);
            if (!fold) return {keys, edges: own, nodes};
            fold.hidden.forEach((k) => nodes.delete(k));
            nodes.set(fold.fold.key, fold.fold);
            return {keys: fold.keys, edges: fold.edges, nodes};
        })
        .sort((a, b) => order(a.keys) - order(b.keys));
}

function depths(group) {
    const depth = {};
    const of = (k) => depth[k] ?? (depth[k] = Math.max(0, ...group.edges.filter((e) => e[0] === k).map((e) => 1 + of(e[1]))));
    group.keys.forEach(of);
    return depth;
}

function columns(group, column) {
    const cols = {};
    for (const k of group.keys) (cols[column(k)] ||= []).push(k);
    return cols;
}

function across(groups) {
    const deepest = Math.max(0, ...groups.map((g) => Math.max(...Object.values(g.depth))));
    const placed = [];
    let y = 0;
    for (const g of groups) {
        const cols = columns(g, (k) => deepest - g.depth[k]);
        const tall = Math.max(...Object.values(cols).map((ks) => ks.length));
        for (const [col, ks] of Object.entries(cols)) {
            ks.forEach((k, i) =>
                placed.push({
                    key: k,
                    node: g.nodes.get(k),
                    x: Number(col) * (NODE.width + NODE.gap),
                    y: y + (i + (tall - ks.length) / 2) * NODE.rowHeight,
                    w: NODE.width,
                })
            );
        }
        y += tall * NODE.rowHeight + (g.caption ? 16 : 0) + 8;
    }
    return {placed, width: (deepest + 1) * NODE.width + deepest * NODE.gap, height: Math.max(0, y - 8)};
}

function down(groups, width) {
    const placed = [];
    let y = 0;
    for (const g of groups) {
        const top = Math.max(...Object.values(g.depth));
        const cols = columns(g, (k) => top - g.depth[k]);
        for (const level of Object.keys(cols)
            .map(Number)
            .sort((a, b) => a - b)) {
            const ks = cols[level];
            const w = (width - (ks.length - 1) * 10) / ks.length;
            ks.forEach((k, i) => placed.push({key: k, node: g.nodes.get(k), x: i * (w + 10), y, w}));
            y += NODE.height + 30;
        }
        y += g.caption ? 2 : -14;
    }
    return {placed, width, height: Math.max(0, y - 8)};
}

const isFold = (p) => p.node.kind === "fold";

function acrossPath(a, b) {
    const x1 = isFold(a) ? a.x + a.w / 2 + NODE.foldWidth / 2 : a.x + a.w;
    const x2 = (isFold(b) ? b.x + b.w / 2 - NODE.foldWidth / 2 : b.x) - 2;
    const y1 = a.y + NODE.height / 2;
    const y2 = b.y + NODE.height / 2;
    return `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
}

function downPath(a, b) {
    const x1 = a.x + a.w / 2;
    const x2 = b.x + b.w / 2;
    const y1 = a.y + (isFold(a) ? (NODE.height + NODE.foldHeight) / 2 : NODE.height);
    const y2 = b.y + (isFold(b) ? (NODE.height - NODE.foldHeight) / 2 : 0) - 2;
    return `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;
}

// The graph of what waits on what, laid out left to right, or top to bottom when `narrow` gives a width.
export function taskGraph(tasks, {unfolded = {}, narrow = 0} = {}) {
    const groups = grouped(tasks, unfolded).map((g) => ({
        ...g,
        depth: depths(g),
        caption: g.keys.some((k) => g.nodes.get(k).kind === "task" && waitOf(g.nodes.get(k).task)?.kind === "reason"),
    }));
    const laid = narrow ? down(groups, narrow) : across(groups);
    const at = Object.fromEntries(laid.placed.map((p) => [p.key, p]));
    const path = narrow ? downPath : acrossPath;
    const edges = groups.flatMap((g) => g.edges).map(([a, b]) => ({from: a, to: b, d: path(at[a], at[b])}));
    const inGraph = laid.placed.reduce((n, p) => n + (p.node.kind === "task" ? 1 : isFold(p) ? p.node.count : 0), 0);
    return {...laid, edges, others: live(tasks).length - inGraph};
}

// The keys a node's chain reaches, both what it waits on and what waits on it.
export function chainOf(key, edges) {
    const on = new Set([key]);
    const walk = (k, forward) =>
        edges.forEach((e) => {
            const [from, to] = forward ? [e.from, e.to] : [e.to, e.from];
            if (from === k && !on.has(to)) {
                on.add(to);
                walk(to, forward);
            }
        });
    walk(key, true);
    walk(key, false);
    return on;
}

// A task's place in its chain for the inspector: the levels of tasks that wait on it, nearest last, and what it waits on, in turn.
export function chainAround(task, tasks) {
    const above = [];
    for (let level = waitersOf(task.id, tasks); level.length; level = level.flatMap((t) => waitersOf(t.id, tasks))) above.push(level);
    const below = [];
    for (let target = waitTarget(task, tasks); target; target = target.kind === "task" ? waitTarget(target.task, tasks) : null) {
        if (below.some((b) => b.key === target.key)) break;
        below.push(target);
    }
    return {above: above.reverse(), below};
}

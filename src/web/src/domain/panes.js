export const AGENT_VIEWS = ["chat", "feed", "terminal"];
export const PANEL_VIEWS = ["waiting", "question", "suggestion", "todos"];
export const VIEWS = [...AGENT_VIEWS, ...PANEL_VIEWS, "family"];
export const HEADER = 34;

const WHOLE = {x: 0, y: 0, w: 1, h: 1};
const EDGE_BAND = 0.25;

const leaf = (id) => ({id});
const split = (dir, r, a, b) => ({dir, r, a, b});

export const fresh = () => ({
    tree: split("row", 0.7, leaf(1), leaf(2)),
    panes: {1: {tabs: ["chat"], active: "chat"}, 2: {tabs: [...PANEL_VIEWS], active: "waiting"}},
    next: 3,
});

const shaped = (tabs, active = tabs[0]) => ({tabs, active});

export const FULL = "full";
export const CONTAINED = "contained";

export const DEFAULT_SHAPE = split("row", 0.7, shaped(["chat"]), shaped(PANEL_VIEWS));

export const PRESETS = [
    {key: "default", name: "Default", text: "Chat, with the side panels beside it", shape: DEFAULT_SHAPE},
    {key: "zen", name: "Zen", text: "Only the chat, nothing else", shape: {...shaped(["chat"]), width: CONTAINED}},
    {
        key: "hacker",
        name: "Hacker",
        text: "A big terminal with a small chat",
        shape: split("row", 0.72, shaped(["terminal"]), shaped(["chat"])),
    },
    {key: "review", name: "Review", text: "File feed and chat side by side", shape: split("row", 0.5, shaped(["feed"]), shaped(["chat"]))},
    {
        key: "watch",
        name: "Watch",
        text: "Terminal, with the file feed and notifications beside it",
        shape: split("row", 0.62, shaped(["terminal"]), split("col", 0.55, shaped(["feed"]), shaped(["waiting"]))),
    },
    {
        key: "triage",
        name: "Triage",
        text: "Chat, with questions and to-dos stacked beside it",
        shape: split("row", 0.6, shaped(["chat"]), split("col", 0.5, shaped(["question", "waiting"]), shaped(["todos", "suggestion"]))),
    },
];

export function thumbnail(shape, box = {x: 0, y: 0, w: 1, h: 1}) {
    if (!shape.dir) return [{box, view: shape.active}];
    const [a, b] = halves(shape, box);
    return [...thumbnail(shape.a, a), ...thumbnail(shape.b, b)];
}

const KEPT = ["tabs", "active", "width", "scheme", "flush", "feed", "verbosity", "hide"];

export const snapshot = (layout, node = layout.tree) =>
    node.dir
        ? split(node.dir, node.r, snapshot(layout, node.a), snapshot(layout, node.b))
        : Object.fromEntries(KEPT.map((key) => [key, (layout.panes[node.id] || {})[key]]).filter(([, v]) => v !== undefined));

export const shapeViews = (shape) => (shape.dir ? [...shapeViews(shape.a), ...shapeViews(shape.b)] : shape.tabs);

const signed = (node, tabsOf) =>
    node.dir ? `${node.dir}${Math.round(node.r * 100)}(${signed(node.a, tabsOf)}|${signed(node.b, tabsOf)})` : tabsOf(node).join(",");

export const matches = (layout, shape) =>
    signed(layout.tree, (node) => (layout.panes[node.id] ? layout.panes[node.id].tabs : [])) === signed(shape, (node) => node.tabs);

export const leaves = (node) => (node.dir ? [...leaves(node.a), ...leaves(node.b)] : [node.id]);

function halves(node, box) {
    const row = node.dir === "row";
    const cut = row ? box.w * node.r : box.h * node.r;
    return row
        ? [
              {x: box.x, y: box.y, w: cut, h: box.h},
              {x: box.x + cut, y: box.y, w: box.w - cut, h: box.h},
          ]
        : [
              {x: box.x, y: box.y, w: box.w, h: cut},
              {x: box.x, y: box.y + cut, w: box.w, h: box.h - cut},
          ];
}

export function measure(tree) {
    const rects = {};
    const splits = [];
    const walk = (node, box, path) => {
        if (!node.dir) {
            rects[node.id] = box;
            return;
        }
        const [a, b] = halves(node, box);
        splits.push({path, dir: node.dir, box, r: node.r});
        walk(node.a, a, `${path}a`);
        walk(node.b, b, `${path}b`);
    };
    walk(tree, WHOLE, "");
    return {rects, splits};
}

const without = (node, id) => {
    if (!node.dir) return node.id === id ? null : node;
    const a = without(node.a, id);
    const b = without(node.b, id);
    return !a ? b : !b ? a : {...node, a, b};
};

const replaced = (node, id, change) =>
    node.dir ? {...node, a: replaced(node.a, id, change), b: replaced(node.b, id, change)} : node.id === id ? change(node) : node;

export const resized = (node, path, r) => (path ? {...node, [path[0]]: resized(node[path[0]], path.slice(1), r)} : {...node, r});

function sideOf(node, id) {
    if (!node.dir) return null;
    if (!node.a.dir && node.a.id === id) return {dir: node.dir, first: true};
    if (!node.b.dir && node.b.id === id) return {dir: node.dir, first: false};
    return sideOf(node.a, id) || sideOf(node.b, id);
}

function folded(tree, id) {
    const box = measure(tree).rects[id];
    const side = sideOf(tree, id);
    if (!side) return box;
    if (side.dir === "row") return {...box, x: side.first ? box.x : box.x + box.w, w: 0};
    return {...box, y: side.first ? box.y : box.y + box.h, h: 0};
}

export const centre = (box) => ({x: box.x + box.w / 2, y: box.y + box.h / 2, w: 0, h: 0});

const EDGES = {
    right: (box) => ({...box, x: box.x + box.w, w: 0}),
    left: (box) => ({...box, w: 0}),
    bottom: (box) => ({...box, y: box.y + box.h, h: 0}),
    top: (box) => ({...box, h: 0}),
};

function wrapped(node, added, zone) {
    const dir = zone === "left" || zone === "right" ? "row" : "col";
    const first = zone === "left" || zone === "top";
    return split(dir, 0.5, first ? added : node, first ? node : added);
}

export function holding(layout, view) {
    return leaves(layout.tree).find((id) => layout.panes[id] && layout.panes[id].tabs.includes(view)) ?? null;
}

export function docked(layout) {
    return new Set(leaves(layout.tree).flatMap((id) => (layout.panes[id] ? layout.panes[id].tabs : [])));
}

const floating = (layout) => layout.floats || [];
const elsewhere = (layout) => layout.away || [];

export function opened(layout) {
    return new Set([...docked(layout), ...floating(layout).map((f) => f.view), ...elsewhere(layout).map((f) => f.view)]);
}

export function valid(layout) {
    if (!layout || !layout.tree || !layout.panes || !Number.isInteger(layout.next)) return false;
    const ids = leaves(layout.tree);
    const views = ids.flatMap((id) => (layout.panes[id] ? layout.panes[id].tabs : [null]));
    const loose = [...floating(layout), ...elsewhere(layout)].map((f) => f.view);
    return [...views, ...loose].every((v) => VIEWS.includes(v)) && new Set(views).size === views.length;
}

const kept = (layout, tree, panes, next) => ({
    tree,
    panes,
    next,
    floats: [...floating(layout)],
    away: [...elsewhere(layout)],
    scheme: layout.scheme || "",
});

function draft(layout) {
    const panes = Object.fromEntries(Object.entries(layout.panes).map(([id, p]) => [id, {...p, tabs: [...p.tabs]}]));
    return {layout: kept(layout, layout.tree, panes, layout.next), born: {}, dying: {}};
}

export function floated(layout, view, box) {
    const next = kept(layout, layout.tree, layout.panes, layout.next + 1);
    next.floats.push({id: layout.next, view, ...box});
    return next;
}

export function unfloated(layout, id) {
    return {...kept(layout, layout.tree, layout.panes, layout.next), floats: floating(layout).filter((f) => f.id !== id)};
}

export function fronted(layout, id) {
    const f = floating(layout).find((x) => x.id === id);
    return f ? {...unfloated(layout, id), floats: [...floating(layout).filter((x) => x.id !== id), f]} : layout;
}

export const widthOf = (pane) => (pane && pane.width) || FULL;

export const schemed = (layout, scheme) => ({...kept(layout, layout.tree, layout.panes, layout.next), scheme});

export function tuned(layout, id, patch) {
    const change = draft(layout);
    if (change.layout.panes[id]) Object.assign(change.layout.panes[id], patch);
    return change.layout;
}

export function ordered(layout, id, view, before) {
    const pane = layout.panes[id];
    if (!pane || !pane.tabs.includes(view)) return layout;
    const rest = pane.tabs.filter((v) => v !== view);
    const at = rest.indexOf(before);
    rest.splice(at < 0 ? rest.length : at, 0, view);
    return tuned(layout, id, {tabs: rest, active: view});
}

export function reshaped(layout, id, box) {
    return {
        ...kept(layout, layout.tree, layout.panes, layout.next),
        floats: floating(layout).map((f) => (f.id === id ? {...f, ...box} : f)),
    };
}

export function sentAway(layout, id) {
    const f = floating(layout).find((x) => x.id === id);
    if (!f) return layout;
    const next = unfloated(layout, id);
    next.away = [...elsewhere(layout).filter((x) => x.id !== id), f];
    return next;
}

export function broughtBack(layout, id) {
    const f = elsewhere(layout).find((x) => x.id === id);
    if (!f) return layout;
    const next = kept(layout, layout.tree, layout.panes, layout.next);
    next.away = elsewhere(layout).filter((x) => x.id !== id);
    next.floats.push(f);
    return next;
}

export function forgotten(layout, id) {
    return {...kept(layout, layout.tree, layout.panes, layout.next), away: elsewhere(layout).filter((x) => x.id !== id)};
}

function appended(layout, view) {
    const change = draft(layout);
    const id = change.layout.next++;
    change.layout.panes[id] = {tabs: [view], active: view};
    change.layout.tree = split("row", 0.7, layout.tree, leaf(id));
    change.born[id] = EDGES.right(WHOLE);
    return change;
}

export function landed(layout, id) {
    const f = floating(layout).find((x) => x.id === id);
    if (!f) return null;
    const at = holding(layout, f.view);
    const ids = leaves(layout.tree);
    const lone = ids.length === 1 && !layout.panes[ids[0]].tabs.length ? ids[0] : null;
    const change =
        at !== null ? activated(layout, at, f.view) : lone !== null ? placed(layout, f.view, lone, "center") : appended(layout, f.view);
    change.target = at ?? lone ?? change.layout.next - 1;
    return change;
}

function takeOut(change, id, view) {
    const {layout} = change;
    const pane = layout.panes[id];
    const at = pane.tabs.indexOf(view);
    if (at < 0) return;
    pane.tabs.splice(at, 1);
    if (pane.active === view) pane.active = pane.tabs[Math.max(0, at - 1)] || null;
    if (pane.tabs.length || leaves(layout.tree).length < 2) return;
    change.dying[id] = {rect: folded(layout.tree, id), pane: {tabs: [view], active: view}};
    layout.tree = without(layout.tree, id);
    delete layout.panes[id];
}

export function placed(layout, view, target, zone, from = null) {
    const change = draft(layout);
    const source = from ?? holding(layout, view);
    if (source === target && (zone === "center" || layout.panes[source].tabs.length === 1)) return null;
    const before = measure(layout.tree).rects[target];
    if (source !== null) takeOut(change, source, view);
    const pane = change.layout.panes[target];
    if (!pane) return null;
    if (zone === "center" || !pane.tabs.length) {
        pane.tabs.push(view);
        pane.active = view;
        return change;
    }
    const id = change.layout.next++;
    change.layout.panes[id] = {tabs: [view], active: view};
    change.born[id] = EDGES[zone](before);
    change.layout.tree = replaced(change.layout.tree, target, (node) => wrapped(node, leaf(id), zone));
    return change;
}

export function tabClosed(layout, id, view) {
    const change = draft(layout);
    takeOut(change, id, view);
    return change;
}

export function paneClosed(layout, id) {
    const change = draft(layout);
    if (leaves(layout.tree).length < 2) {
        change.layout.panes[id] = {tabs: [], active: null};
        return change;
    }
    change.dying[id] = {rect: folded(layout.tree, id), pane: layout.panes[id]};
    change.layout.tree = without(layout.tree, id);
    delete change.layout.panes[id];
    return change;
}

export function arranged(layout, shape) {
    const change = {layout: kept(layout, null, {}, layout.next), born: {}, dying: {}};
    const alive = leaves(layout.tree);
    const used = new Set();
    const added = [];
    const build = (node) => {
        if (node.dir) return split(node.dir, node.r, build(node.a), build(node.b));
        let id = alive.find((a) => !used.has(a) && layout.panes[a] && layout.panes[a].tabs.includes(node.active));
        if (id === undefined) {
            id = change.layout.next++;
            added.push(id);
        } else used.add(id);
        change.layout.panes[id] = {...(layout.panes[id] || {}), ...node, tabs: [...node.tabs], width: node.width || FULL};
        return leaf(id);
    };
    change.layout.tree = build(shape);
    const before = measure(layout.tree).rects;
    const after = measure(change.layout.tree).rects;
    added.forEach((id) => (change.born[id] = centre(after[id])));
    alive.filter((id) => !used.has(id)).forEach((id) => (change.dying[id] = {rect: centre(before[id]), pane: layout.panes[id]}));
    return change;
}

export function activated(layout, id, view) {
    const change = draft(layout);
    change.layout.panes[id].active = view;
    return change;
}

export function aimAt(layout, area, x, y, from) {
    const {rects} = measure(layout.tree);
    for (const id of leaves(layout.tree)) {
        const r = rects[id];
        const box = {
            left: area.left + r.x * area.width,
            top: area.top + r.y * area.height,
            width: r.w * area.width,
            height: r.h * area.height,
        };
        if (x < box.left || x > box.left + box.width || y < box.top || y > box.top + box.height) continue;
        const pane = layout.panes[id];
        const zone = zoneAt(box, x, y, pane.tabs.length > 0);
        if (from === id && (zone === "center" || pane.tabs.length === 1)) return null;
        return {id, zone};
    }
    return null;
}

function zoneAt(box, x, y, filled) {
    if (y - box.top <= HEADER || !filled) return "center";
    const across = (x - box.left) / box.width;
    const down = (y - box.top - HEADER) / Math.max(1, box.height - HEADER);
    const near = {left: across, right: 1 - across, top: down, bottom: 1 - down};
    const [side, gap] = Object.entries(near).sort((m, n) => m[1] - n[1])[0];
    return gap < EDGE_BAND ? side : "center";
}

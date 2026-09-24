import {follow} from "../composables/pointer.js";
import {store} from "../state/store.js";

export function tellExtension(kind, extra = {}) {
    window.postMessage({source: "journal-page", kind, ...extra}, window.location.origin);
}

export function tellShell(op, extra = {}) {
    window.parent.postMessage({source: "journal-page", kind: "shell", op, ...extra}, "*");
}

export function dragShell(e) {
    if (e.button || e.target.closest("button, .shell-menu")) return;
    e.preventDefault();
    tellShell("drag", {sx: e.screenX, sy: e.screenY});
    follow(
        e,
        (ev) => tellShell("dragmove", {sx: ev.screenX, sy: ev.screenY}),
        () => tellShell("dragend")
    );
}

const docks = new Set();
const without = (id) => store.extension.held.filter((x) => x !== id);

function dockAll(ids) {
    if (!ids.length) return;
    docks.forEach((dock) => ids.forEach(dock));
    tellExtension("docked", {ids});
}

function answered(e) {
    if (e.source !== window || e.origin !== window.location.origin || !e.data || e.data.source !== "journal-extension") return;
    const {kind, id} = e.data;
    if (kind === "here") {
        store.extension.here = true;
        store.extension.held = e.data.held || [];
        dockAll(e.data.docking || []);
    }
    if (kind === "holding") store.extension.held = e.data.held || [];
    if (kind === "failed") store.extension.held = without(id);
    if (kind === "released" && store.extension.held.includes(id)) {
        store.extension.held = without(id);
        dockAll([id]);
    }
}

window.addEventListener("message", answered);
tellExtension("hello");

export function whenPutBack(dock) {
    docks.add(dock);
}

export function hand(f, env) {
    store.extension.held = [...without(f.id), f.id];
    tellExtension("hold", {id: f.id, view: f.view, env, box: {x: f.x, y: f.y, w: f.w, h: f.h}});
}

export function takeBack(id) {
    store.extension.held = without(id);
    if (store.extension.here) tellExtension("release", {id});
}

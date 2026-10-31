import {expect, test} from "vitest";
import {loadMarkDeclarations, markDeclaration} from "../src/domain/markRegistry.js";
import {markLook} from "../src/domain/markLook.js";

const memory = {type: "memory", family_icon: "fact", mark_icon: "fact", group: "reminders", colouring: "group", click: "open row", process: false};
const check = {type: "check", family_icon: "check", mark_icon: "check", group: "agent", colouring: "outcome", click: "unfold", process: true};

test("the registry finds a declaration by its type", () => {
    loadMarkDeclarations([memory, check]);
    expect(markDeclaration("check")).toBe(check);
    expect(markDeclaration("gone")).toBe(null);
});

test("a mark takes its icon, group and words from its row and declaration", () => {
    const look = markLook({id: 4, text: "Memory 3: weight set", detail: "d", state: "shown", created_at: 9, target_model: "memory", target_id: 3}, memory);
    expect(look).toMatchObject({key: "chat_mark:4", icon: "fact", markIcon: "fact", group: "reminders", tone: "", label: "Memory 3: weight set", detail: "d", time: 9, ended: false});
    expect(look.action).not.toBe("");
    expect(typeof look.handlers.onAct).toBe("function");
});

test("an outcome-coloured family tones the mark by its outcome, and a process mark is active while shown", () => {
    expect(markLook({id: 1, text: "x", outcome: "failed", state: "shown"}, check)).toMatchObject({tone: "danger", active: true, action: "", handlers: {}});
    expect(markLook({id: 1, text: "x", outcome: "passed", state: "ended"}, check)).toMatchObject({tone: "good", active: false, ended: true});
});

import {vi} from "vitest";
import {go, peekRef} from "../src/route.js";

vi.mock("../src/route.js", () => ({go: vi.fn(), peekRef: vi.fn()}));

test("a click on an open-row mark opens its row, on an open-page mark the page its row names, and on the others does nothing of its own", () => {
    const row = {id: 1, text: "x", target_model: "tasks", target_id: 8};
    markLook(row, {click: "open row"}).handlers.onAct();
    expect(peekRef).toHaveBeenCalledWith("tasks:8");
    markLook({...row, target_model: "search", target_id: 0}, {click: "open page"}).handlers.onAct();
    expect(go).toHaveBeenCalledWith("search", 0);
    expect(markLook(row, {click: "unfold"})).toMatchObject({action: "", handlers: {}});
    expect(markLook(row, {click: "nothing"})).toMatchObject({action: "", handlers: {}});
    expect(markLook(row, {click: "open row"}).action).toBe("Open the task");
});

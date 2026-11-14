import {expect, test} from "vitest";
import {PANEL_ACTIONS, dockLook} from "../src/domain/dockLook.js";

const ITEM = {id: 4, type: "sample.card", target_model: "doc", target_id: 3};
const DECLARATION = {icon: "docs", title: "Example", reads: ["doc show"], buttons: [], leaves_after_seconds: 5};

test("keep, open and dismiss are icon-only by action", () => {
    const look = dockLook(ITEM, DECLARATION);
    expect(look.controls.map((button) => [button.action, button.label])).toEqual([["keep", "Keep this card"], ["open", "Open in the inspector"], ["undock", "Dismiss this card"]]);
    expect(look.controls.every((button) => PANEL_ACTIONS.includes(button.action))).toBe(true);
    expect(look.actions).toEqual([]);
});

test("a module button with the close icon stays a text button", () => {
    const stop = {icon: "close", label: "Stop watching", runs: "process unwatch {row_id}"};
    const look = dockLook(ITEM, {...DECLARATION, buttons: [stop]});
    expect(look.actions.map((button) => button.label)).toEqual(["Stop watching"]);
    expect(look.controls.map((button) => button.label)).not.toContain("Stop watching");
});

test("open is absent when the head is drawn by the module or the row has no inspector", () => {
    expect(dockLook(ITEM, {...DECLARATION, draws_head: true}).controls.map((button) => button.action)).toEqual(["keep", "undock"]);
    expect(dockLook({...ITEM, target_model: "nothing"}, {...DECLARATION, reads: []}).controls.map((button) => button.action)).not.toContain("open");
});

test("a kept card shows the pressed pin that lets it close", () => {
    const pin = dockLook({...ITEM, kept: true}, DECLARATION).controls[0];
    expect(pin).toMatchObject({action: "unkeep", label: "Let this card close", pressed: true});
});

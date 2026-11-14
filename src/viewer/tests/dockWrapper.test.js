import {expect, test} from "vitest";
import {dockLook, shownTitle} from "../src/domain/dockLook.js";

const dockButtons = (item, declaration) => dockLook(item, declaration).buttons;
const dockTitle = (item, declaration) => dockLook(item, declaration).title;

const declaration = {icon: "fact", title: "Memory {row_id}: {row_title}", buttons: [{icon: "x", label: "Weigh", runs: "memory weigh {row_id}"}]};
const item = {id: 5, type: "memory", target_model: "memories", target_id: 3, kept: false, leaves_at: null, row_title: "Use tabs"};

test("the title fills {row_id} and {row_title}", () => {
    expect(dockTitle(item, declaration)).toBe("Memory 3: Use tabs");
    expect(dockLook(item, declaration).icon).toBe("fact");
});

test("an item always has undock, and the declaration's own buttons after open", () => {
    const actions = dockButtons(item, declaration).map((b) => b.action);
    expect(actions).toEqual(["declared", "open", "undock"]);
    expect(dockButtons(item, declaration).at(-1).runs).toBe("dock remove 5");
});

test("keep shows only while the item would leave by itself, and open only for a row with an inspector", () => {
    expect(dockButtons({...item, leaves_at: 99}, declaration)[0]).toMatchObject({action: "keep", runs: "dock keep 5"});
    expect(dockButtons({...item, leaves_at: 99, kept: true}, declaration).map((b) => b.action)).not.toContain("keep");
    expect(dockButtons({...item, target_model: "nothing"}, declaration).map((b) => b.action)).not.toContain("open");
});

test("a card that draws its own head has no Open, its arrow unfolds it", () => {
    const actions = dockButtons({id: 5, target_model: "processes", target_id: 1}, {reads: ["process show"], draws_head: true, buttons: []}).map((b) => b.action);
    expect(actions).toEqual(["undock"]);
});

test("a card that leaves by itself has a pin that keeps it, and once kept an unpin that lets it leave", () => {
    const leaving = {reads: ["process show"], draws_head: true, buttons: [], leaves_after_seconds: 5};
    const running = {id: 5, target_model: "processes", target_id: 1, kept: false, leaves_at: null};
    expect(dockButtons(running, leaving).map((b) => b.action)).toEqual(["keep", "undock"]);
    expect(dockButtons(running, leaving)[0]).toMatchObject({label: "Keep this card", runs: "dock keep 5"});
    expect(dockButtons({...running, kept: true}, leaving)[0]).toMatchObject({action: "unkeep", label: "Let this card close", runs: "dock unkeep 5"});
    expect(dockButtons(running, {...leaving, leaves_after_seconds: 0}).map((b) => b.action)).toEqual(["undock"]);
});

test("a run's folded card is named by what it runs, never Output and its number", () => {
    const run = {id: 5, type: "processes.output", target_model: "processes", target_id: 154783, title: "Output 154783"};
    const declaration = {title: "Output {row_id}", draws_head: true, reads: ["process card"], buttons: []};
    expect(shownTitle(run, declaration, {title: "Running Python tests"})).toBe("Running Python tests");
    expect(shownTitle(run, declaration, undefined)).toBe("Output 154783");
    expect(shownTitle({...run, title: ""}, {title: "Plan {row_id}", buttons: []}, {title: "Another"})).toBe("Plan 154783");
});

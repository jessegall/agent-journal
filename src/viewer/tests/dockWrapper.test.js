import {expect, test} from "vitest";
import {dockButtons, dockLook, dockTitle} from "../src/domain/dockLook.js";

const declaration = {icon: "fact", title: "Memory {row_id}: {row_title}", buttons: [{icon: "x", label: "Weigh", runs: "memory weigh {row_id}"}]};
const item = {id: 5, type: "memory", target_model: "memories", target_id: 3, kept: false, leaves_at: null, row_title: "Use tabs"};

test("the title fills {row_id} and {row_title}", () => {
    expect(dockTitle(item, declaration)).toBe("Memory 3: Use tabs");
    expect(dockLook(item, declaration).icon).toBe("fact");
});

test("an item always has undock, and the declaration's own buttons after open", () => {
    const actions = dockButtons(item, declaration).map((b) => b.action);
    expect(actions).toEqual(["open", "declared", "undock"]);
    expect(dockButtons(item, declaration).at(-1).runs).toBe("dock remove 5");
});

test("keep shows only while the item would leave by itself, and open only for a row with an inspector", () => {
    expect(dockButtons({...item, leaves_at: 99}, declaration)[0]).toMatchObject({action: "keep", runs: "dock keep 5"});
    expect(dockButtons({...item, leaves_at: 99, kept: true}, declaration).map((b) => b.action)).not.toContain("keep");
    expect(dockButtons({...item, target_model: "nothing"}, declaration).map((b) => b.action)).not.toContain("open");
});

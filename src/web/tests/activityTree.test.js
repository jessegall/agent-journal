// @vitest-environment node
import {expect, test} from "vitest";
import {ref} from "vue";

const {useActivity} = await import("../src/composables/activity.js");

const NOW = 1_700_000_000;
const nothing = () => ({data: {}, title: ""});
const event = (id, at, data = {}, type = "agent") => ({id, at, type, action: "updated", actor: "agent", n: 1, data});
const rowsOf = (events) => useActivity(ref(events), nothing).items.value;

test("events the engine caused fold into the one that caused them", () => {
    const tick = "lane:1:TurnEnded";
    const items = rowsOf([event("a", NOW, {cause: tick}), event("b", NOW + 1, {cause: tick}), event("c", NOW + 2, {cause: tick})]);
    expect(items.length).toBe(1);
    expect(items[0].fold.events.length).toBe(3);
    expect(items[0].fold.cause).toBe(tick);
});

test("two causes are two trees, however close together they happen", () => {
    const items = rowsOf([event("a", NOW, {cause: "lane:1:One"}), event("b", NOW, {cause: "lane:2:Two"})]);
    expect(items.map((i) => i.fold.cause)).toEqual(["lane:2:Two", "lane:1:One"]);
});

test("a cause naming only the actor says nothing, so those events fold by the minute as before", () => {
    const items = rowsOf([event("a", NOW, {cause: "agent"}), event("b", NOW + 1, {cause: "agent"})]);
    expect(items.length).toBe(1);
    expect(items[0].fold.cause).toBe(undefined);
    expect(items[0].fold.minute).toBe(Math.floor((NOW + 1) / 60));
});

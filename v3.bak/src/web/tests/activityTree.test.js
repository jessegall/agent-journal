// @vitest-environment node
import {expect, test} from "vitest";
import {ref} from "vue";

const {useActivity} = await import("../src/composables/activity.js");

const NOW = 1_700_000_000;
const nothing = () => ({data: {}, title: ""});
const event = (id, at, data = {}, type = "agent") => ({id, at, type, action: "updated", actor: "agent", n: 1, data});
const rowsOf = (events) => useActivity(ref(events), nothing).items.value;

test("events the engine caused fold into the one that caused them", () => {
    const tick = "project:1:0:TurnEnded";
    const items = rowsOf([event("a", NOW, {caused_by: tick}), event("b", NOW + 1, {caused_by: tick}), event("c", NOW + 2, {caused_by: tick})]);
    expect(items.length).toBe(1);
    expect(items[0].fold.events.length).toBe(3);
    expect(items[0].fold.cause).toBe(tick);
});

test("two causes are two trees, however close together they happen", () => {
    const items = rowsOf([event("a", NOW, {caused_by: "project:1:0:One"}), event("b", NOW, {caused_by: "project:2:0:Two"})]);
    expect(items.map((i) => i.fold.cause)).toEqual(["project:2:0:Two", "project:1:0:One"]);
});

test("an event the engine never named says nothing, so those fold by the minute as before", () => {
    const items = rowsOf([event("a", NOW, {cause: "agent"}), event("b", NOW + 1, {cause: "agent"})]);
    expect(items.length).toBe(1);
    expect(items[0].fold.cause).toBe(undefined);
    expect(items[0].fold.minute).toBe(Math.floor((NOW + 1) / 60));
});

test("a failed tick shows in the chain it belongs to, in the tone its notice carries", () => {
    const tick = "project:7:0:OldEvent";
    const failed = {...event("c", NOW + 2, {caused_by: tick}, "notification"), action: "created", n: 4};
    const notices = (ref_) => (ref_ === "notification:4" ? {data: {kind: "activity", tone: "danger"}, title: "A tick on OldEvent failed"} : {data: {}, title: ""});
    const {items, tone} = useActivity(
        ref([event("a", NOW, {caused_by: tick}), event("b", NOW + 1, {caused_by: tick}), failed]),
        notices
    );
    expect(items.value.length).toBe(1);
    expect(items.value[0].fold.events.length).toBe(3);
    expect(tone(failed)).toBe("danger");
});

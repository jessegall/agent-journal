import {expect, test, vi} from "vitest";
import {h, provide, ref} from "vue";
import {provideDockCard} from "@journal/window-kit";
import {eventAboutRows, eventChildOf} from "../kit/eventRows.js";
import {context, mountedDock, settle} from "./support/windowContext.js";
import DumpDock from "../../core/modules/dumps/web/src/DumpDock.vue";
import PlanDock from "../../core/modules/plans/web/src/PlanDock.vue";

const OUTLINE = {agents: [{id: 12, name: "Lady Lovelace"}], phases: [{id: 1, title: "Build", tasks: [{id: 7}]}]};

async function dockHearing(component, data) {
    const reload = vi.fn(async () => {});
    const window = context({});
    let heard;
    window.follow = (patterns, listener) => {
        heard = listener;
    };
    await mountedDock({setup() {
        provideDockCard(provide, {data: ref(data), reload});
        return () => h(component);
    }}, window, {target_id: 5});
    return {reload, heard};
}

test("an event about a row of another plan makes the plan dock read nothing", async () => {
    const {reload, heard} = await dockHearing(PlanDock, OUTLINE);
    heard({event: "task.change", row_id: 99, changed_ids: {}});
    heard({event: "agent.change", row_id: 98, changed_ids: {}});
    heard({event: "phase.change", row_id: 97, changed_ids: {plan_id: [8]}});
    heard({event: "phase_task.create", row_id: 96, changed_ids: {phase_id: [50]}});
    await settle();
    expect(reload).not.toHaveBeenCalled();
});

test.each([
    ["its task", {event: "task.change", row_id: 7, changed_ids: {}}],
    ["its agent", {event: "agent.change", row_id: 12, changed_ids: {}}],
    ["its phase", {event: "phase.change", row_id: 1, changed_ids: {}}],
    ["a new phase of it", {event: "phase.create", row_id: 40, changed_ids: {plan_id: [5]}}],
    ["a task placed in its phase", {event: "phase_task.create", row_id: 41, changed_ids: {phase_id: [1]}}],
])("an event about %s reloads the plan dock", async (_, event) => {
    const {reload, heard} = await dockHearing(PlanDock, OUTLINE);
    heard(event);
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
});

test("the dump dock reads only for its own items", async () => {
    const {reload, heard} = await dockHearing(DumpDock, [{id: 2}]);
    heard({event: "dump_item.create", row_id: 30, changed_ids: {dump_id: [9]}});
    heard({event: "dump_item.change", row_id: 31, changed_ids: {}});
    await settle();
    expect(reload).not.toHaveBeenCalled();
    heard({event: "dump_item.change", row_id: 2, changed_ids: {}});
    heard({event: "dump_item.create", row_id: 32, changed_ids: {dump_id: [5]}});
    expect(reload).toHaveBeenCalledTimes(2);
});

test("a window shown again hears an event with no row, and that names every row", () => {
    expect(eventAboutRows({event: "refresh"}, new Set([1]))).toBe(true);
    expect(eventChildOf({event: "refresh"}, "dump_id", new Set([1]))).toBe(true);
    expect(eventAboutRows({event: "task.change", row_id: 2}, new Set([1]))).toBe(false);
    expect(eventChildOf({event: "dump_item.change", row_id: 2}, "dump_id", new Set([1]))).toBe(false);
});

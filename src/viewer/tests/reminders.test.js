import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import ReminderRows from "../../core/modules/reminders/web/src/ReminderRows.vue";

test("a reminder shows when it comes, and a new one is made from the form", async () => {
    const ran = [];
    const window = context({}, null, {reminders: {line: "reminder list", events: ["reminder.*"]}});
    window.read = async () => ({ok: true, value: {rows: [{id: 2, text: "Stretch", interval_seconds: 600, interval_tool_uses: 0, interval_tasks: 0, single_use: true}]}});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(ReminderRows, window);
    await settle();
    expect(element.querySelector("[data-reminder='2']").textContent).toContain("Every 10 minutes, once");
    const form = element.querySelector("[data-reminder-form]");
    const [text, , minutes] = form.querySelectorAll("input");
    text.value = "Read the review";
    text.dispatchEvent(new Event("input"));
    minutes.value = "5";
    minutes.dispatchEvent(new Event("input"));
    await settle();
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(ran).toContainEqual(["reminder", "make", "Read the review", "--every-minutes", "5"]);
});

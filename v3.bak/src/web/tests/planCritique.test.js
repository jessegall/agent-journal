import {expect, test, vi} from "vitest";
import {createApp, h, nextTick} from "vue";

const settle = async () => {
    for (let i = 0; i < 4; i++) await nextTick();
};

test("the critique dialog says when its templates did not load, and a retry shows them", async () => {
    const {api} = await import("../src/api/client.js");
    const missing = {n: 8, title: "Find what is missing", brief: "Read the plan against its goal.", data: {purpose: "critique"}, completed: 0, deleted: 0};
    api.all = vi.fn().mockRejectedValueOnce(new Error("the journal did not answer")).mockResolvedValue([missing]);
    const {default: PlanCritique} = await import("../src/resource/PlanCritique.vue");
    const host = document.createElement("div");
    document.body.append(host);
    createApp({render: () => h(PlanCritique, {plan: {n: 35, title: "Rows move into SQLite", ref: "plan:35"}})}).mount(host);
    await settle();
    const text = () => document.body.textContent;
    expect(text()).toContain("The templates did not load.");
    expect(text()).not.toContain("Find what is missing");
    [...document.body.querySelectorAll("button")].find((b) => b.textContent.trim() === "Try again").click();
    await settle();
    expect(text()).toContain("Find what is missing");
    expect(text()).not.toContain("The templates did not load.");
});

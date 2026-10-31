import {expect, test} from "vitest";
import {settled} from "./settled.js";
import SequenceCards from "../../core/modules/sequences/web/src/SequenceCards.vue";
import TemplateCards from "../../core/modules/templates/web/src/TemplateCards.vue";
import {mounted} from "./mountedWindow.js";

test("a sequence card shows its number, title and step count, and its steps once opened", async () => {
    const element = mounted(SequenceCards, [{id: 1, title: "Release steps", steps: ["Run the suite", "Tag it"]}]);
    await settled();
    const card = element.querySelector('[data-row="1"]');
    expect(card.textContent).toContain("Sequence 1");
    expect(card.textContent).toContain("Release steps");
    expect(card.textContent).toContain("2 steps");
    expect(card.textContent).not.toContain("Tag it");
    card.click();
    await settled();
    expect(card.textContent).toContain("Tag it");
});

test("a template card shows what it applies to and its purpose, and its parts once opened", async () => {
    const element = mounted(TemplateCards, [{id: 1, title: "Find what is missing", brief: "Read the plan", targets: ["plan"], purpose: "critique", parts: ["Gaps: what is left out"], commands: []}]);
    await settled();
    const card = element.querySelector('[data-row="1"]');
    expect(card.textContent).toContain("For plan · critique");
    card.click();
    await settled();
    expect(card.textContent).toContain("Gaps: what is left out");
});

import {expect, test} from "vitest";
import {settled} from "./settled.js";
import SequenceCards from "../../core/modules/sequences/web/src/SequenceCards.vue";
import TemplateCards from "../../core/modules/templates/web/src/TemplateCards.vue";
import {mounted} from "./mountedWindow.js";
import {mounted as mountedWindow, page} from "./support/windowContext.js";
import {templateWindowContext} from "./support/templateWindowContext.js";

test("a sequence card shows its number, title and step count, and its steps once opened", async () => {
    const element = mounted(SequenceCards, [{id: 1, title: "Release steps", steps: ["Run the suite", "Tag it"]}]);
    await settled();
    const card = element.querySelector('[data-row="1"]');
    expect(card.textContent).toContain("1 Release steps");
    expect(card.textContent).toContain("2 steps");
    expect(card.textContent).not.toContain("Tag it");
    card.click();
    await settled();
    expect(element.textContent + document.body.textContent).toContain("Tag it");
});

test("a template card shows its number, title and description, and what it applies to, its purpose and its parts once opened", async () => {
    const element = await mountedWindow(TemplateCards, templateWindowContext({"template list": page([{id: 1, title: "Find what is missing", brief: "Read the plan", targets: ["plan"], purpose: "critique", parts: ["Gaps: what is left out"], commands: []}])}));
    await settled();
    const card = element.querySelector('[data-row="1"]');
    expect(card.textContent).toContain("1 Find what is missing");
    expect(card.textContent).toContain("Read the plan");
    card.click();
    await settled();
    expect(element.textContent).toContain("Gaps what is left out");
});

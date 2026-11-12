import {expect, test} from "vitest";
import TemplateCards from "../../core/modules/templates/web/src/TemplateCards.vue";
import {mounted, page} from "./support/windowContext.js";
import {templateWindowContext as context} from "./support/templateWindowContext.js";

test("cards distinguish a module's template from a user's template with the same title", async () => {
    const template = {title: "Security review", brief: "Check access", targets: ["plan"], purpose: "critique", parts: [], commands: []};
    const element = await mounted(TemplateCards, context({"template list": page([
        {...template, id: 1, module: "acme.review"},
        {...template, id: 2, module: ""},
    ])}));
    expect(element.querySelector('[data-row="1"]').textContent).toContain("Module: acme.review");
    expect(element.querySelector('[data-row="2"]').textContent).toContain("Written by a user");
    expect(element.querySelectorAll(".card-title")).toHaveLength(2);
});

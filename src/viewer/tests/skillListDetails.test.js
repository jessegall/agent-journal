import {expect, test} from "vitest";
import {mounted, page} from "./support/windowContext.js";
import {skillWindowContext} from "./support/skillWindowContext.js";
import SkillListItem from "../../core/modules/skills/web/src/SkillListItem.vue";
import SkillDetails from "../../core/modules/skills/web/src/SkillDetails.vue";

const skill = (groups) => ({folder: "journal-workers", description: "Workers", groups, keywords: [], commands: [], events: [], required: false, read: false});
const item = (groups) => mounted(SkillListItem, skillWindowContext({}), {skill: skill(groups)});
const details = () => mounted(SkillDetails, skillWindowContext({"skill list": page([])}), {skill: skill([]), text: {text: "---\nname: journal-workers\n---\n\n# Workers\n\nA **worker** writes."}, triggers: [], skills: []});

test("a skill in the sidebar shows a badge for each agent group that has it", async () => {
    const element = await item(["Workers", "Merger"]);
    expect([...element.querySelectorAll("[data-skill-groups] .group")].map((badge) => badge.textContent)).toEqual(["Workers", "Merger"]);
});

test("a skill no agent group has is shown as the main agent's", async () => {
    const element = await item([]);
    expect(element.querySelector("[data-skill-groups]").textContent).toBe("Main agent");
});

test("the skill reader draws its text as Markdown", async () => {
    const element = await details();
    const text = element.querySelector("[data-skill-text]");
    expect(text.querySelector("strong").textContent).toBe("worker");
    expect(text.textContent).not.toContain("**");
    expect(text.textContent).not.toContain("name: journal-workers");
});

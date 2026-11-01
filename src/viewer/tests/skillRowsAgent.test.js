import {expect, test} from "vitest";
import {context, mounted, page} from "./support/windowContext.js";
import SkillRows from "../../core/modules/skills/web/src/SkillRows.vue";

test("the skills window on its own page reads all loaded skills, not an agent called null", async () => {
    const window = context({"agent-skill list": page([])});
    await mounted(SkillRows, window);
    expect(window.reads).toContain("agent-skill list");
});

test("the skills window of an agent reads that agent's", async () => {
    const window = context({"agent-skill list": page([])}, 12);
    await mounted(SkillRows, window);
    expect(window.reads).toContain("agent-skill list --agent 12");
});

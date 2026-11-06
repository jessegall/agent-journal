import {expect, test} from "vitest";
import {mounted, page, settle} from "./support/windowContext.js";
import {skillWindowContext} from "./support/skillWindowContext.js";
import SkillRows from "../../core/modules/skills/web/src/SkillRows.vue";

test("the skills page reads the main agent's loaded skills", async () => {
    const window = skillWindowContext({"agent main": {ok: true, value: {id: 12}}, "agent-skill list": page([]), "skill list": page([])});
    await mounted(SkillRows, window);
    await settle();
    expect(window.reads).toContain("agent-skill list --limit 1000 --agent 12");
});

test("the skills page does not read agent skills when no main agent is running", async () => {
    const window = skillWindowContext({"agent main": {ok: true, value: {id: null}}, "skill list": page([])});
    await mounted(SkillRows, window);
    expect(window.reads.some((line) => line.startsWith("agent-skill list"))).toBe(false);
});

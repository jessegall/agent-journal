from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story

GIT_FETCH_SAMPLE = HookSamples.shell("git fetch", ShellPart("git", CommandCategory.VERSION_CONTROL, ["fetch"]))
UPLOAD_SAMPLE = HookSamples.shell("git push", ShellPart("git", CommandCategory.VERSION_CONTROL, ["push"]))


def test_an_installed_plugin_publishes_its_skills_marked_with_its_name(new_story):
    story = installed_story(new_story)
    story.expect_text("skill list", "sample-rules", actor=story.user)
    skill = story.home.folder.parent / ".claude" / "skills" / "sample-rules" / "SKILL.md"
    story.expect_rows(skill.is_file() and "plugin: sample" in skill.read_text())


def test_a_skill_a_plugins_answer_requires_holds_the_agents_next_tool_after_the_reply_until_it_is_read(new_story):
    story = installed_story(new_story)
    story.container.bind(SkillRequirement, SkillRequirement())
    story.hook("s-1", UPLOAD_SAMPLE)
    story.run_listeners()
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "read this first")


def skill_digest(story, name):
    return next(skill.digest for skill in story.container.get(SkillCatalogue).skills() if skill.folder == name)


def mark_rules_loaded(story, digest):
    story.container.get(Bus).run(LoadSkill(story.agent.id, "sample-rules", digest), Actor.core(), environment_id=1)


def test_a_plugin_is_told_the_skills_the_agent_has_loaded(new_story):
    story = installed_story(new_story)
    mark_rules_loaded(story, skill_digest(story, "sample-rules"))
    story.expect_hook_allowed("s-1", GIT_FETCH_SAMPLE, "[plugin sample] the rules are loaded")


def test_a_skill_the_agent_has_not_loaded_is_not_listed(new_story):
    story = installed_story(new_story)
    story.expect_hook_allowed("s-1", GIT_FETCH_SAMPLE, "[plugin sample] the rules are not loaded")


def test_a_skill_read_in_an_older_text_is_not_listed(new_story):
    story = installed_story(new_story)
    mark_rules_loaded(story, "an-older-text")
    story.expect_hook_allowed("s-1", GIT_FETCH_SAMPLE, "[plugin sample] the rules are not loaded")


def test_a_switched_off_plugin_takes_its_skills_away(new_story):
    story = installed_story(new_story)
    story.run("plugin disable sample", actor=story.user)
    story.expect_absent("skill list", "sample-rules", actor=story.user)
    story.expect_rows(not (story.home.folder.parent / ".claude" / "skills" / "sample-rules").exists())


def test_a_plugin_skill_published_only_for_codex_is_known(new_story):
    story = installed_story(new_story)
    codex_skill = story.home.folder.parent / ".agents" / "skills" / "codex-rules" / "SKILL.md"
    codex_skill.parent.mkdir(parents=True, exist_ok=True)
    codex_skill.write_text("---\nplugin: sample\nname: codex-rules\ndescription: Rules only Codex reads\n---\n")
    story.expect_text("skill list", "codex-rules", actor=story.user)

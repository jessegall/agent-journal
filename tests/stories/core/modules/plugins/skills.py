from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story

UPLOAD_SAMPLE = HookSamples.shell("git push", ShellPart("git", CommandCategory.VERSION_CONTROL, ["push"]))


def test_an_installed_plugin_publishes_its_skills_marked_with_its_name(new_story):
    story = installed_story(new_story)
    story.expect_text("skill list", "sample-rules", actor=story.user)
    skill = story.home.folder.parent / ".claude" / "skills" / "sample-rules" / "SKILL.md"
    story.expect_rows(skill.is_file() and "plugin: sample" in skill.read_text())


def test_a_skill_a_plugins_answer_requires_holds_the_agents_next_tool_after_the_reply_until_it_is_read(new_story):
    story = installed_story(new_story)
    story.hook("s-1", UPLOAD_SAMPLE)
    story.run_listeners()
    story.expect_hook_refusal("s-1", LISTING_SAMPLE, "read sample-rules first")


def test_a_switched_off_plugin_takes_its_skills_away(new_story):
    story = installed_story(new_story)
    story.run("plugin disable sample", actor=story.user)
    story.expect_absent("skill list", "sample-rules", actor=story.user)
    story.expect_rows(not (story.home.folder.parent / ".claude" / "skills" / "sample-rules").exists())

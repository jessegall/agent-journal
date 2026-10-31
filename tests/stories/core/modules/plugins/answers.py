from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.hooks import installed_story

STATUS_SAMPLE = HookSamples.shell("git status", ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"]))
DIFF_SAMPLE = HookSamples.shell("git diff", ShellPart("git", CommandCategory.VERSION_CONTROL, ["diff"]))
LOG_SAMPLE = HookSamples.shell("git log", ShellPart("git", CommandCategory.VERSION_CONTROL, ["log"]))


def test_a_card_in_a_plugins_answer_shows_in_the_chat_after_the_reply_with_the_plugins_name(new_story):
    story = installed_story(new_story)
    story.hook("s-1", STATUS_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "sample: Branch is clean", actor=story.user)


def test_a_card_with_the_same_key_is_updated_in_place(new_story):
    story = installed_story(new_story)
    story.hook("s-1", STATUS_SAMPLE)
    story.run_listeners()
    story.hook("s-1", DIFF_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "sample: Branch has changes", actor=story.user)
    story.expect_absent("chat-mark list --environment 1", "sample: Branch is clean", actor=story.user)


def test_the_commands_in_a_plugins_answer_run_after_the_reply_as_the_plugins_module(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LOG_SAMPLE)
    story.run_listeners()
    story.expect_text("notice list --environment main", "Release notes", actor=story.user)

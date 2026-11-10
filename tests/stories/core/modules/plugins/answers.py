from engine.database.database import Database
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.hooks import installed_story

STATUS_SAMPLE = HookSamples.shell("git status", ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"]))
DIFF_SAMPLE = HookSamples.shell("git diff", ShellPart("git", CommandCategory.VERSION_CONTROL, ["diff"]))
JUDGE_SAMPLE = HookSamples.shell("git show", ShellPart("git", CommandCategory.VERSION_CONTROL, ["show"]))
CLEAN_SAMPLE = HookSamples.shell("git tag", ShellPart("git", CommandCategory.VERSION_CONTROL, ["tag"]))
LOG_SAMPLE = HookSamples.shell("git log", ShellPart("git", CommandCategory.VERSION_CONTROL, ["log"]))


def test_a_card_for_a_worker_stays_out_of_the_main_chat(new_story):
    story = installed_story(new_story)
    story.hook("s-1", STATUS_SAMPLE)
    story.container.get(Database).connection.execute("UPDATE agents SET role = 'worker' WHERE session = 's-1'")
    story.run_listeners()
    story.expect_absent("chat-mark list --environment 1", "sample: Branch is clean", actor=story.user)


def test_a_card_with_the_same_key_is_updated_in_place(new_story):
    story = installed_story(new_story)
    story.hook("s-1", STATUS_SAMPLE)
    story.run_listeners()
    story.hook("s-1", DIFF_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "sample: Branch has changes", actor=story.user)
    story.expect_absent("chat-mark list --environment 1", "sample: Branch is clean", actor=story.user)


def test_a_clean_card_after_a_warning_card_of_the_same_key_takes_the_clean_tone(new_story):
    story = installed_story(new_story)
    story.hook("s-1", DIFF_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --columns variant,text", "warn  sample: Branch has changes", actor=story.user)
    story.hook("s-1", STATUS_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --columns variant,text", "note  sample: Branch is clean", actor=story.user)
    story.expect_absent("chat-mark list --environment 1 --columns variant,text", "warn", actor=story.user)


def test_a_plugins_mark_never_ends_so_a_later_card_of_its_key_always_updates_it(new_story):
    story = installed_story(new_story)
    story.hook("s-1", DIFF_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --state shown", "sample: Branch has changes", actor=story.user)
    story.expect_absent("chat-mark list --environment 1 --state ended", "sample:", actor=story.user)


def test_a_plugins_command_shows_a_card_in_the_chat_of_the_agent_that_ran_it(new_story):
    story = installed_story(new_story)
    story.expect_success('plugin card sample --label "Lanes: 2 trees warm" --detail "main: warm since 23:10" --tone note', "card shown: 1", actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --columns text,detail", "sample: Lanes: 2 trees warm", "main: warm since 23:10", actor=story.user)


def test_an_agent_shows_a_card_in_no_other_agents_chat(new_story):
    story = installed_story(new_story)
    story.expect_refusal('plugin card sample --label "Lanes" --agent 1', "an agent may name only itself", actor=story.agent)

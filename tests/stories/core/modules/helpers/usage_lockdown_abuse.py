from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.helpers.usage_limits import report
from tests.stories.core.modules.helpers.usage_lockdown import STOP_LINE, hook_call_count, lockdown_story

SETTING_LINE = HookSamples.shell("journal setting set journal.core.developer.tools.read-limit false --project", ShellPart("journal", CommandCategory.EDIT, ["setting", "set"]))


def test_an_agent_cannot_delete_the_limit_and_a_second_delete_by_the_person_is_refused_as_missing(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    story.expect_refusal("usage-limit delete 1", "an agent cannot", actor=story.agent)
    story.expect_success("usage-limit delete 1", actor=story.user)
    story.expect_rows(story.run("usage-limit delete 1", actor=story.user).code != 0)


def test_a_stopped_agent_that_writes_a_setting_by_shell_is_stopped_before_any_rule_or_guard_is_asked(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    count = hook_call_count(story)
    reply = story.hook("s-1", SETTING_LINE)
    story.expect_rows(reply.halt.startswith(STOP_LINE), reply.refusal == "", hook_call_count(story) == count)

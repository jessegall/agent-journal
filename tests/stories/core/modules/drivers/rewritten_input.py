import shlex

from core.modules.processes.nudges.sleep_refusal_message import SleepRefusalMessage
from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_refusal_reply, expect_updated_input_reply

LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"], effects=[CommandEffect.READS_FILES]))
SLEEP = HookSamples.shell("sleep 60", ShellPart("sleep", CommandCategory.UNKNOWN, ["60"]))


def test_a_hook_sent_twice_is_answered_with_the_same_new_input(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    repeated_listing = LISTING.with_fields(firing="sent-twice")
    first = story.hook("s-1", repeated_listing)
    again = story.hook("s-1", repeated_listing)
    story.expect_rows("ls build" in str(first.updated_input), dict(again.updated_input) == dict(first.updated_input), detail=str((first.updated_input, again.updated_input)))


def test_a_refused_shell_line_of_a_program_that_prints_refusals_runs_as_a_line_that_prints_the_reason(new_story):
    story = new_story(fixture=BuilderStarted)
    reason = SleepRefusalMessage.declared().nudge().text
    reply = story.hook("s-1", SLEEP)
    expect_refusal_reply(reply, reason)
    expect_updated_input_reply(reply, {"command": f"printf '%s\\n' {shlex.quote(reason)}"})

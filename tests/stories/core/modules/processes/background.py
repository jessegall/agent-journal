from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

NOTHING = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
AFTER = NOTHING.with_fields(event="post_tool_use")
TESTS_REPORT = "collected 3 items\nFAILED tests/test_cart.py::test_total - assert 1 == 2\n2 failed, 1 passed in 0.4s\n"
ENDED = "output 1 ended: 2 failed 1 passed; journal output read 1 --summary"


def lines_of(story, sample) -> list[str]:
    return list(story.hook("s-1", sample).lines)


def test_the_end_of_a_background_run_tells_the_agent_once_with_the_readers_summary(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    assert ENDED in lines_of(story, NOTHING)
    assert ENDED not in lines_of(story, NOTHING)


def test_a_run_that_ended_in_the_foreground_is_not_told(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    ended_run(story, "pytest -q", TESTS_REPORT, exit_code=1)
    assert not any("ended" in line for line in lines_of(story, NOTHING))


def test_the_reminder_comes_every_5_tool_uses_while_the_output_is_not_read(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", NOTHING)
    reminders = [ENDED in lines_of(story, AFTER) for _ in range(10)]
    assert reminders == [False, False, False, False, True, False, False, False, False, True]


def test_reading_the_output_ends_the_reminders(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", NOTHING)
    story.run(f"output read {process.id} --summary", actor=story.agent)
    assert [ENDED in lines_of(story, AFTER) for _ in range(10)] == [False] * 10

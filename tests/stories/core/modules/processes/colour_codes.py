import pytest

from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
READ_NOTES = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
VITEST_RUN = "npm --prefix src/viewer run test"
VITEST_OUTPUT = "\x1b[1m\x1b[7m RUN \x1b[27m\x1b[22m v5.0.5\n\x1b[2m      Tests \x1b[22m \x1b[1m\x1b[32m12 passed\x1b[39m\x1b[22m\x1b[90m (12)\x1b[39m\n"
MARKS = "chat-mark list --environment 1 --oldest"


def ended(new_story, line: str, text: str, category: CommandCategory):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, line, category=category)
    end_run(story, process, text)
    story.advance(timedelta(seconds=1))
    return story, list(story.hook("s-1", READ_NOTES).lines)


def test_the_mark_of_a_run_and_its_output_read_by_the_agent_show_no_colour_code(ended_vitest):
    story, _ = ended_vitest
    story.run_listeners()
    story.expect_text(MARKS, "12 passed")
    story.expect_absent(MARKS, "\x1b")
    story.expect_text("output read 1 --all", "Tests  12 passed (12)", actor=story.agent)
    story.expect_absent("output read 1 --all --again", "\x1b", actor=story.agent)


@pytest.fixture
def ended_vitest(new_story):
    return ended(new_story, VITEST_RUN, VITEST_OUTPUT, CommandCategory.TEST_RUN)

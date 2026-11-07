import pytest

from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value_line, expect_value_with, expect_value_without_line

NOTHING = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
VITEST_RUN = "npm --prefix src/viewer run test"
VITEST_OUTPUT = "\x1b[1m\x1b[7m RUN \x1b[27m\x1b[22m v5.0.5\n\x1b[2m      Tests \x1b[22m \x1b[1m\x1b[32m12 passed\x1b[39m\x1b[22m\x1b[90m (12)\x1b[39m\n"
MARKS = "chat-mark list --environment 1 --oldest"


def ended(new_story, line: str, text: str, category: CommandCategory):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, line, category=category)
    end_run(story, process, text)
    story.advance(timedelta(seconds=1))
    return story, list(story.hook("s-1", NOTHING).lines)


def test_a_vitest_run_with_colour_codes_gives_its_counts_as_the_summary_with_no_escape(ended_vitest):
    story, lines = ended_vitest
    expect_value_with(lines, "output 1 ended: journal output read 1 --summary")
    story.expect_text("output read 1 --summary", "12 passed", actor=story.agent)
    expect_value_without_line(lines, "\x1b")


def test_the_mark_of_a_run_and_its_output_read_by_the_agent_show_no_colour_code(ended_vitest):
    story, _ = ended_vitest
    story.run_listeners()
    story.expect_text(MARKS, "12 passed")
    story.expect_absent(MARKS, "\x1b")
    story.expect_text("output read 1 --all", "Tests  12 passed (12)", actor=story.agent)
    story.expect_absent("output read 1 --all --again", "\x1b", actor=story.agent)


def test_a_test_run_no_reader_reads_tells_the_agent_to_add_one_once_whatever_colour_it_prints(ended_custom_tests):
    story, lines = ended_custom_tests
    expect_value_line(lines, "no reader reads check-cart.sh yet: journal reader add check-cart.sh")
    story.expect_absent_hook_line("s-1", NOTHING, "no reader reads")


@pytest.fixture
def ended_vitest(new_story):
    return ended(new_story, VITEST_RUN, VITEST_OUTPUT, CommandCategory.TEST_RUN)


@pytest.fixture
def ended_custom_tests(new_story):
    return ended(new_story, './check-cart.sh', '\x1b[32mall \x1b[1mdone\x1b[0m\n', CommandCategory.TEST_RUN)

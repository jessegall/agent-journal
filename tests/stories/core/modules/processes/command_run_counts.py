import pytest

from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from core.modules.processes.commands.store_end_decisions.store_end_decisions import StoreEndDecisions
from tests.stories.core.modules.processes.support.process_samples import end_run, start_process
from tests.stories.core.modules.processes.support.reading_case_samples import STARTED, case_of
from tests.stories.core.support.coding_fixtures import BuilderStarted

BUILD = "custom-build run"
BUILD_OUTPUT = "".join(f"compiled module {number}\n" for number in range(400)) + "error: missing header cart.h\n"
BUILD_READER = 'reader add builds --commands "custom-build*" --title "Custom builds" --lines "^error" --summary "^error: (.+)"'
UNREADABLE = 'reader unreadable "custom-build" --reason "it only redraws a progress bar"'


def ended_builds(story, count: int) -> None:
    """Runs the build count times with no reader, each failing so it needs one, ended with its output whole and its end decision kept."""
    for _ in range(count):
        process = start_process(story, BUILD, category=CommandCategory.BUILD)
        end_run(story, process, BUILD_OUTPUT, exit_code=1)
        story.container.get(Bus).run(StoreEndDecisions(process.id), story.agent, environment_id=1)


def runs_without_reader(story) -> int:
    return case_of(story, start_process(story, BUILD, category=CommandCategory.BUILD), STARTED).runs_without_change


def test_three_ended_runs_without_a_reader_count_three(new_story):
    story = new_story(fixture=BuilderStarted)
    ended_builds(story, 3)
    story.expect_rows(runs_without_reader(story) == 3, detail=str(runs_without_reader(story)))


@pytest.mark.parametrize("line", [BUILD_READER, UNREADABLE])
def test_a_reader_saved_for_the_command_or_a_mark_that_it_cannot_be_read_sets_its_count_back_to_zero(new_story, line):
    story = new_story(fixture=BuilderStarted)
    ended_builds(story, 2)
    story.expect_success(line, actor=story.agent)
    story.expect_rows(runs_without_reader(story) == 0, detail=str(runs_without_reader(story)))

from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.process import Process
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, moved_run, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

TOX_OUTPUT = "FAILED one\nerror two\n"
REJECTED_OUTPUT = "Usage: journal sins [OPTIONS]\nUnknown option --tail\n"
BUILD_OUTPUT = "compiling\ncompiling\ndone\n"
LONG_OUTPUT_LINES = 150
LONG_RUN = timedelta(seconds=20)


class TwoToxReaders(StoryFixture):
    """Two readers of the agent read the same tox command, the second made after the first."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.run('reader add first --commands "tox*" --lines "FAILED"', actor=story.agent)
        story.run('reader add second --commands "tox*" --lines "error"', actor=story.agent)


def tox_run(story: Story) -> Process:
    return ended_run(story, "tox -e py", TOX_OUTPUT)


def main_test_run_without_reader(story: Story) -> Process:
    return start_process(story, "custom-build run", category=CommandCategory.TEST_RUN)


def worker_test_run_without_reader(story: Story) -> Process:
    return worker_run(story, "custom-build run", CommandCategory.TEST_RUN)


def rejected_worker_command(story: Story) -> Process:
    process = worker_run(story, "journal sins --tail", CommandCategory.TEST_RUN)
    end_run(story, process, REJECTED_OUTPUT, exit_code=2)
    return process


def large_background_output(story: Story) -> Process:
    process = moved_run(story, "make test")
    end_run(story, process, "x\n" * LONG_OUTPUT_LINES)
    return process


def ended_after_a_while(story: Story, process: Process, text: str = BUILD_OUTPUT) -> Process:
    story.advance(LONG_RUN)
    end_run(story, process, text)
    return process


def end_decision(story: Story, process: Process) -> tuple[str, str, int]:
    row = story.container.get(Queries).query(ReadingDecisionRow).filter(process_id=process.id, moment=ReadingMoment.END).first()
    assert row is not None, f"no end decision was kept for output {process.id}"
    return row.state.value, row.action.value, int(row.level)

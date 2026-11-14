from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.models.process import Process
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from tests.stories.core.modules.processes.support.cadence_probe import informed
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, moved_run, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

TEST_ROWS_REASON = "the test reads every row it checks"

TOX_OUTPUT = "FAILED one\nerror two\n"
REJECTED_OUTPUT = "Usage: journal sins [OPTIONS]\nUnknown option --tail\n"
BUILD_OUTPUT = "compiling\ncompiling\ndone\n"
LONG_OUTPUT_LINES = 150
LONG_RUN = timedelta(seconds=20)
FAILING_TESTS = "collected 3 items\n\ntests/test_cart.py .F. [100%]\n\nFAILED tests/test_cart.py::test_total - assert 1 == 2\n=========== 1 failed, 2 passed in 0.4s ===========\n"
CRASHED_START = "Traceback (most recent call last):\nModuleNotFoundError: No module named 'cart'\n"
STEPS = "".join(f"step {number}\n" for number in range(1, 11))


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
    story.run_listeners()
    return process


def end_decision(story: Story, process: Process) -> tuple[str, str, int]:
    story.run_listeners()
    row = story.container.get(Queries).query(ReadingDecisionRow).filter(process_id=process.id, phase=ReadingPhase.END).first()
    assert row is not None, f"no end decision was kept for output {process.id}"
    return row.state.value, row.action.value, int(row.level)


def end_reason(story: Story, process: Process) -> str:
    """The reason the engine kept at the end of a run's first part."""
    story.run_listeners()
    row = story.container.get(Queries).query(ReadingDecisionRow).filter(process_id=process.id, phase=ReadingPhase.END).first()
    assert row is not None, f"no end decision was kept for output {process.id}"
    return row.reason.value


def end_positions(story: Story, process: Process) -> list[int]:
    """The part of each end decision kept for a run, one entry per decision."""
    story.run_listeners()
    return sorted(row.part_position for row in story.container.get(Queries).query(ReadingDecisionRow).filter(process_id=process.id, phase=ReadingPhase.END).every_row(TEST_ROWS_REASON))


def received(story: Story, session: str = "s-1") -> str:
    """The lines an agent hears on its next two hooks, as a hook gives only a few lines at a time."""
    return "\n".join([*informed(story, session), *informed(story, session)])


def agent_number(story: Story, agent_id: int) -> int:
    """The number an agent's card shows, which its buttons send."""
    return story.story_rows(Agent, id=agent_id)[0].number

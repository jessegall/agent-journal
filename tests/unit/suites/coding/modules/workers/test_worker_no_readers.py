from datetime import timedelta

from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.rules.read_advice_rule import ReadAdviceRule
from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import reader_worker, worker_run
from tests.stories.support.story_checks import expect_value

RAW_TEST = HookSamples.shell("pytest tests/one.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/one.py"]))
WORKER = "s-reader"
MAIN = "s-1"


def expect_unblocked(story) -> None:
    worker = reader_worker(story)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().filter(creator_id=worker.id).exists(),
                      not story.container.get(Queries).query(AgentBlock).filter(session_agent_id=worker.id, closed_at=None).exists())


def expect_blocked(story) -> None:
    worker = reader_worker(story)
    story.expect_rows(story.container.get(ReaderRequestQuery).open().filter(creator_id=worker.id).exists())


def hook_lines(story, session, sample) -> list[str]:
    return list(story.hook(session, sample).lines)


def silent_worker_run(story, line: str) -> None:
    process = worker_run(story, line)
    story.advance(timedelta(seconds=70))
    end_run(story, process, "")


def test_every_role_hears_the_shorter_read_of_a_reader():
    expect_value(ReadAdviceRule.roles, [])

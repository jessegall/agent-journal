from tests.stories.suites.coding.modules.workers.worker_no_readers import expect_blocked
from datetime import timedelta

import pytest

from engine.enums.command_category import CommandCategory
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, moved_run_of
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from core.modules.processes.models.enums.process_setting import ProcessSetting

RAW_TEST = HookSamples.shell("pytest tests/one.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/one.py"]))
WORKER = "s-reader"
MAIN = "s-1"


def hook_lines(story, session, sample) -> list[str]:
    return list(story.hook(session, sample).lines)


def silent_worker_run(story, line: str) -> None:
    process = worker_run(story, line)
    story.advance(timedelta(seconds=70))
    end_run(story, process, "")


@pytest.fixture
def forced(played):
    return played(ForcedReaders)


@pytest.fixture
def limited(forced):
    return forced


@pytest.fixture
def unlimited_runs(forced):
    forced.expect_success(f"setting set {WORKER_TEST_LIMIT} 0 --environment main", actor=forced.user)
    return forced


@pytest.fixture
def readers_disabled(forced):
    forced.run(f"setting set {ProcessSetting.READERS_FORCED.key} off --environment main")
    return forced


@pytest.fixture
def busy_worker(readers_disabled):
    task = readers_disabled.new_row_id('task make "Busy" --brief "Work" --environment main', actor=readers_disabled.agent)
    readers_disabled.expect_success(f"task start {task}", actor=reader_worker(readers_disabled))
    return readers_disabled


def test_a_worker_test_of_an_unknown_tool_under_a_limit_asks_for_the_count_reader(limited):
    worker_run(limited, "custom-test run", CommandCategory.TEST_RUN)
    expect_blocked(limited)
    request = limited.container.get(ReaderRequestQuery).open().first()
    limited.expect_rows("count" in request.reason, detail=request.reason)


def test_a_worker_run_moved_to_the_background_is_asked_for_a_title_like_a_main_agents_and_asked_for_no_reader(readers_disabled):
    process = moved_run_of(readers_disabled, reader_worker(readers_disabled), "custom-build run", CommandCategory.BUILD)
    lines = hook_lines(readers_disabled, WORKER, HookSamples.prompt("go on"))
    readers_disabled.expect_rows(any(f"Output {process.id} is titled by its raw command" in line for line in lines),
                                 not readers_disabled.container.get(ReaderRequestQuery).open().filter(creator_id=reader_worker(readers_disabled).id).exists(), detail="\n".join(lines))



from datetime import timedelta

import pytest

from core.base.agent_role import AgentRole
from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.rules.reader_hint_rule import ReaderHintRule
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.suites.coding.modules.workers.support.phase_steps import unplanned_worker

RAW_TEST = HookSamples.shell("pytest tests/one.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/one.py"]))
WORKER = "s-reader"
MAIN = "s-1"


def expect_no_hold(story) -> None:
    worker = reader_worker(story)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().filter(creator_id=worker.id).exists(),
                      not story.container.get(Queries).query(AgentBlock).filter(session_agent_id=worker.id, closed_at=None).exists())


def expect_held(story) -> None:
    worker = reader_worker(story)
    story.expect_rows(story.container.get(ReaderRequestQuery).open().filter(creator_id=worker.id).exists())


def hook_lines(story, session, sample) -> list[str]:
    return list(story.hook(session, sample).lines)


def silent_worker_run(story, line: str) -> None:
    process = worker_run(story, line)
    story.advance(timedelta(seconds=70))
    end_run(story, process, "")


@pytest.fixture
def forced(new_story):
    return new_story(fixture=ForcedReaders)


@pytest.fixture
def limited(forced):
    return forced


@pytest.fixture
def no_limit(forced):
    forced.expect_success("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main", actor=forced.user)
    return forced


@pytest.fixture
def readers_off(forced):
    forced.run("setting set journal.core.processes.readers-forced off --environment main")
    return forced


@pytest.fixture
def busy_worker(readers_off):
    task = readers_off.new_row_id('task make "Busy" --brief "Work" --environment main', actor=readers_off.agent)
    readers_off.expect_success(f"task start {task}", actor=reader_worker(readers_off))
    return readers_off


def test_a_worker_build_with_no_reader_opens_no_request_and_holds_nothing(forced):
    process = worker_run(forced, "custom-build run", CommandCategory.BUILD)
    expect_no_hold(forced)
    forced.expect_rows(forced.container.get(OutputFolder).has_slot(process.id))


def test_a_worker_test_with_no_reader_and_no_limit_opens_no_request(no_limit):
    worker_run(no_limit, "custom-test run", CommandCategory.TEST_RUN)
    expect_no_hold(no_limit)


def test_a_worker_test_of_a_known_tool_under_a_limit_opens_no_request(limited):
    worker_run(limited, "pytest tests/one.py", CommandCategory.TEST_RUN)
    expect_no_hold(limited)


def test_a_worker_test_of_an_unknown_tool_under_a_limit_asks_for_the_count_reader(limited):
    worker_run(limited, "custom-test run", CommandCategory.TEST_RUN)
    expect_held(limited)
    request = limited.container.get(ReaderRequestQuery).open().first()
    limited.expect_rows("count" in request.reason, detail=request.reason)


def test_a_worker_build_under_a_limit_opens_no_request(limited):
    worker_run(limited, "custom-build run", CommandCategory.BUILD)
    expect_no_hold(limited)


def test_a_reader_with_a_count_command_lifts_the_count_request(limited):
    limited.expect_success('reader add counted --commands "custom-test*" --title Testing --lines "done" --summary "done" --count-command "custom-test --list"', actor=limited.agent)
    worker_run(limited, "custom-test run", CommandCategory.TEST_RUN)
    expect_no_hold(limited)


def test_a_reader_without_a_count_command_still_asks_for_the_count(limited):
    limited.expect_success('reader add plain --commands "custom-test*" --title Testing --lines "done" --summary "done"', actor=limited.agent)
    worker_run(limited, "custom-test run", CommandCategory.TEST_RUN)
    expect_held(limited)


def test_a_worker_is_not_told_about_a_reader_request_it_does_not_have(forced):
    worker_run(forced, "custom-build run", CommandCategory.BUILD)
    forced.expect_rows(not any("reader request" in line for line in hook_lines(forced, WORKER, HookSamples.prompt("go on"))))


def test_a_worker_may_stop_with_no_reader_hold(forced):
    worker_run(forced, "custom-build run", CommandCategory.BUILD)
    forced.expect_hook_allowed(WORKER, HookSamples.stop())


def test_a_raw_test_line_of_a_worker_is_not_refused_for_a_saved_command(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.story.expect_success('alias add run-tests "pytest"', actor=worker.story.agent)
    worker.story.expect_hook_allowed(worker.session, RAW_TEST)


def test_the_main_agent_is_still_refused_a_raw_test_line(forced):
    forced.expect_success('alias add run-tests "pytest"', actor=forced.agent)
    part = ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/one.py"]).prepared("pytest tests/one.py")
    shell = {"line": "pytest tests/one.py", "parts": [part], "aliases": ["run-tests"], "redirects": [], "is_journal_only": False, "parse_error": "", "saved_commands_known": True}
    forced.expect_hook_refusal(MAIN, HookSamples.tool_use("Bash", ToolType.SHELL, [], None, shell=shell), "alias")


def test_a_worker_is_never_refused_or_taught_after_silent_runs(busy_worker):
    silent_worker_run(busy_worker, "custom-build run")
    silent_worker_run(busy_worker, "custom-build run")
    sample = HookSamples.shell("custom-build run", ShellPart("custom-build", CommandCategory.BUILD, ["run"]))
    busy_worker.expect_hook_allowed(WORKER, sample)
    busy_worker.expect_rows(not any("reader" in line for line in hook_lines(busy_worker, WORKER, sample)))


def test_a_long_worker_run_asks_for_no_title_and_holds_nothing(readers_off):
    process = worker_run(readers_off, "custom-build run", CommandCategory.BUILD)
    readers_off.advance(timedelta(seconds=10))
    readers_off.expect_rows(not any(f"output {process.id}" in line for line in hook_lines(readers_off, WORKER, HookSamples.prompt("go on"))))
    expect_no_hold(readers_off)


def test_a_silent_run_of_a_worker_says_nothing_about_its_output(readers_off):
    readers_off.advance(timedelta(seconds=1))
    worker_run(readers_off, "custom-test run", CommandCategory.TEST_RUN)
    readers_off.advance(timedelta(minutes=10))
    readers_off.expect_rows(not any("printed nothing" in line or "quiet" in line for line in hook_lines(readers_off, WORKER, HookSamples.prompt("go on"))))


def test_only_the_main_agent_hears_the_shorter_read_of_a_reader():
    assert ReaderHintRule.roles == [AgentRole.MAIN]

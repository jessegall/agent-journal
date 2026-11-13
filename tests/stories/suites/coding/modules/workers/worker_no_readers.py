from datetime import timedelta

import pytest

from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.rules.read_advice_rule import ReadAdviceRule
from core.modules.processes.support.output_folder import OutputFolder
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.support.story_checks import expect_value
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT

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


@pytest.fixture
def forced(new_story):
    return new_story(fixture=ForcedReaders)


@pytest.fixture
def limited(forced):
    return forced


@pytest.fixture
def unlimited_runs(forced):
    forced.expect_success(f"setting set {WORKER_TEST_LIMIT} 0 --environment main", actor=forced.user)
    return forced


@pytest.fixture
def readers_disabled(forced):
    forced.run("setting set journal.core.processes.readers-forced off --environment main")
    return forced


@pytest.fixture
def busy_worker(readers_disabled):
    task = readers_disabled.new_row_id('task make "Busy" --brief "Work" --environment main', actor=readers_disabled.agent)
    readers_disabled.expect_success(f"task start {task}", actor=reader_worker(readers_disabled))
    return readers_disabled


def test_a_worker_build_with_no_reader_opens_no_request_and_holds_nothing(forced):
    process = worker_run(forced, "custom-build run", CommandCategory.BUILD)
    expect_unblocked(forced)
    forced.expect_rows(forced.container.get(OutputFolder).has_slot(process.id))


def test_a_worker_test_with_no_reader_and_no_limit_opens_no_request(unlimited_runs):
    worker_run(unlimited_runs, "custom-test run", CommandCategory.TEST_RUN)
    expect_unblocked(unlimited_runs)


def test_a_worker_test_of_a_known_tool_under_a_limit_opens_no_request(limited):
    worker_run(limited, "pytest tests/one.py", CommandCategory.TEST_RUN)
    expect_unblocked(limited)


def test_a_worker_test_of_an_unknown_tool_under_a_limit_asks_for_the_count_reader(limited):
    worker_run(limited, "custom-test run", CommandCategory.TEST_RUN)
    expect_blocked(limited)
    request = limited.container.get(ReaderRequestQuery).open().first()
    limited.expect_rows("count" in request.reason, detail=request.reason)


def test_a_worker_build_under_a_limit_opens_no_request(limited):
    worker_run(limited, "custom-build run", CommandCategory.BUILD)
    expect_unblocked(limited)


def test_a_reader_with_a_count_command_lifts_the_count_request(limited):
    limited.expect_success('reader add counted --commands "custom-test*" --title Testing --lines "done" --summary "done" --count-command "custom-test --list"', actor=limited.agent)
    worker_run(limited, "custom-test run", CommandCategory.TEST_RUN)
    expect_unblocked(limited)


def test_a_reader_without_a_count_command_still_asks_for_the_count(limited):
    limited.expect_success('reader add plain --commands "custom-test*" --title Testing --lines "done" --summary "done"', actor=limited.agent)
    worker_run(limited, "custom-test run", CommandCategory.TEST_RUN)
    expect_blocked(limited)


def test_a_worker_is_not_told_about_a_reader_request_it_does_not_have(forced):
    worker_run(forced, "custom-build run", CommandCategory.BUILD)
    forced.expect_rows(not any("reader request" in line for line in hook_lines(forced, WORKER, HookSamples.prompt("go on"))))


def test_a_worker_may_stop_with_no_reader_hold(forced):
    worker_run(forced, "custom-build run", CommandCategory.BUILD)
    forced.expect_hook_allowed(WORKER, HookSamples.stop())


def test_the_main_agent_is_still_refused_a_raw_test_line(forced):
    forced.expect_success('alias add run-tests "pytest"', actor=forced.agent)
    part = ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/one.py"]).prepared("pytest tests/one.py")
    shell = {"line": "pytest tests/one.py", "parts": [part], "aliases": ["run-tests"], "redirects": [], "is_journal_only": False, "parse_error": "", "saved_commands_known": True}
    forced.expect_hook_refusal(MAIN, HookSamples.tool_use("Bash", ToolType.SHELL, [], None, shell=shell), "alias")


def test_a_worker_after_two_silent_runs_is_refused_its_start_like_every_role(busy_worker):
    silent_worker_run(busy_worker, "custom-build run")
    silent_worker_run(busy_worker, "custom-build run")
    sample = HookSamples.shell("custom-build run", ShellPart("custom-build", CommandCategory.BUILD, ["run"]))
    busy_worker.expect_hook_refusal(WORKER, sample, "custom-build run ran silent twice")


def test_a_long_worker_run_is_asked_for_a_title_like_a_main_agents_and_asked_for_no_reader(readers_disabled):
    process = worker_run(readers_disabled, "custom-build run", CommandCategory.BUILD)
    readers_disabled.advance(timedelta(seconds=10))
    lines = hook_lines(readers_disabled, WORKER, HookSamples.prompt("go on"))
    readers_disabled.expect_rows(any(f"Output {process.id} is titled by its raw command" in line for line in lines),
                                 not readers_disabled.container.get(ReaderRequestQuery).open().filter(creator_id=reader_worker(readers_disabled).id).exists(), detail="\n".join(lines))


def test_every_role_hears_the_shorter_read_of_a_reader():
    expect_value(ReadAdviceRule.roles, [])

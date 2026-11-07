from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
import pytest
from pathlib import Path

from core.base.command.bus import Bus
from core.base.actor import Actor
from core.base.driver.command_category import CommandCategory
from core.base.journal_home import LAUNCHER_SOCKET
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.ticks.output_reading import OutputReading
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from core.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.bindings.worker_test_listings import WorkerTestListings
from core.testing.expect_reply import expect_reply_refusal


class TestLimitSetup(StoryFixture):
    """A worker whose own runs may include at most five tests."""

    parent = ForcedReaders

    def steps(self, story: Story) -> None:
        story.run("setting set journal.suites.coding.workers.worker-run-most-tests 5 --environment main")
        story.run("setting set journal.core.processes.readers-forced off --environment main")


@pytest.fixture
def limited_run(new_story):
    story = new_story(fixture=TestLimitSetup)
    install_runner(story)
    process = worker_run(story, "pytest tests/cart.py", CommandCategory.TEST_RUN)
    return story, process


def test_the_limit_defaults_to_25_and_an_environments_value_wins(new_story):
    story = new_story(fixture=ForcedReaders)
    story.expect_success("setting show journal.suites.coding.workers.worker-run-most-tests", "value: 25")
    story.run("setting set journal.suites.coding.workers.worker-run-most-tests 10 --environment main")
    story.expect_success("setting show journal.suites.coding.workers.worker-run-most-tests --environment main", "value: 10")


def test_a_run_over_the_limit_is_stopped_when_its_collected_line_is_read(limited_run):
    story, process = limited_run
    story.container.get(OutputFolder).write_output(process.id, 1, "collected 8 items\n")
    OutputReading()(story.container)
    story.expect_rows(story.container.get(Queries).query(Process).find(process.id).state is ProcessState.STOPPED)
    lines = tuple(story.container.get(Queries).query(AgentLine).filter(session_agent_id=process.session_agent_id, source="processes.worker-test-limit").all_rows())
    story.expect_rows(len(lines) == 1, "8 tests" in lines[0].text, "5" in lines[0].text)


def test_a_run_through_a_reader_with_no_count_is_counted_by_the_stock_reader_of_its_program(new_story):
    story = new_story(fixture=TestLimitSetup)
    install_runner(story)
    story.expect_success('reader add worker-pytest --commands "pytest tests/*" --lines "collected" --summary "passed" --title "Python tests"', actor=story.agent)
    process = worker_run(story, "pytest tests/cart.py", CommandCategory.TEST_RUN)
    story.expect_rows("--collect-only" in story.container.get(WorkerTestListings).line(process))


def test_a_go_test_of_a_worker_is_counted(new_story):
    story = new_story(fixture=TestLimitSetup)
    install_runner(story)
    process = worker_run(story, "go test ./classify", CommandCategory.TEST_RUN)
    story.expect_rows('-list "$pattern"' in story.container.get(WorkerTestListings).line(process), "pattern=." in story.container.get(WorkerTestListings).line(process))


def test_a_part_that_ran_over_the_limit_last_time_is_refused_at_the_hook(limited_run):
    story, process = limited_run
    story.container.get(OutputFolder).write_output(process.id, 1, "collected 8 items\n")
    OutputReading()(story.container)
    reply = story.hook("s-reader", HookSamples.shell("cat notes && pytest tests/cart.py", ShellPart("cat", CommandCategory.READ, ["notes"]),
                                               ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/cart.py"])))
    expect_reply_refusal(reply, "8 tests")


@pytest.mark.parametrize("limit,count", [(5, 4), (0, 8)])
def test_a_run_under_the_limit_and_a_limit_of_zero_go_on(limited_run, limit, count):
    story, process = limited_run
    story.run(f"setting set journal.suites.coding.workers.worker-run-most-tests {limit} --environment main")
    story.container.get(OutputFolder).write_output(process.id, 1, f"collected {count} items\n")
    OutputReading()(story.container)
    story.expect_rows(story.container.get(Queries).query(Process).find(process.id).state is ProcessState.RUNNING)


def test_the_tests_of_a_proof_are_not_limited(new_story):
    story = new_story(fixture=TestLimitSetup)
    worker = reader_worker(story)
    actor = Actor.core()
    process = story.container.get(Bus).run(StartProcess.single_part(worker.id, "pytest tests/proof.py", "/work", CommandCategory.TEST_RUN, 30), actor, environment_id=1)
    story.container.get(OutputFolder).write_output(process.id, 1, "collected 100 items\n")
    OutputReading()(story.container)
    story.expect_rows(story.container.get(Queries).query(Process).find(process.id).state is ProcessState.RUNNING)


def test_a_count_for_another_part_does_not_refuse_a_command(limited_run):
    story, process = limited_run
    worker = reader_worker(story)
    task = story.new_row_id('task make "Check another command" --environment main')
    story.run(f"task start {task}", actor=worker)
    story.run(f"task overview {task}", actor=worker)
    story.container.get(OutputFolder).write_output(process.id, 1, "collected 8 items\n")
    OutputReading()(story.container)
    story.expect_hook_allowed("s-reader", HookSamples.shell("pytest tests/other.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/other.py"])))


def test_stopping_from_the_output_tick_keeps_the_count_and_ends_the_output(limited_run):
    story, process = limited_run
    story.container.get(OutputFolder).write_output(process.id, 1, "collected 6 items\n")
    story.expect_rows(OutputReading()(story.container))
    story.expect_text(f"output show {process.id}", "test_count: 6", "ended_at:", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Process).find(process.id).state is ProcessState.STOPPED)


def test_a_stopped_worker_is_started_again_with_the_count_and_limit(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.run("setting set journal.suites.coding.workers.worker-run-most-tests 5 --environment main")
    story.run("setting set journal.core.processes.readers-forced off --environment main")
    process = story.container.get(Bus).run(StartProcess.single_part(worker.id, "pytest tests/restart.py", "/work", CommandCategory.TEST_RUN, 30), worker, environment_id=1)
    story.run(f"process background {process.id}", actor=worker)
    story.run(f"agent end {worker.id}", actor=worker)
    story.run_listeners()
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"started\n")
    story.container.get(OutputFolder).write_output(process.id, 1, "collected 8 items\n")
    OutputReading()(story.container)
    story.run_listeners()
    worktree = story.container.get(WorktreeQuery).worker_worktree(worker.id)
    launcher.expect_started(worker.id, worker_session(story, worker), Path(worktree.folder))
    story.expect_rows("8 tests" in str(launcher.requests[0]["command"]), "limit 5" in str(launcher.requests[0]["command"]))


def test_a_queued_run_over_the_limit_by_its_listing_never_gets_a_spot(limited_run):
    story, process = limited_run
    folder = story.container.get(OutputFolder)
    story.expect_rows(not folder.has_slot(process.id))
    folder.write_count(process.id, "\nJOURNAL_COUNT_PART_1\ncollected 8 items\n", 0)
    story.container.get(Bus).run(GrantRunSlots(), story.agent, environment_id=1)
    story.expect_rows(not folder.has_slot(process.id), story.container.get(Queries).query(Process).find(process.id).state is ProcessState.STOPPED)
    story.expect_text(f"output show {process.id}", "test_count: 8", actor=story.agent)


@pytest.mark.parametrize("status", [0, 1, 143])
def test_a_listing_without_a_known_count_stops_the_run(limited_run, status):
    story, process = limited_run
    folder = story.container.get(OutputFolder)
    folder.write_count(process.id, "no number\n" if status == 0 else "collected 100 items\n", status)
    story.container.get(Bus).run(GrantRunSlots(), story.agent, environment_id=1)
    lines = tuple(story.container.get(Queries).query(AgentLine).filter(session_agent_id=process.session_agent_id, source="processes.worker-test-limit").all_rows())
    story.expect_rows(not folder.has_slot(process.id), story.container.get(Queries).query(Process).find(process.id).state is ProcessState.STOPPED,
                      len(lines) == 1, "could not count" in lines[0].text)


def test_a_worker_test_tool_with_no_reader_runs_once_so_a_reader_can_be_drawn_from_its_output(new_story):
    story = new_story(fixture=TestLimitSetup)
    install_runner(story)
    process = worker_run(story, "unknown-test tests/cart", CommandCategory.TEST_RUN)
    story.expect_rows(story.container.get(Queries).query(Process).find(process.id).state is ProcessState.RUNNING)


def test_a_listing_that_fails_says_why_in_the_line(limited_run):
    story, process = limited_run
    story.container.get(OutputFolder).write_count(process.id, "zsh: no such file: vitest\n", 1)
    story.container.get(Bus).run(GrantRunSlots(), story.agent, environment_id=1)
    lines = tuple(story.container.get(Queries).query(AgentLine).filter(session_agent_id=process.session_agent_id, source="processes.worker-test-limit").all_rows())
    story.expect_rows(len(lines) == 1, "no such file: vitest" in lines[0].text)


def test_a_chain_lists_each_test_part_and_adds_the_counts(limited_run):
    story, previous = limited_run
    worker = reader_worker(story)
    task = story.new_row_id('task make "List both test commands" --environment main')
    story.run(f"task start {task}", actor=worker)
    story.run(f"task overview {task}", actor=worker)
    reply = story.hook("s-reader", HookSamples.shell("pytest tests/one.py && pytest tests/two.py",
                       ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/one.py"]),
                       ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/two.py"])))
    story.expect_rows(not reply.refusal, "--count" in str(reply.updated_input), "JOURNAL_COUNT_PART_1" in str(reply.updated_input),
                      "JOURNAL_COUNT_PART_2" in str(reply.updated_input))
    process = story.container.get(Queries).query(Process).filter(session_agent_id=worker.id).newest().page(1, 1).rows[0]
    folder = story.container.get(OutputFolder)
    folder.write_count(process.id, "\nJOURNAL_COUNT_PART_1\ncollected 3 items\nJOURNAL_COUNT_PART_2\ncollected 3 items\n", 0)
    story.container.get(Bus).run(GrantRunSlots(), story.agent, environment_id=1)
    story.expect_rows(not folder.has_slot(process.id), story.container.get(Queries).query(Process).find(process.id).state is ProcessState.STOPPED)
    story.expect_text(f"output show {process.id}", "test_count: 6", actor=story.agent)
    story.expect_hook_allowed("s-reader", HookSamples.shell("pytest tests/one.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/one.py"])))
    story.expect_hook_allowed("s-reader", HookSamples.shell("pytest tests/two.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/two.py"])))


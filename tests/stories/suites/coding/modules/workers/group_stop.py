from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.testing.examples.hook_samples import HookSamples
from suites.coding.models.enums.ask_topic import AskTopic
from tests.stories.core.modules.processes.support.process_samples import start_process
from engine.enums.command_category import CommandCategory
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import holding_worker, prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, SECOND_TEST_LINE, TEST_LINE, start_planned_worker, unplanned_worker
from suites.coding.modules.workers.support.worker_nudges import UNFINISHED_TASKS_SOURCE
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.support.worker_nudges import WORKER_RESTARTED
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED
from engine.testing.expectations.expect_nudge import said
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT

TEST_ROWS_REASON = "the test reads every row it checks"

MERGER_OFF = f"setting set {MERGER_ENABLED} false --project"
BUILD_TASKS = 3


def unfinished_lines(worker) -> tuple[AgentLine, ...]:
    worker.story.run_listeners()
    return tuple(worker.story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.worker.id, source=UNFINISHED_TASKS_SOURCE).every_row(TEST_ROWS_REASON))


def expect_silent_stop(worker) -> None:
    lines = worker.main_agent_lines()
    worker.story.expect_rows(not unfinished_lines(worker), not any(said(WORKER_RESTARTED).is_in(line) or "ended with" in line for line in lines),
                             not any("tasks left" in line for line in worker.worker_lines()), detail=str(lines))


def expect_refused_with_status(worker) -> None:
    reply = worker.stop()
    worker.story.expect_rows(bool(reply.refusal), worker.status_line() in reply.refusal, AskTopic.GENERAL.question_line() in reply.refusal, detail=reply.refusal)


@pytest.fixture
def phase_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)


@pytest.fixture
def three_proved(new_story, monkeypatch):
    """A worker of phase Build that started its three tasks and proved each with a test; nothing is committed."""
    worker = holding_worker(new_story, monkeypatch, BUILD_TASKS)
    for task_id, test_line in ((1, TEST_LINE), (2, SECOND_TEST_LINE), (3, TEST_LINE)):
        prove_task(worker, task_id, 1, test_line)
    return worker


@pytest.fixture
def committed(three_proved):
    """The three tasks are committed together in the started plan: the worktree waits for its merge."""
    three_proved.story.run(COMMIT, actor=three_proved.worker)
    return three_proved


@pytest.fixture
def crashed_building(phase_worker):
    phase_worker.program_ended()
    return phase_worker


@pytest.fixture
def failed_commit(new_story, monkeypatch):
    """A worker in no plan committed its task with a test and that test failed."""
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove_commit(TEST_LINE)
    worker.story.run_listeners()
    worker.end_tests(1)
    return worker


def test_a_worker_whose_two_tasks_are_committed_stops_quietly(new_story, monkeypatch):
    worker = unplanned_holding_worker(new_story, monkeypatch)
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1, SECOND_TEST_LINE)
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.expect_hook_allowed(worker.session, HookSamples.stop())
    worker.program_ended()
    expect_silent_stop(worker)


def test_a_single_task_committed_with_its_next_task_not_started_stops_quietly(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove_commit(TEST_LINE)
    worker.story.expect_hook_allowed(worker.session, HookSamples.stop())
    worker.program_ended()
    expect_silent_stop(worker)


def test_a_worker_whose_commit_in_a_started_plan_waits_for_its_merge_stops_quietly(committed):
    asked_for_merge(committed.story, committed.worker)
    committed.story.expect_hook_allowed(committed.session, HookSamples.stop())
    committed.program_ended()
    expect_silent_stop(committed)


def test_a_worker_with_a_started_task_that_has_no_proof_that_stops_is_refused_with_the_status_line(phase_worker):
    expect_refused_with_status(phase_worker)


def test_a_worker_with_proved_tasks_it_has_not_committed_that_stops_is_refused_with_the_status_line(three_proved):
    expect_refused_with_status(three_proved)


def test_a_worker_with_failed_tests_that_stops_is_refused_with_the_status_line(failed_commit):
    expect_refused_with_status(failed_commit)


def test_a_worker_whose_program_crashed_while_building_is_started_again(crashed_building):
    crashed_building.story.expect_rows(any(said(WORKER_RESTARTED).is_in(line) and "started again" in line for line in crashed_building.main_agent_lines()), len(unfinished_lines(crashed_building)) == 1)


def test_a_worker_with_an_open_ask_still_reaches_its_parent_when_it_ends(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.story.expect_success(MERGER_OFF, actor=worker.story.user)
    worker.story.expect_success('wait stuck "the plan is unclear"', actor=worker.worker)
    worker.program_ended()
    worker.story.expect_text(f"agent-line list --agent {worker.story.agent.id}", f"worker:{agent_number(worker.story, worker.worker.id)} ended with")


def test_a_worker_with_a_run_going_may_stop(phase_worker):
    phase_worker.story.agent, main = phase_worker.worker, phase_worker.story.agent
    phase_worker.story.expect_success(f"setting set {WORKER_TEST_LIMIT} 0 --environment main", actor=phase_worker.story.user)
    start_process(phase_worker.story, "make check", category=CommandCategory.TEST_RUN)
    phase_worker.story.agent = main
    phase_worker.story.expect_hook_allowed(phase_worker.session, HookSamples.stop())


def test_a_worker_with_no_task_left_may_stop(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f'worker release {agent_number(story, worker.id)} "done with it"', actor=story.agent)
    story.expect_hook_allowed(worker_session(story, worker), HookSamples.stop())


def test_a_worker_with_only_blocked_tasks_may_stop_and_tells_who_blocked_them(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task block 1 --reason "waits on a user"', actor=worker)
    reply = story.expect_hook_allowed(worker_session(story, worker), HookSamples.stop())
    story.expect_rows(reply is None or said(WORKER_TASK_BLOCKED).is_in(' '.join(reply.lines)))

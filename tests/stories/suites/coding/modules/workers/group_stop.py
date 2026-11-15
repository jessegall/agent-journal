from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.testing.examples.hook_samples import HookSamples
from suites.coding.models.enums.ask_topic import AskTopic
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import worker_with_tasks, prove_task, unplanned_worker_with_tasks
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, SECOND_TEST_LINE, TEST_LINE, start_planned_worker, unplanned_worker
from suites.coding.modules.workers.support.worker_nudges import UNFINISHED_TASKS_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.nudges.worker_restarted_nudge import WorkerRestartedNudge
from suites.coding.modules.workers.nudges.worker_task_blocked_nudge import WorkerTaskBlockedNudge
from engine.testing.expectations.expected_nudge import expected_nudge
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


MERGER_OFF = f"setting set {MERGER_ENABLED} false --project"
BUILD_TASKS = 3


def unfinished_lines(worker) -> tuple[AgentLine, ...]:
    worker.story.run_listeners()
    return tuple(worker.story.story_rows(AgentLine, session_agent_id=worker.worker.id, source=UNFINISHED_TASKS_SOURCE))


def expect_silent_stop(worker) -> None:
    lines = worker.main_agent_lines()
    worker.story.expect_rows(not unfinished_lines(worker), not any(expected_nudge(WorkerRestartedNudge.declared()).matches_text(line) or "ended with" in line for line in lines),
                             not any("tasks left" in line for line in worker.worker_lines()), detail=str(lines))


def expect_refused_with_status(worker) -> None:
    reply = worker.stop()
    worker.story.expect_rows(bool(reply.refusal), worker.status_line() in reply.refusal, AskTopic.GENERAL.question_line() in reply.refusal, detail=reply.refusal)


@pytest.fixture
def phase_worker(new_story):
    return start_planned_worker(new_story, PHASE_DISPATCH)


@pytest.fixture
def three_proved(new_story):
    """A worker of phase Build that started its three tasks and proved each with a test; nothing is committed."""
    worker = worker_with_tasks(new_story, BUILD_TASKS)
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
def failed_commit(new_story):
    """A worker in no plan committed its task with a test and that test failed."""
    worker = unplanned_worker(new_story)
    worker.prove_commit(TEST_LINE)
    worker.story.run_listeners()
    worker.end_tests(1)
    return worker


def test_a_worker_whose_two_tasks_are_committed_stops_quietly(new_story):
    worker = unplanned_worker_with_tasks(new_story)
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1, SECOND_TEST_LINE)
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.expect_hook_allowed(worker.session, HookSamples.stop())
    worker.program_ended()
    expect_silent_stop(worker)


def test_a_single_task_committed_with_its_next_task_not_started_stops_quietly(new_story):
    worker = unplanned_worker(new_story)
    worker.prove_commit(TEST_LINE)
    worker.story.expect_hook_allowed(worker.session, HookSamples.stop())
    worker.program_ended()
    expect_silent_stop(worker)


def test_a_worker_whose_commit_in_a_started_plan_waits_for_its_merge_stops_quietly(committed):
    request_merge(committed.story, committed.worker)
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
    crashed_building.story.expect_rows(any(expected_nudge(WorkerRestartedNudge.declared()).matches_text(line) and "started again" in line for line in crashed_building.main_agent_lines()), len(unfinished_lines(crashed_building)) == 1)


def test_a_worker_with_an_open_ask_still_reaches_its_parent_when_it_ends(new_story):
    worker = start_planned_worker(new_story, PHASE_DISPATCH)
    worker.story.expect_success(MERGER_OFF, actor=worker.story.user)
    worker.story.expect_success('wait stuck "the plan is unclear"', actor=worker.worker)
    worker.program_ended()
    worker.story.expect_text(f"agent-line list --agent {worker.story.agent.id}", f"worker:{agent_number(worker.story, worker.worker.id)} ended with")


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
    story.expect_rows(reply is None or expected_nudge(WorkerTaskBlockedNudge.declared()).matches_text(' '.join(reply.lines)))

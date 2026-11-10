from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.testing.examples.hook_samples import HookSamples
from suites.coding.models.enums.ask_topic import AskTopic
from tests.stories.core.modules.processes.support.process_samples import start_process
from engine.enums.command_category import CommandCategory
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, PLAN_DISPATCH, SECOND_TEST_LINE, TEST_LINE, start_planned_worker, unplanned_worker
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line import UNFINISHED_TASKS_SOURCE
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine

BATCH_SETTING = "setting set journal.suites.coding.workers.test-batch-size 2 --environment main"
MERGER_OFF = "setting set journal.suites.coding.workers.merger-on false --project"


def unfinished_lines(worker) -> tuple[AgentLine, ...]:
    worker.story.run_listeners()
    return tuple(worker.story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.worker.id, source=UNFINISHED_TASKS_SOURCE).all_rows())


def expect_silent_stop(worker) -> None:
    lines = worker.main_agent_lines()
    worker.story.expect_rows(not unfinished_lines(worker), not any("stopped with" in line or "ended with" in line for line in lines),
                             not any("tasks left" in line for line in worker.worker_lines()), detail=str(lines))


def expect_refused_with_status(worker) -> None:
    reply = worker.stop()
    worker.story.expect_rows(bool(reply.refusal), worker.status_line() in reply.refusal, AskTopic.GENERAL.question_line() in reply.refusal, detail=reply.refusal)


@pytest.fixture
def phase_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)


@pytest.fixture
def plan_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PLAN_DISPATCH)


@pytest.fixture
def handed_in(phase_worker):
    phase_worker.prove_advance(TEST_LINE)
    phase_worker.prove_advance(SECOND_TEST_LINE)
    phase_worker.prove(TEST_LINE)
    phase_worker.story.run("worker deliver --wait --differences none", actor=phase_worker.worker)
    return phase_worker


@pytest.fixture
def boundary_handed_in(plan_worker):
    plan_worker.prove_advance(TEST_LINE)
    plan_worker.prove_advance()
    plan_worker.prove_advance(SECOND_TEST_LINE)
    return plan_worker


@pytest.fixture
def crashed_building(phase_worker):
    phase_worker.program_ended()
    return phase_worker


@pytest.fixture
def failed_group(handed_in):
    handed_in.end_tests(1, 0, 0)
    return handed_in


def test_a_batch_handed_in_stops_quietly(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.story.expect_success(BATCH_SETTING, actor=worker.story.user)
    worker.prove_advance(TEST_LINE)
    worker.prove(SECOND_TEST_LINE)
    worker.story.run("worker deliver --wait --differences none", actor=worker.worker)
    worker.story.expect_hook_allowed(worker.session, HookSamples.stop())
    worker.program_ended()
    expect_silent_stop(worker)


def test_a_single_task_handed_in_with_its_next_queued_stops_quietly(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove(TEST_LINE)
    worker.story.run("worker next --wait --differences none", actor=worker.worker)
    worker.story.expect_hook_allowed(worker.session, HookSamples.stop())
    worker.program_ended()
    expect_silent_stop(worker)


def test_a_group_whose_tests_passed_and_waits_for_its_merge_stops_quietly(handed_in):
    handed_in.end_all_tests()
    handed_in.story.expect_hook_allowed(handed_in.session, HookSamples.stop())
    handed_in.program_ended()
    expect_silent_stop(handed_in)


def test_a_worker_that_stops_mid_group_is_refused_with_the_status_line(phase_worker):
    expect_refused_with_status(phase_worker)


def test_a_worker_at_the_end_of_a_group_that_stops_is_refused_with_the_status_line(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.prove_advance()
    worker.prove_advance()
    worker.prove()
    expect_refused_with_status(worker)


def test_a_worker_with_failed_tests_that_stops_is_refused_with_the_status_line(failed_group):
    expect_refused_with_status(failed_group)


def test_a_worker_whose_program_crashed_while_building_is_started_again(crashed_building):
    crashed_building.story.expect_rows(any("stopped with" in line and "started again" in line for line in crashed_building.main_agent_lines()), len(unfinished_lines(crashed_building)) == 1)


def test_a_worker_with_an_open_ask_still_reaches_its_parent_when_it_ends(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.story.expect_success(MERGER_OFF, actor=worker.story.user)
    worker.story.expect_success('wait stuck "the plan is unclear"', actor=worker.worker)
    worker.program_ended()
    worker.story.expect_text(f"agent-line list --agent {worker.story.agent.id}", f"worker:{worker.worker.id} ended with")


def test_a_worker_with_a_run_going_may_stop(phase_worker):
    phase_worker.story.agent, main = phase_worker.worker, phase_worker.story.agent
    phase_worker.story.expect_success("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main", actor=phase_worker.story.user)
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
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    reply = story.expect_hook_allowed(worker_session(story, worker), HookSamples.stop())
    story.expect_rows(reply is None or "blocked task:1" in " ".join(reply.lines))


def test_a_stopped_worker_is_woken_with_its_next_task_when_the_tests_of_its_group_pass(boundary_handed_in):
    worker = boundary_handed_in
    worker.end_all_tests()
    worker.story.expect_text("worker status", "Point: build", actor=worker.worker)
    worker.story.expect_rows(worker.current_task() == 4)

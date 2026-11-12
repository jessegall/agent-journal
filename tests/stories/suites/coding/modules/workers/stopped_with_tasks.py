from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.query.queries import Queries
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.suites.coding.modules.workers.gone_workers import RESUMED_PID, missing_program, running_worker, start_launcher, worker_story
from tests.stories.suites.coding.modules.workers.queued_commands import worker_command
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import set_resume_limit

TEST_ROWS_REASON = "the test reads every row it checks"

__all__ = ["missing_program", "running_worker", "worker_command", "worker_story"]

MAIN_SESSION = "s-1"
MERGER_ON = "setting set journal.suites.coding.workers.merger-on true --project"
GO_ON_WITH_TASK_2 = "go on with task 2"
STOP_AND_WAIT = "stop, you will be told when it ends"


def ended(story) -> None:
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.advance(timedelta(seconds=1))


def retried(story):
    launcher = start_launcher(story, f"started {RESUMED_PID}\n".encode())
    WorkerResumeRetry()(story.container)
    return launcher


def expect_worker_restart(story, launcher) -> None:
    launcher.drain_requests()
    story.expect_rows(len(launcher.starts) == 1, launcher.starts[0]["agent_id"] == story.worker.id, detail=str(launcher.requests))


def main_agent_lines(story) -> str:
    return story.run(f"agent-line list --agent {story.agent.id}").output_text


def waiting_lines_entered(story) -> None:
    rows = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.worker.id, state=AgentLineState.WAITING).every_row(TEST_ROWS_REASON)
    for row in rows:
        story.container.get(Bus).run(EnterAgentLine(row.id), Actor.core(), environment_id=1)


@pytest.fixture
def two_task_worker(running_worker):
    story = running_worker
    story.expect_success('task make "Print the receipt" --brief "Print it" --environment main', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, story.worker.id)} --task 2", actor=story.agent)
    return story


@pytest.fixture
def blocked_worker(two_task_worker):
    story = two_task_worker
    story.expect_success('task block 1 --reason "waits on a person"', actor=story.agent)
    ended(story)
    return story


def test_a_stopped_worker_whose_current_task_is_blocked_is_woken_for_its_next_open_task(blocked_worker):
    expect_worker_restart(blocked_worker, retried(blocked_worker))


def test_a_stopped_worker_with_only_blocked_tasks_is_left_alone(two_task_worker):
    two_task_worker.expect_success('task block 1 --reason "waits on a person"', actor=two_task_worker.agent)
    two_task_worker.expect_success('task block 2 --reason "waits on a person"', actor=two_task_worker.agent)
    ended(two_task_worker)
    waiting_lines_entered(two_task_worker)
    two_task_worker.advance(timedelta(minutes=1))
    launcher = retried(two_task_worker)
    two_task_worker.expect_rows(launcher.requests == [], detail=str(launcher.requests))


def test_a_worker_another_agent_stopped_with_open_tasks_stays_stopped(two_task_worker):
    two_task_worker.expect_success('task block 1 --reason "waits on a person"', actor=two_task_worker.agent)
    two_task_worker.expect_success(f"agent end {two_task_worker.worker.id}", actor=two_task_worker.agent)
    two_task_worker.advance(timedelta(minutes=1))
    launcher = retried(two_task_worker)
    two_task_worker.expect_rows(launcher.requests == [], detail=str(launcher.requests))


def test_a_worker_that_keeps_ending_with_the_merger_on_is_named_to_the_main_agent_once(two_task_worker):
    story = two_task_worker
    set_resume_limit(story.container, 0)
    story.expect_success(MERGER_ON, actor=story.user)
    ended(story)
    story.tick(MAIN_SESSION)
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(f"worker:{agent_number(story, story.worker.id)} ended with") == 1, detail=lines)


def test_a_worker_that_keeps_ending_with_a_blocked_current_task_names_its_open_task_to_the_main_agent(two_task_worker):
    story = two_task_worker
    set_resume_limit(story.container, 0)
    story.expect_success('task block 1 --reason "waits on a person"', actor=story.agent)
    ended(story)
    waiting_lines_entered(story)
    story.advance(timedelta(minutes=1))
    launcher = retried(story)
    lines = main_agent_lines(story)
    story.expect_rows(launcher.requests == [], f"worker:{agent_number(story, story.worker.id)} ended with" in lines, "task:2" in lines, detail=lines)


def test_a_worker_handing_on_to_an_open_task_is_pointed_at_it(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --environment main', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task 2", actor=story.agent)
    outcome = story.run("worker commit --differences none", actor=worker)
    story.expect_rows(GO_ON_WITH_TASK_2 in outcome.output_text, "stop or go on" not in outcome.output_text, detail=outcome.output_text)


def test_a_main_agent_merging_a_worker_keeps_its_own_line(worker_command):
    story, _, worker, _ = worker_command
    outcome = story.run(f'worker send {agent_number(story, worker.id)} "The receipt"', actor=story.agent)
    story.expect_rows("command accepted" in outcome.output_text, GO_ON_WITH_TASK_2 not in outcome.output_text, STOP_AND_WAIT not in outcome.output_text, detail=outcome.output_text)


def test_a_worker_is_not_given_a_task_of_a_plan(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('plan make "Receipts" --brief "Print receipts"', actor=story.agent)
    story.expect_success('phase make --plan 1 "Print" --goal "Receipts print"', actor=story.agent)
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --phase 1', actor=story.agent)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_task_with_no_complexity(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --environment main', actor=story.agent)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_given_the_most_urgent_free_task(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success('task make "Weigh the parcel" --brief "Weigh it" --complexity 2 --priority high --environment main', actor=story.agent)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_text("task show 3", f"delegated_to: {worker.id}", actor=story.agent)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_that_still_has_an_open_task_of_its_own_is_given_no_free_task(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success('task make "Weigh the parcel" --brief "Weigh it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task 3", actor=story.agent)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_free_task_of_complexity_four(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 4 --environment main', actor=story.agent)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_task_that_waits_on_another(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success('task make "Weigh the parcel" --brief "Weigh it" --complexity 4 --environment main', actor=story.agent)
    story.expect_success("task depend 2 --on 3", actor=story.agent)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_task_reserved_for_the_main_agent(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success(f"task assign 2 --to {agent_number(story, story.agent.id)}", actor=story.agent)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_text("task show 2", f"delegated_to: {story.agent.id}", actor=story.agent)

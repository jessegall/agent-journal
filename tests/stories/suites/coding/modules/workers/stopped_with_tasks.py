from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.suites.coding.modules.workers.gone_workers import RESUMED_PID, missing_program, running_worker, start_launcher, worker_story
from tests.stories.suites.coding.modules.workers.queued_commands import worker_command

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


def expect_woken(story, launcher) -> None:
    launcher.drain_requests()
    story.expect_rows(len(launcher.starts) == 1, launcher.starts[0]["agent_id"] == story.worker.id, detail=str(launcher.requests))


def main_agent_lines(story) -> str:
    return story.run(f"agent-line list --agent {story.agent.id}").output_text


def waiting_lines_entered(story) -> None:
    rows = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.worker.id, state=AgentLineState.WAITING).all_rows()
    for row in rows:
        story.container.get(Bus).run(EnterAgentLine(row.id), Actor.core(), environment_id=1)


@pytest.fixture
def two_task_worker(running_worker):
    story = running_worker
    story.expect_success('task make "Print the receipt" --brief "Print it" --environment main', actor=story.agent)
    story.expect_success(f"worker send --wait {story.worker.id} --task 2", actor=story.agent)
    return story


@pytest.fixture
def blocked_worker(two_task_worker):
    story = two_task_worker
    story.expect_success('task block 1 --reason "waits on a person"', actor=story.agent)
    ended(story)
    return story


def test_a_stopped_worker_whose_current_task_is_blocked_is_woken_for_its_next_open_task(blocked_worker):
    expect_woken(blocked_worker, retried(blocked_worker))


def test_a_stopped_worker_whose_last_line_went_into_a_dying_program_is_woken_again(blocked_worker):
    waiting_lines_entered(blocked_worker)
    blocked_worker.advance(timedelta(minutes=1))
    expect_woken(blocked_worker, retried(blocked_worker))


def test_a_stopped_worker_with_a_started_task_whose_last_line_went_into_a_dying_program_is_woken_again(two_task_worker):
    ended(two_task_worker)
    waiting_lines_entered(two_task_worker)
    two_task_worker.advance(timedelta(minutes=1))
    expect_woken(two_task_worker, retried(two_task_worker))


def test_a_stopped_worker_is_told_which_task_it_goes_on_with(blocked_worker):
    expect_woken(blocked_worker, retried(blocked_worker))
    blocked_worker.expect_text(f"agent-line list --agent {blocked_worker.worker.id}", "you ended with tasks left")


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


def test_a_worker_that_keeps_ending_with_the_merger_on_is_named_to_the_main_agent_once(two_task_worker, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 0)
    story = two_task_worker
    story.expect_success(MERGER_ON, actor=story.user)
    ended(story)
    story.tick(MAIN_SESSION)
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(f"worker:{story.worker.id} ended with") == 1, detail=lines)


def test_a_worker_that_keeps_ending_with_a_blocked_current_task_names_its_open_task_to_the_main_agent(two_task_worker, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 0)
    story = two_task_worker
    story.expect_success('task block 1 --reason "waits on a person"', actor=story.agent)
    ended(story)
    waiting_lines_entered(story)
    story.advance(timedelta(minutes=1))
    launcher = retried(story)
    lines = main_agent_lines(story)
    story.expect_rows(launcher.requests == [], f"worker:{story.worker.id} ended with" in lines, "task:2" in lines, detail=lines)


def test_a_worker_handing_on_to_an_open_task_is_pointed_at_it(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --environment main', actor=story.agent)
    story.expect_success(f"worker send --wait {worker.id} --task 2", actor=story.agent)
    outcome = story.run("worker next --differences none", actor=worker)
    story.expect_rows(GO_ON_WITH_TASK_2 in outcome.output_text, "stop or go on" not in outcome.output_text, detail=outcome.output_text)


def test_a_worker_with_no_task_left_is_told_to_stop_and_that_it_will_hear(worker_command):
    story, _, worker, _ = worker_command
    outcome = story.run("worker deliver --differences none", actor=worker)
    story.expect_rows(STOP_AND_WAIT in outcome.output_text, "stop or go on" not in outcome.output_text, detail=outcome.output_text)


def test_a_main_agent_merging_a_worker_keeps_its_own_line(worker_command):
    story, _, worker, _ = worker_command
    outcome = story.run(f'worker send {worker.id} "The receipt"', actor=story.agent)
    story.expect_rows("command accepted" in outcome.output_text, GO_ON_WITH_TASK_2 not in outcome.output_text, STOP_AND_WAIT not in outcome.output_text, detail=outcome.output_text)


def test_a_worker_that_handed_in_its_last_task_is_given_the_next_free_task(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_task_of_a_plan(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('plan make "Receipts" --brief "Print receipts"', actor=story.agent)
    story.expect_success('phase make --plan 1 "Print" --goal "Receipts print"', actor=story.agent)
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --phase 1', actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_task_with_no_complexity(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --environment main', actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_given_the_most_urgent_free_task(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success('task make "Weigh the parcel" --brief "Weigh it" --complexity 2 --priority high --environment main', actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_text("task show 3", f"delegated_to: {worker.id}", actor=story.agent)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_free_task_of_complexity_four(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 4 --environment main', actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_task_that_waits_on_another(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success('task make "Weigh the parcel" --brief "Weigh it" --complexity 4 --environment main', actor=story.agent)
    story.expect_success("task depend 2 --on 3", actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_no_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_worker_is_not_given_a_task_reserved_for_the_main_agent(worker_command):
    story, _, worker, _ = worker_command
    story.expect_success('task make "Print the receipt" --brief "Print it" --complexity 2 --environment main', actor=story.agent)
    story.expect_success(f"task assign 2 --to {story.agent.id}", actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_text("task show 2", f"delegated_to: {story.agent.id}", actor=story.agent)

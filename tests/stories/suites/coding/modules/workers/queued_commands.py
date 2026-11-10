from engine.cli.shell_handoff import RUNNER_VARIABLE
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
from threading import Event
from time import monotonic
from typing import NamedTuple

import pytest

from engine.caller.caller_request import CallerRequest, SESSION_VARIABLE
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from engine.journal.journal_home import LAUNCHER_SOCKET
from engine.listener.commit_listener_runner import CommitListenerRunner
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.processes.support.queued_process_start import QueuedProcessStart
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.story import Story
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.modules.documents.support.trail_fixtures import SelectedTrail, Scenario
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository


class WorkerCommandStory(NamedTuple):
    story: Story
    repository: GitRepository
    worker: Actor
    launches: list[QueuedProcessStart]


@pytest.fixture
def worker_command(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    launches = []
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda _launch, start, _run: launches.append(start))
    return WorkerCommandStory(story, repository, worker, launches)


def run_operation(story, operation):
    process = story.row(Process, operation.process_id)
    agent = story.row(Agent, process.session_agent_id)
    request = CallerRequest({SESSION_VARIABLE: agent.session, "JOURNAL_PROCESS": str(operation.process_id), RUNNER_VARIABLE: str(operation.process_id)},
                            str(story.home.project_folder))
    return story.run_requested(f"worker-operation run {operation.worker_id}", request)


def end_operation(story, operation, exit_code=0):
    story.expect_success(f"process end {operation.process_id} --exit-code {exit_code} --bytes 0 --lines 0")


@contextmanager
def operation_story(story):
    running_story = Story.opened(story.home, story.state)
    try:
        yield running_story
    finally:
        running_story.close()


def run_operation_copy(story, operation):
    with operation_story(story) as running_story:
        return run_operation(running_story, operation)


@pytest.fixture
def worker_git_command(worker_command, name):
    story, repository, worker, _ = worker_command
    if name is WorkerOperationName.NEXT:
        task = story.new_row_id('task make "The next task" --brief "Add the receipt"', actor=story.agent)
        story.expect_success(f"worker send {worker.id} --wait --task {task}", actor=story.agent)
    if name is WorkerOperationName.MERGE:
        story.expect_success(DELIVERY, actor=worker)
        story.expect_success("proof check 1", actor=story.agent)
        story.expect_success(f"worker logs {worker.id}", actor=story.agent)
        repository.checkout(ENVIRONMENT_BRANCH)
    return worker_command


@pytest.mark.parametrize(("name", "method"), [(WorkerOperationName.NEXT, "rebased_commit"), (WorkerOperationName.DELIVER, "rebased_commit"),
                                               (WorkerOperationName.JOB, "sync"), (WorkerOperationName.MERGE, "merge")])
@pytest.mark.real_git
@pytest.mark.parametrize("queue_full", [False, True])
def test_worker_commands_return_before_slow_git_and_notify_once(worker_git_command, monkeypatch, name, method, queue_full):
    story, repository, worker, launches = worker_git_command
    if queue_full:
        story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main")
        bus = story.container.get(Bus)
        environment_id = story.row(Agent, worker.id).environment_id
        running_test = bus.run(StartProcess.single_part(worker.id, "pytest held.py", str(repository.folder), CommandCategory.TEST_RUN, 60),
                       Actor.core(), environment_id=environment_id)
        waiting = bus.run(StartProcess.single_part(worker.id, "pytest waiting.py", str(repository.folder), CommandCategory.TEST_RUN, 60),
                          Actor.core(), environment_id=environment_id)
        story.expect_rows(story.row(Process, running_test.id).slot_assigned,
                          story.row(Process, waiting.id).queued_at is not None)
    calls = []
    original = getattr(WorktreeGit, method)
    git_blocked, git_continue = Event(), Event()

    def slow_git(git, *args, **kwargs):
        calls.append(method)
        git_blocked.set()
        story.expect_rows(git_continue.wait(10), detail="the test did not release git")
        return original(git, *args, **kwargs)

    monkeypatch.setattr(WorktreeGit, method, slow_git)
    original_command_output = Bus.result
    completed_commands = []

    def checked_result(bus, value, command):
        if type(command).__name__ in ("StartNextWorkerTask", "DeliverTask", "SendWorker", "MergeWorker"):
            story.expect_rows(bus.database.has_transaction == command.lock,
                              detail=f"{command.label()} must own its transaction setting")
            completed_commands.append(command)
        return original_command_output(bus, value, command)

    monkeypatch.setattr(Bus, "result", checked_result)
    line = f"worker {name} --differences none" if name.is_handoff else f'worker {name} {worker.id}'
    if name is WorkerOperationName.JOB:
        line += ' "Add the receipt"'
    actor = worker if name.is_handoff else story.agent
    started_at = monotonic()
    story.expect_text(line, "command accepted", actor=actor)
    accepted_seconds = monotonic() - started_at
    story.expect_rows(calls == [], len(launches) == 1)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    process = story.row(Process, operation.process_id)
    part = story.container.get(Queries).query(ProcessPart).filter(process_id=process.id).first()
    story.expect_rows(process.category is CommandCategory.BACKGROUND_JOB, not process.is_queue_run,
                      not process.slot_assigned, process.queued_at is None, part.is_visible)
    started_at = monotonic()
    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(run_operation_copy, story, operation)
        try:
            if not git_blocked.wait(10):
                future.result(timeout=10)
            story.expect_rows(git_blocked.is_set(), not future.done())
        finally:
            git_continue.set()
        outcome = future.result(timeout=10)
    finished_seconds = monotonic() - started_at
    story.expect_rows(outcome.code == 0, calls == [method], len(completed_commands) == 1,
                      detail=outcome.output_text)
    print(f"{name}: accepted {accepted_seconds:.3f}s; synchronous work {finished_seconds:.3f}s")
    with operation_story(story) as ending_story:
        end_operation(ending_story, operation)
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=actor.id).all_rows()
    notifications = [line for line in lines if line.nudge.key.startswith("workers.operation_")]
    story.expect_rows(len(notifications) == 1, story.row(WorkerOperation, operation.id).ended_at is not None)


@pytest.mark.real_git
@pytest.mark.parametrize("name", [WorkerOperationName.MERGE])
def test_a_merge_that_succeeds_makes_no_conflict_line_when_the_worker_has_a_next_task(worker_git_command):
    story, _, worker, _ = worker_git_command
    task = story.new_row_id('task make "The next task" --brief "Add the receipt"', actor=story.agent)
    story.expect_success(f"worker send {worker.id} --wait --task {task}", actor=story.agent)
    story.expect_text(f"worker merge {worker.id}", "command accepted", actor=story.agent)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    outcome = run_operation_copy(story, operation)
    story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    with operation_story(story) as ending_story:
        end_operation(ending_story, operation)
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows()
    keys = [line.nudge.key for line in lines if line.nudge.key.startswith("workers.operation_")]
    story.expect_rows(keys == ["workers.operation_merged"], detail=str(keys))


def test_a_second_command_on_the_same_worker_is_refused(worker_command):
    story, _, worker, launches = worker_command
    story.expect_text('worker deliver --differences none', "command accepted", actor=worker)
    story.expect_refusal(f'worker send {worker.id} "Another job"', "has a command running", actor=story.agent)
    story.expect_refusal(f'worker send {worker.id} --wait "Another job"', "has a command running", actor=story.agent)
    story.expect_rows(len(launches) == 1)


@pytest.mark.real_git
def test_a_failed_background_command_releases_the_worker_and_names_its_output(worker_command, monkeypatch):
    story, _, worker, _ = worker_command
    story.expect_text('worker deliver --differences none', "command accepted", actor=worker)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()

    def failed_git(*args, **kwargs):
        raise Refusal("the base branch has a conflict")

    monkeypatch.setattr(WorktreeGit, "rebased_commit", failed_git)
    outcome = run_operation(story, operation)
    story.expect_rows(outcome.code == 1, "the base branch has a conflict" in outcome.output_text)
    end_operation(story, operation, 1)
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.id).all_rows()
    notifications = [line for line in lines if line.nudge.key == "workers.operation_failed"]
    story.expect_rows(len(notifications) == 1, str(operation.process_id) in notifications[0].text)
    story.expect_rows(story.row(WorkerOperation, operation.id).ended_at is not None)


def test_a_worker_command_starts_in_the_urgent_round_while_the_ordinary_listeners_wait(worker_command, monkeypatch):
    story, _, worker, launches = worker_command
    monkeypatch.setattr(CommitListenerRunner, "run", lambda _runner: None)
    story.expect_text('worker deliver --differences none', "command accepted", actor=worker)
    story.expect_rows(launches == [])
    story.container.get(CommitListenerRunner).run_urgent()
    story.expect_rows(len(launches) == 1)


def test_a_worker_command_lost_before_it_started_tells_the_worker_and_can_be_given_again(worker_command):
    story, _, worker, launches = worker_command
    story.expect_text('worker deliver --differences none', "command accepted", actor=worker)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    story.container.get(Bus).run(OrphanProcess(operation.process_id), Actor.core(), environment_id=story.row(Agent, worker.id).environment_id)
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.id).all_rows()
    notifications = [line for line in lines if line.nudge.key == "workers.operation_never_started"]
    story.expect_rows(len(notifications) == 1, str(operation.process_id) in notifications[0].text,
                      story.row(WorkerOperation, operation.id).ended_at is not None)
    story.expect_text('worker deliver --differences none', "command accepted", actor=worker)
    story.expect_rows(len(launches) == 2)


def test_missing_proofs_are_refused_before_creating_a_background_process(worker_command):
    story, _, worker, launches = worker_command
    story.expect_success('task edit 1 --brief "- Add the total\n- Round to cents"', actor=story.agent)
    story.expect_refusal('worker deliver --differences none', "point 2 has no proof", actor=worker)
    story.expect_rows(launches == [], story.container.get(Queries).query(WorkerOperation).count() == 0)


def test_a_worker_can_stop_after_hand_in_and_resumes_when_the_command_ends(worker_command):
    story, _, worker, _ = worker_command
    story.expect_text('worker deliver --differences none', "command accepted", actor=worker)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    story.expect_success(f"agent end {worker.id}", actor=worker)
    story.expect_rows(story.row(Agent, worker.id).ended_at is not None)
    outcome = run_operation(story, operation)
    story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"started 123456789\n", request_count=1)
    try:
        end_operation(story, operation)
        story.run_listeners()
        story.expect_rows(len(launcher.starts) == 1, story.row(Agent, worker.id).ended_at is None)
    finally:
        launcher.server.close()


def test_an_accepted_command_cannot_execute_twice(worker_command):
    story, _, worker, _ = worker_command
    story.expect_text(f'worker send {worker.id} "The receipt"', "command accepted", actor=story.agent)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    story.expect_rows(run_operation(story, operation).code == 0)
    second = run_operation(story, operation)
    story.expect_rows(second.code == 1, "already started" in second.output_text)


def test_a_launcher_failure_is_kept_in_the_output_and_releases_the_reservation(worker_command, monkeypatch):
    story, _, worker, _ = worker_command

    def cannot_start(*args, **kwargs):
        raise OSError("runner was removed")

    monkeypatch.setattr(QueuedProcessLaunch, "start", cannot_start)
    story.expect_text('worker deliver --differences none', "command accepted", actor=worker)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    story.expect_rows(operation.ended_at is not None)
    story.expect_text(f"output read {operation.process_id} --tail 5", "runner was removed", actor=worker)


@pytest.mark.parametrize("requester_ends", [False, True], ids=["requester-running", "requester-stopped"])
def test_a_queued_send_keeps_the_request_selected_when_it_was_accepted(new_story, monkeypatch, requester_ends):
    story = new_story(fixture=SelectedTrail)
    scenario = Scenario(story)
    story.expect_success("setting set journal.suites.coding.auto-mode off --environment main")
    repository_environment(story)
    worker = dispatched_worker(story)
    scenario.switch(1)
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda *_args: None)
    story.expect_text(f'worker send {worker.id} "Use the original request"', "command accepted", actor=story.agent)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    scenario.switch(2)
    if requester_ends:
        story.expect_success(f"agent end {story.agent.id}", actor=story.agent)
    outcome = run_operation(story, operation)
    story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    assigned = story.container.get(Queries).query(WorkerTaskSource).filter(worktree_id=1).newest().first()
    story.expect_rows(assigned.source_message_id == 1)
    scenario.expect_source(2)
    if not requester_ends:
        scenario.command('task make "Parent continues" --environment main')
        scenario.expect_link("message:2", "task:2", "about")
        scenario.expect_no_link("message:1", "task:2")

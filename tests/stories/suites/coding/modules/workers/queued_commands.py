from time import monotonic, sleep

import pytest

from core.base.caller.caller_request import CallerRequest, SESSION_VARIABLE
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


@pytest.fixture
def worker_command(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    launches = []
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda _launch, *args: launches.append(args))
    return story, repository, worker, launches


def run_operation(story, operation):
    agent = story.row(Agent, operation.creator_id)
    request = CallerRequest({SESSION_VARIABLE: agent.session, "JOURNAL_PROCESS": str(operation.process_id)},
                            str(story.home.project_folder))
    return story.run_requested(f"worker-operation run {operation.worker_id}", request)


def end_operation(story, operation, exit_code=0):
    story.expect_success(f"process end {operation.process_id} --exit-code {exit_code} --bytes 0 --lines 0")


@pytest.mark.parametrize(("name", "method"), [("next", "rebased_commit"), ("deliver", "rebased_commit"),
                                               ("send", "sync"), ("merge", "merge")])
def test_worker_commands_return_started_at_slow_git_and_notify_once(worker_command, monkeypatch, name, method):
    story, repository, worker, launches = worker_command
    if name == "next":
        task = story.new_row_id('task make "The next task" --brief "Add the receipt"', actor=story.agent)
        story.expect_success(f"worker send {worker.id} --wait --task {task}", actor=story.agent)
    if name == "merge":
        story.expect_success(DELIVERY, actor=worker)
        story.expect_success("proof check 1", actor=story.agent)
        story.expect_success(f"worker logs {worker.id}", actor=story.agent)
        repository.checkout(ENVIRONMENT_BRANCH)
    calls = []
    original = getattr(WorktreeGit, method)

    def slow_git(git, *args, **kwargs):
        calls.append(method)
        sleep(0.15)
        return original(git, *args, **kwargs)

    monkeypatch.setattr(WorktreeGit, method, slow_git)
    line = f"worker {name} --differences none" if name in ("next", "deliver") else f'worker {name} {worker.id}'
    if name == "send":
        line += ' "Add the receipt"'
    actor = worker if name in ("next", "deliver") else story.agent
    started_at = monotonic()
    story.expect_text(line, "command accepted", actor=actor)
    accepted_seconds = monotonic() - started_at
    story.expect_rows(calls == [], len(launches) == 1)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    started_at = monotonic()
    outcome = run_operation(story, operation)
    finished_seconds = monotonic() - started_at
    story.expect_rows(outcome.code == 0, calls == [method], detail=outcome.output_text)
    print(f"{name}: accepted {accepted_seconds:.3f}s; synchronous work {finished_seconds:.3f}s")
    end_operation(story, operation)
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=actor.id).all_rows()
    notifications = [line for line in lines if line.nudge.key == "workers.operation_ended"]
    story.expect_rows(len(notifications) == 1, story.row(WorkerOperation, operation.id).ended_at is not None)


def test_a_second_command_on_the_same_worker_is_refused(worker_command):
    story, _, worker, launches = worker_command
    story.expect_text('worker deliver --differences none', "command accepted", actor=worker)
    story.expect_refusal(f'worker send {worker.id} "Another job"', "has a command running", actor=story.agent)
    story.expect_refusal(f'worker send {worker.id} --wait "Another job"', "has a command running", actor=story.agent)
    story.expect_rows(len(launches) == 1)


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


def test_missing_proofs_are_refused_started_at_creating_a_background_process(worker_command):
    story, _, worker, launches = worker_command
    story.expect_success('task edit 1 --brief "- Add the total\n- Round to cents"', actor=story.agent)
    story.expect_refusal('worker deliver --differences none', "point 2 has no proof", actor=worker)
    story.expect_rows(launches == [], story.container.get(Queries).query(WorkerOperation).count() == 0)

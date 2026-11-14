from tests.stories.core.support.agent_labels import agent_number
import subprocess

import pytest

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.process import Process
from core.modules.processes.errors.missing_runner_error import MissingRunnerError
from core.modules.processes.support.runner_binary import RunnerBinary
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, dispatched_story_worker, start_planned_worker
from tests.stories.support.story_checks import expect_value, expect_value_with
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch



PYTHON = "--test-command python=pytest"
VITE = '--test-command "vite=npx vitest run"'
GOLANG = '--test-command "go-journal=go -C tools/journal test -count=1"'
COMMANDS_DISPATCH = f"worker dispatch --model sonnet 1 {PYTHON} {VITE} {GOLANG}"
BARE_DISPATCH = "worker dispatch --model sonnet 1"
PERSON_DISPATCH = "worker dispatch --program claude --model sonnet 1"
PYTHON_RUN = "worker test python tests/cart.py"


def worker_test_part(*test_arguments: str) -> ShellPart:
    return ShellPart("journal", CommandCategory.JOURNAL, ["worker", "test", *test_arguments])


@pytest.fixture
def task_story(played):
    story = played(OrchestratorWithPerson)
    repository_environment(story)
    return story


@pytest.fixture
def worker_with_commands(task_story):
    return dispatched_story_worker(task_story, COMMANDS_DISPATCH)


@pytest.fixture
def runner_starts(worker_with_commands, monkeypatch):
    """Every start of the real runner, by the real launch that a dispatched story worker otherwise has faked."""
    starts = []
    worker_with_commands.story.unbind(WorkerTestLaunch)
    monkeypatch.setattr(RunnerBinary, "is_installed", lambda _runner: True)
    monkeypatch.setattr(subprocess, "Popen", lambda command, **options: starts.append((command, options)))
    return starts


@pytest.fixture
def worker_without_commands(task_story, monkeypatch):
    task_story.run('task make "Tax" --brief "The tax" --environment main', actor=task_story.agent)
    return person_dispatched_worker(task_story, monkeypatch)


def person_dispatched_worker(story, monkeypatch):
    agent = story.agent
    story.agent = story.user
    try:
        return dispatched_story_worker(story, PERSON_DISPATCH)
    finally:
        story.agent = agent


def worker_runs(worker):
    return tuple(worker.story.story_rows(Process, owner_agent_id=worker.worker.id))


def started_lines(worker):
    return [process.line for process in worker_runs(worker)]


def test_a_named_test_run_starts_through_the_runner_in_the_worktree_once_it_is_saved(worker_with_commands, runner_starts, monkeypatch):
    worker_with_commands.story.expect_success(PYTHON_RUN, actor=worker_with_commands.worker)
    worker_with_commands.story.run_listeners()
    process = worker_runs(worker_with_commands)[-1]
    command, options = runner_starts[0]
    expect_value_with(command, f"--process {process.id}")
    expect_value_with(command, "pytest tests/cart.py")
    expect_value(options["cwd"], str(worker_with_commands.repository.worktree_folder(worker_with_commands.worker.id)))
    monkeypatch.setattr(RunnerBinary, "is_installed", lambda _runner: False)
    with pytest.raises(MissingRunnerError, match="not installed"):
        worker_with_commands.story.container.get(WorkerTestLaunch).start_waited(process, "pytest tests/cart.py", "s-1")














GOLANG_TEST_ARGUMENTS = ["./launch", "./event/...", "-run TestLaunch", "-run=TestLaunch ./launch"]






@pytest.fixture
def phase_worker(played, monkeypatch):
    return start_planned_worker(played, monkeypatch, PHASE_DISPATCH)


def worker_test_hook(worker, *test_arguments):
    return worker.run_line("journal worker test " + " ".join(test_arguments), worker_test_part(*test_arguments))





from tests.stories.core.support.agent_labels import agent_number
import os
import subprocess
from pathlib import Path
from threading import Event
from typing import NamedTuple
from unittest.mock import patch

import pytest

from engine.actor.actor import Actor
from engine.caller.caller_request import SESSION_VARIABLE
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from engine.testing.stories.story import Story
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.server.support.go_build import GoBuild
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import (
    CART_CHANGE, FIRST_PROOF, dispatched_worker, repository_environment,
)


class WorkerRunnerStory(NamedTuple):
    story: Story
    worker: Actor
    binary: Path
    variables: dict[str, str]


@pytest.fixture
def worker_runner(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    binary_folder = story.home.folder / "bin"
    binary_folder.mkdir(exist_ok=True)
    binary = GoBuild.built("journal", binary_folder / "journal")
    GoBuild.built("journal-run", binary_folder / "journal-run")
    variables = GoBuild.environment(JOURNAL_HOME=str(story.home.folder),
                                    PATH=f"{binary_folder}{os.pathsep}{os.environ['PATH']}")
    with patch.dict(os.environ, variables, clear=True), server_story(story):
        yield WorkerRunnerStory(story, worker, binary, variables)


@pytest.mark.real_git
@pytest.mark.parametrize("command_name", ["send", "next", "deliver"])
def test_a_queued_worker_command_runs_through_the_real_runner_and_cli(worker_runner, monkeypatch, command_name):
    story, worker, binary, variables = worker_runner
    children, spawned = [], Event()
    original_popen = subprocess.Popen

    def recorded_popen(arguments, *args, **kwargs):
        child = original_popen(arguments, *args, **kwargs)
        if isinstance(arguments, str) and str(binary.with_name("journal-run")) in arguments:
            children.append(child)
            spawned.set()
        return child

    monkeypatch.setattr(subprocess, "Popen", recorded_popen)
    arguments = ["worker", command_name, "--differences", "none"]
    actor = worker
    task_id = None
    if command_name != "deliver":
        task_id = story.new_row_id('task make "The next cart change" --brief "Add the receipt"', actor=story.agent)
    if command_name == "next":
        story.expect_success(f"worker send {agent_number(story, worker.id)} --wait --task {task_id}", actor=story.agent)
    if command_name == "send":
        arguments = ["worker", "send", str(worker.id), "--task", str(task_id)]
        actor = story.agent
    agent = story.row(Agent, actor.id)
    accepted = subprocess.run([str(binary), *arguments], capture_output=True, text=True, timeout=20,
                              env={**variables, SESSION_VARIABLE: agent.session}, cwd=story.home.project_folder)
    story.expect_rows(accepted.returncode == 0, "command accepted" in accepted.stdout,
                      detail=accepted.stdout + accepted.stderr)
    operation = story.container.get(Queries).query(WorkerOperation).filter(worker_id=worker.id).newest().first()
    story.expect_rows(spawned.wait(20), detail="the queued command did not start its runner")
    story.expect_rows(len(children) == 1, children[0].wait(timeout=20) == 0)
    process = story.row(Process, operation.process_id)
    output = story.run(f"output read {process.id} --all", actor=worker).output_text
    story.expect_rows(story.row(WorkerOperation, operation.id).started_at is not None,
                      story.row(WorkerOperation, operation.id).ended_at is not None,
                      process.session_agent_id == worker.id, process.exit_code == 0, detail=output)
    if command_name == "next":
        story.expect_text(f"task show {task_id}", "state: started", f"holder_id: {worker.id}")
    if command_name == "send":
        story.expect_text(f"task show {task_id}", f"delegated_to: {worker.id}")
    if command_name == "deliver":
        story.expect_text("worker-worktree show 1", "state: delivered")

from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.core.support.agent_labels import agent_number
from core.modules.agents.support.agent_conversations import AgentConversations
from datetime import timedelta
from pathlib import Path
import json
import shlex

import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.file.file_access import FileAccess
from engine.journal.journal_home import LAUNCHER_SOCKET
from engine.json.json_settings import JsonSettings
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.agents.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository


@pytest.mark.parametrize(("program", "model"), [("claude", "sonnet"), ("codex", "gpt-6.1-sol")])
@pytest.mark.parametrize("answer", [b"started 123456789\n", b"started\n"], ids=["with-pid", "without-pid"])
@pytest.mark.parametrize("merged", [False, True], ids=["open-worktree", "merged-worktree"])
def test_a_task_sent_to_a_stopped_worker_resumes_it_once(new_story, monkeypatch, program, model, merged, answer):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = GitRepository.sample(story.home.project_folder)
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(repository.folder))} --branch {ENVIRONMENT_BRANCH}")
    worker_name = f"{program.title()}{'Merged' if merged else 'Open'}{'Pid' if b'123456789' in answer else 'Bare'}"
    worker = checked_worker(story, repository, f"worker dispatch --test-command python=pytest --program {program} --model {model} --name {worker_name} 1")
    if merged:
        repository.checkout(ENVIRONMENT_BRANCH)
        request_merge(story, worker)
        story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    else:
        story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    task_id = story.new_row_id('task make "The next task" --brief "Keep the total in cents"', actor=story.agent)
    path = repository.folder / ".codex/hooks.json"
    if merged:
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, json.dumps({"hooks": {}}))
        JsonSettings.loaded.cache_clear()
    reads = []
    original = FileAccess.binary

    def read_hook_file(access, file):
        if Path(file).resolve() == path.resolve():
            reads.append(str(file))
        return original(access, file)

    monkeypatch.setattr(FileAccess, "binary", read_hook_file)
    monkeypatch.setattr(AgentConversations, "exists", lambda conversations, agent: True)
    launches = []
    original_hand = AgentLauncher.hand

    def start_once(launcher, agent, environment, command):
        launches.append(agent.id)
        return original_hand(launcher, agent, environment, command)

    monkeypatch.setattr(AgentLauncher, "hand", start_once)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=answer, request_count=1)
    try:
        story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", actor=story.agent)
        story.run_listeners()
        if not merged:
            story.expect_rows(not launcher.starts, not launches, detail=str(launches))
            repository.checkout(ENVIRONMENT_BRANCH)
            request_merge(story, worker)
            story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
            story.run_listeners()
        story.expect_rows(len(launcher.starts) == 1, launches == [worker.id], detail=str(launches))
        launch = launcher.starts[0]
        story.expect_rows(launch["session"] == worker_session(story, worker), detail=launch["session"])
        story.expect_rows("--resume" in launch["command"] or "resume" in launch["command"])
        story.expect_rows(any(f"task overview {task_id}" in argument for argument in launch["command"]))
        job = story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.id, source=WORKER_JOB_SOURCE).newest().first()
        story.expect_rows(job.state is (AgentLineState.ENTERED if b"123456789" in answer else AgentLineState.WAITING), detail=str(job))
        story.expect_rows(story.row(Agent, worker.id).ended_at is None, detail=str(story.row(Agent, worker.id)))
        if merged:
            story.expect_rows(len(reads) == 1, detail=str(reads))
    finally:
        launcher.server.close()


def stopped_worker_with_entered_job(story) -> Actor:
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=1))
    bus = story.container.get(Bus)
    bus.run(RecordAgentNotice(worker.id, "An earlier task", WORKER_JOB_SOURCE), Actor.core(), environment_id=1)
    line = story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.id, source=WORKER_JOB_SOURCE).newest().first()
    bus.run(EnterAgentLine(line.id), Actor.core(), environment_id=1)
    repository.checkout(ENVIRONMENT_BRANCH)
    return worker


def test_an_entered_line_without_a_process_does_not_block_a_new_task_start(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = stopped_worker_with_entered_job(story)
    task_id = story.new_row_id('task make "Another task" --brief "Read the totals"', actor=story.agent)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"started 123456789\n")
    try:
        story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", actor=story.agent)
        story.run_listeners()
        story.expect_rows(not launcher.starts)
        request_merge(story, worker)
        story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
        story.run_listeners()
        story.expect_rows(len(launcher.starts) == 1)
        story.expect_rows(story.row(Agent, worker.id).ended_at is None)
        story.expect_rows(any(f"task overview {task_id}" in argument for argument in launcher.starts[0]["command"]))
    finally:
        launcher.server.close()

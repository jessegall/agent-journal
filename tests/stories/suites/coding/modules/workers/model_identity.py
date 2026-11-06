import json
from datetime import timedelta

import pytest

from core.base.journal_home import LAUNCHER_SOCKET
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment, worker_session
from core.testing.fake_launcher import FakeLauncher


def expect_identity(story, worker, model):
    story.expect_text(f"agent show {worker.id}", f"program_model: {model}")
    facts = json.loads(story.run("usage agents --environment main --closed --json").output_text)["rows"]
    card = next(row for row in facts if row["id"] == worker.id)
    story.expect_rows(card["model"] == model, card["effort"] == "high")


@pytest.mark.parametrize("program,model,flag", [("claude", "sonnet", "--model"), ("codex", "gpt-6.1-sol", "-m")])
def test_dispatch_send_resume_and_restart_keep_the_model_on_the_command_and_card(new_story, monkeypatch, program, model, flag):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    monkeypatch.setenv("CODEX_HOME", str(story.home.folder / "codex"))
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answers=(b"started\n", b"failed\n"), request_count=5)
    worker = checked_worker(story, repository, f"worker dispatch --program {program} --model {model} 1")
    session = worker_session(story, worker)
    rollout = story.home.folder / "codex" / "sessions" / f"rollout-test-{session}.jsonl"
    rollout.parent.mkdir(parents=True)
    rollout.write_text(json.dumps({"type": "turn_context", "payload": {"effort": "high"}}) + "\n")
    story.run_listeners()
    expect_identity(story, worker, model)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    story.expect_success(f'worker send {worker.id} "Add the tax"', actor=story.agent)
    story.run_listeners()
    expect_identity(story, worker, model)
    for _ in range(2):
        WorkerResumeRetry()(story.container)
        expect_identity(story, worker, model)
    launcher.expect_started(worker.id, session, repository.worktree_folder(worker.id))
    story.expect_rows(len(launcher.starts) == 4)
    for request in launcher.starts:
        command = request["command"]
        story.expect_rows(command[command.index(flag) + 1] == model)

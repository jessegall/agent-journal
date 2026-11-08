import json
from datetime import timedelta

import pytest

from core.base.journal_home import LAUNCHER_SOCKET
from core.base.actor import Actor
from core.base.actor_type import ActorType
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment, worker_session
from core.testing.fake_launcher import FakeLauncher
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


def expect_identity(story, worker, model):
    story.expect_text(f"agent show {worker.id}", f"program_model: {model}")
    facts = json.loads(story.run("usage agents --environment main --closed --json").output_text)["rows"]
    card = next(row for row in facts if row["id"] == worker.id)
    story.expect_rows(card["model"] == model, card["effort"] == "high")


@pytest.fixture
def identity_story(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    with viewer_client(story) as viewer:
        viewer.value('settings.settings', ['setting', 'set', 'journal.suites.coding.workers.merger-on', 'false', '--project'])
    return story


@pytest.mark.parametrize("program,model,flag", [("claude", "sonnet", "--model"), ("codex", "gpt-6.1-sol", "-m")])
def test_dispatch_send_resume_and_restart_keep_the_model_on_the_command_and_card(identity_story, monkeypatch, program, model, flag):
    story = identity_story
    repository = repository_environment(story)
    monkeypatch.setenv("CODEX_HOME", str(story.home.folder / "codex"))
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET),
                            answers=(b"started\n", b"started\n", b"failed\n", b"started\n"), request_count=4)
    worker = checked_worker(story, repository, f"worker dispatch --program {program} --model {model} 1")
    session = worker_session(story, worker)
    if program == "codex":
        rollout = story.home.folder / "codex" / "sessions" / "2026" / "11" / "06" / f"rollout-2026-11-06T18-31-51-{session}.jsonl"
        rollout.parent.mkdir(parents=True)
        rollout.write_text(json.dumps({"type": "turn_context", "payload": {"effort": "high"}}) + "\n")
    story.run_listeners()
    expect_identity(story, worker, model)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    story.expect_success(f'worker send --wait {worker.id} "Add the tax"', actor=story.agent)
    story.run_listeners()
    expect_identity(story, worker, model)
    for _ in range(2):
        WorkerResumeRetry()(story.container)
        expect_identity(story, worker, model)
    launcher.expect_started(worker.id, session, repository.worktree_folder(worker.id))
    story.expect_rows(len(launcher.starts) == 3)
    for request in launcher.starts:
        command = request["command"]
        story.expect_rows(command[command.index(flag) + 1] == model)

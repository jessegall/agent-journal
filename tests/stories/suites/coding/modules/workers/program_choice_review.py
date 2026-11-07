import json
import shlex
import subprocess

import pytest

from core.base.journal_home import LAUNCHER_SOCKET
from core.base.provider.program_hooks import ProgramHooks
from core.base.query.queries import Queries
from core.modules.codex.providers.codex_provider import CodexProvider
from core.modules.drivers.models.hook_call import HookCall
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.server.support.go_build import GoBuild
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session


@pytest.mark.parametrize(("program", "model"), [pytest.param("codex", "gpt-6.1-sol", id="S68")])
def test_codex_hooks_run_in_the_worker_folder(new_story, monkeypatch, program, model):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    (story.home.project_folder / ".journal").symlink_to(story.home.folder, target_is_directory=True)
    monkeypatch.setenv("CODEX_HOME", str(story.home.folder / "codex-home"))
    binary = GoBuild.built("journal-hook", story.home.folder / "journal-hook-test")
    ProgramHooks.hooks(CodexProvider, repository.folder).write(shlex.quote(str(binary)), story.home.project_folder)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"started\n")
    worker = dispatched_worker(story, f"worker dispatch --program {program} --model {model} 1")
    story.run_listeners()
    folder = repository.worktree_folder(worker.id)
    session = worker_session(story, worker)
    launcher.expect_started(worker.id, session, folder)
    story.expect_rows("--dangerously-bypass-hook-trust" in launcher.starts[0]["command"])
    story.expect_success(f"program trust codex {shlex.quote(str(folder))}", "untrusted")
    hooks = ProgramHooks.hooks(CodexProvider, folder).settings()["hooks"]
    path = folder / "cart.py"
    environment = GoBuild.environment(**launcher.starts[0]["variables"])
    with server_story(story):
        for event, body in [("SessionStart", {"source": "startup"}),
                            ("PreToolUse", {"tool_name": "read_file", "tool_input": {"path": str(path)}})]:
            command = hooks[event][0]["hooks"][0]["command"]
            finished = subprocess.run(shlex.split(command), cwd=folder,
                                      input=json.dumps({"session_id": session, "hook_event_name": event, "cwd": str(folder), **body}),
                                      capture_output=True, text=True, timeout=30, env=environment)
            story.expect_rows(finished.returncode == 0, detail=finished.stderr)
    calls = tuple(story.container.get(Queries).query(HookCall).filter(session_agent_id=worker.id, tool="read_file").all_rows())
    story.expect_rows(len(calls) == 1)
    story.expect_rows(calls[0].folder == str(folder), calls[0].summary == str(path))
    story.expect_success(f"program trust codex {shlex.quote(str(folder))}", "untrusted")

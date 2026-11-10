import json
import tomllib

import pytest

from engine.journal.journal_home import LAUNCHER_SOCKET
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from core.modules.agents.testing.fake_launcher import FakeLauncher

__all__ = ["private_folder"]

KEY = "worker-test-key-6375"
VARIABLE = "GITHUB_PERSONAL_ACCESS_TOKEN"


@pytest.mark.real_git
@pytest.mark.parametrize("program,model", [("claude", "sonnet"), ("codex", "gpt-6.1-sol")])
def test_workers_receive_the_main_agents_servers_and_keys_outside_the_prompt(new_story, private_folder, program, model):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
    repository = repository_environment(story)
    for name in ("playwright", "github", "linear"):
        story.expect_success(f"mcp install {name}", actor=story.user)
    story.expect_success(f"mcp key github {KEY}", actor=story.user)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"started\n", request_count=3)
    worker = dispatched_worker(story, f"worker dispatch --test-command python=pytest --program {program} --model {model} 1")
    story.run_listeners()
    folder = repository.worktree_folder(worker.id)
    claude = folder / ".mcp.json"
    codex = folder / ".codex/config.toml"
    story.expect_rows(claude.is_file(), codex.is_file())
    story.expect_rows(json.loads(claude.read_text())["mcpServers"] == json.loads((story.home.project_folder / ".mcp.json").read_text())["mcpServers"],
                      tomllib.loads(codex.read_text())["mcp_servers"] == tomllib.loads((story.home.project_folder / ".codex/config.toml").read_text())["mcp_servers"])
    story.expect_rows(json.loads(claude.read_text())["mcpServers"]["playwright"]["args"] == ["-y", "@playwright/mcp@latest", "--headless"],
                      launcher.requests[0]["variables"][VARIABLE] == KEY,
                      KEY not in json.dumps(launcher.requests[0]["command"]),
                      KEY not in claude.read_text(), KEY not in codex.read_text(),
                      KEY.encode() not in story.home.database.read_bytes(),
                      len(list(private_folder.glob("*.keys.json"))) == 1)
    story.expect_rows(repository.git("status", "--porcelain", folder=folder).stdout == "")
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    story.expect_success("mcp remove github", actor=story.user)
    story.expect_success("mcp install context7", actor=story.user)
    story.expect_success(f'worker send --wait {worker.id} "Continue with the updated servers"', actor=story.agent)
    story.run_listeners()
    launcher.expect_started(worker.id, worker_session(story, worker), folder)
    story.expect_rows(len(launcher.starts) == 2,
                      set(json.loads(claude.read_text())["mcpServers"]) == {"playwright", "linear", "context7"},
                      set(tomllib.loads(codex.read_text())["mcp_servers"]) == {"playwright", "linear", "context7"},
                      VARIABLE not in launcher.starts[1]["variables"])

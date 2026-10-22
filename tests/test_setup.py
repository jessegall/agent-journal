"""journal setup wires a project: hooks for Claude, the skills, the law in AGENTS.md, the import in CLAUDE.md. Real files in a temp root; the command lands inside the project."""

import json
from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.console.commands.setup_command import SetupCommand
from journal.support.caller import Caller


@pytest.fixture
def app(tmp_path: Path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    (tmp_path / "home" / ".local" / "bin").mkdir(parents=True)
    return App(Config(tmp_path, port=0))


def test_setup_wires_hooks_skills_and_the_law(app: App, monkeypatch):
    import shutil
    monkeypatch.setattr(shutil, "which", lambda name: None)
    root = app.config.root
    (root / "AGENTS.md").write_text("# my project\n\nMy own rules.\n")
    output = app.console().run(["setup"], Caller.user("main")).text
    settings = json.loads((root / ".claude/settings.json").read_text())
    assert "SessionStart" in settings["hooks"] and "MessageDisplay" in settings["hooks"]
    command = settings["hooks"]["PreToolUse"][0]["hooks"][0]["command"]
    assert command.startswith("test -f ") and f"hook.sh claude {root}; exit 0" in command and settings["statusLine"]["command"].endswith("status.sh")
    assert (root / ".claude/skills/journal/SKILL.md").is_file() and (root / ".agents/skills/journal-tasks/SKILL.md").is_file()
    assert (root / ".claude/agents/journal-researcher.md").read_text().startswith("---\nname: journal-researcher")
    agents = (root / "AGENTS.md").read_text()
    assert agents.startswith("# my project") and "My own rules." in agents and "L9 - A subagent only reads" in agents
    assert "L10 - A worker's work is merged only once each point of its task's brief has a proof you checked." in agents, "the law says a worker's work is merged only once its proofs are checked"
    workers_skill = (root / ".claude/skills/journal-workers/SKILL.md").read_text()
    assert "journal clock-in" in workers_skill and "journal worker check" in workers_skill and "journal worker merge" in workers_skill, "and the workers skill says the shift"
    assert "journal worker merge" in (root / ".claude/skills/journal/SKILL.md").read_text(), "as the journal skill does"
    assert (root / "CLAUDE.md").read_text().strip() == "@AGENTS.md"
    assert "hooks   .claude/settings.json" in output
    assert not (root / ".codex").exists(), "Codex is wired only where its folder exists or its program is installed"
    monkeypatch.setattr(shutil, "which", lambda name: f"/usr/local/bin/{name}")
    assert "hooks   .codex/hooks.json" in app.console().run(["setup"], Caller.user("main")).text, "a fresh project is wired for Codex when Codex is installed"
    assert (root / ".journal/bin/journal").is_file() and "/.journal" in (root / ".gitignore").read_text().splitlines()
    dispatcher = (root / "home/.local/bin/journal").read_text()
    assert ".journal/src/journal.sh" in dispatcher and ".journal/journal" in dispatcher, "the dispatcher serves version 4 and version 3 projects alike"


def test_setup_is_idempotent_and_keeps_other_hooks(app: App):
    root = app.config.root
    (root / ".claude").mkdir()
    (root / ".claude/settings.json").write_text(json.dumps({"hooks": {"PreToolUse": [{"hooks": [{"type": "command", "command": "echo mine"}]}]}, "theme": "dark"}))
    app.console().run(["setup"], Caller.user("main"))
    first = (root / ".claude/settings.json").read_text()
    app.console().run(["setup"], Caller.user("main"))
    assert (root / ".claude/settings.json").read_text() == first
    settings = json.loads(first)
    assert settings["theme"] == "dark"
    assert [h["command"] for b in settings["hooks"]["PreToolUse"] for h in b["hooks"]][0] == "echo mine"
    assert len(settings["hooks"]["PreToolUse"]) == 2
    assert (root / "AGENTS.md").read_text().count("BEGIN: agent-journal") == 1


def test_a_command_from_inside_an_agent_is_the_live_agents(app: App):
    import json as js
    from urllib.request import Request as HttpRequest, urlopen
    from journal.support.actor import Actor
    from journal.repositories.tasks import Tasks
    app.runtime().start()
    try:
        port = app.server().port
        hook = js.dumps({"hook_event_name": "SessionStart", "session_id": "live-1"}).encode()
        urlopen(HttpRequest(f"http://127.0.0.1:{port}/hooks/claude", data=hook, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        body = js.dumps({"argv": ["task", "create", "from inside"], "env": "main", "session": "", "agent": True}).encode()
        urlopen(HttpRequest(f"http://127.0.0.1:{port}/cli", data=body, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        assert app.container.get(Tasks).find(1).creator == Actor.agent("live-1")
    finally:
        app.runtime().stop()


def test_each_hooks_ready_state_is_read_from_the_projects_settings_and_codexs_trust(app: App, monkeypatch):
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    from journal.providers.support.hooks_ready import HooksReady
    monkeypatch.delenv("CODEX_HOME", raising=False)
    root = app.config.root
    (root / ".codex").mkdir()
    assert Codex().hooks_ready(root) == HooksReady.UNWIRED and Claude().hooks_ready(root) == HooksReady.UNWIRED, "no journal hook in the settings: not wired"
    app.console().run(["setup"], Caller.user("main"))
    assert Claude().hooks_ready(root) == HooksReady.READY, "Claude Code runs a project's hooks with no trust step of its own"
    assert Codex().hooks_ready(root) == HooksReady.UNTRUSTED, "wired, but Codex was never asked to trust them"
    hooks = root.resolve() / ".codex" / "hooks.json"
    tables = lambda kinds: "".join(f'[hooks.state."{hooks}:{kind}:0:0"]\ntrusted_hash = "x"\n\n' for kind in kinds)
    (root / "home" / ".codex").mkdir(parents=True)
    (root / "home" / ".codex" / "config.toml").write_text(tables(["session_start", "stop"]))
    assert Codex().hooks_ready(root) == HooksReady.TRUST_OUTDATED, "trusted before the journal wired the hooks it has now"
    captured = Path(__file__).with_name("hook_bodies") / "codex_0.163.0_trust.toml"
    (root / "home" / ".codex" / "config.toml").write_text(captured.read_text().replace("/project/.codex/hooks.json", str(hooks)))
    assert Codex().hooks_ready(root) == HooksReady.READY, "the tables a real Codex 0.163.0 wrote when it trusted every hook"


def test_the_private_folder_keeps_keys_and_secrets_to_their_user_and_out_of_git(tmp_path, monkeypatch):
    import stat
    from journal.support.private_folder import SECRETS_VARIABLE, PrivateFolder
    monkeypatch.setattr(Path, "home", lambda: tmp_path)
    monkeypatch.delenv(SECRETS_VARIABLE, raising=False)
    monkeypatch.delenv("XDG_CONFIG_HOME", raising=False)
    folder = PrivateFolder(tmp_path / "proj")
    keys, secrets = folder.keys_file(), folder.secrets()
    assert keys.parent == tmp_path / ".journal" / "keys" and secrets == tmp_path / ".config" / "agent-journal" / "secrets", "version 3's secrets folder, so its values open unchanged"
    assert not keys.parent.exists() and not secrets.exists(), "naming the folders makes nothing, so a read never writes into the home folder"
    for produced in (PrivateFolder.created(keys.parent), PrivateFolder.created(secrets)):
        assert stat.S_IMODE(produced.stat().st_mode) == 0o700 and (produced / ".gitignore").read_text() == "*\n"
    monkeypatch.setenv(SECRETS_VARIABLE, str(tmp_path / "moved"))
    assert folder.secrets() == tmp_path / "moved"


def test_setup_takes_out_version_3s_hooks_wherever_they_were_wired(app: App):
    root = app.config.root
    (root / ".claude").mkdir()
    (root / ".codex").mkdir()
    old = {"hooks": [{"type": "command", "command": f"sh {root}/.journal/src/hook.sh claude {root}/.journal"}]}
    mine = {"hooks": [{"type": "command", "command": "echo mine"}]}
    (root / ".claude/settings.local.json").write_text(json.dumps({"hooks": {"PreToolUse": [old, mine]}, "model": "opus"}))
    (root / ".codex/hooks.json").write_text(json.dumps({"hooks": {"Stop": [old]}}))
    app.console().run(["setup"], Caller.user("main"))
    local = json.loads((root / ".claude/settings.local.json").read_text())
    assert local == {"hooks": {"PreToolUse": [mine]}, "model": "opus"}, "version 3's hook goes from the local settings, the user's own stays"
    assert "/.journal/src/hook.sh" not in (root / ".codex/hooks.json").read_text(), "and from Codex's hooks, where version 4's takes its place"


def test_a_provider_missing_an_answer_cannot_be_built_and_each_lists_what_the_viewer_may_offer():
    from journal.providers.claude import Claude
    from journal.providers.provider import Provider
    from journal.providers.providers import Providers
    from journal.providers.support.capability import Capability

    class Halfway(Provider):
        name = "halfway"

        def resume(self, session: str) -> tuple[str, ...]:
            return ("--resume", session)

    with pytest.raises(TypeError, match="abstract"):
        Halfway()
    assert {provider.name: provider.capabilities for provider in Providers().all()} == {"claude": frozenset(Capability), "codex": frozenset()}, "a change to what a provider can offer is seen here"


def test_mcp_servers_written_into_codexs_config_keep_its_other_tables(app: App):
    import tomllib
    from journal.features.mcp.support.provider_config import ProviderConfig
    from journal.models.mcp_server import McpServer
    from journal.repositories.mcp_servers import McpServers
    from journal.support.actor import Actor
    root = app.config.root
    (root / ".codex").mkdir()
    (root / ".codex" / "config.toml").write_text('model = "gpt-6"\n\n[mcp_servers.mine]\ncommand = "my-server"\n\n[profiles.fast]\nmodel = "gpt-6-mini"\n')
    servers = app.container.get(McpServers)
    servers.save(McpServer(name="browser", transport="stdio", command="npx", args=("browser-mcp",)), Actor.system())
    gone = servers.save(McpServer(name="search", transport="http", url="https://search.test/mcp"), Actor.system())
    app.container.get(ProviderConfig).write()
    written = tomllib.loads((root / ".codex" / "config.toml").read_text())
    assert written["model"] == "gpt-6" and written["profiles"] == {"fast": {"model": "gpt-6-mini"}}, "the user's own settings stay"
    assert set(written["mcp_servers"]) == {"mine", "browser", "search"} and written["mcp_servers"]["browser"]["command"] == "npx"
    servers.delete(gone, Actor.system())
    app.container.get(ProviderConfig).write()
    assert set(tomllib.loads((root / ".codex" / "config.toml").read_text())["mcp_servers"]) == {"mine", "browser"}, "a server the journal took out goes, the user's own stays"
    assert set(json.loads((root / ".mcp.json").read_text())["mcpServers"]) == {"browser"}


def test_an_agents_row_offers_only_what_its_program_reports(app: App, monkeypatch):
    from journal.config import Config
    from journal.http.agents.agent_activity import AgentActivity
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.support.actor import Actor
    from journal.repositories.scope import Scope
    monkeypatch.setattr(Config, "status_home", property(lambda self: self.root / "status"))
    (app.config.root / "status").mkdir()
    (app.config.root / "status" / "claude-1.json").write_text(json.dumps({"context_window": {"used_percentage": 42}, "model": {"display_name": "Opus 5.5"}, "rate_limits": {"five_hour": {"used_percentage": 10, "resets_at": 99}}}))
    agents = app.container.get(Agents)
    with app.container.get(Scope).environment(1):
        for session, provider in (("claude-1", "claude"), ("codex-1", "codex")):
            agents.save(Agent(environment_id=1, session=session, provider=provider), Actor.system())
        rows = {row["session"]: row for row in app.container.get(AgentActivity).page(agents.scoped())}
    assert rows["claude-1"]["context"] == 42 and rows["claude-1"]["model"] == "Opus 5.5" and rows["claude-1"]["usage"] == [{"key": "five_hour", "label": "5h", "used": 10, "resets_at": 99}]
    assert "context status" in rows["claude-1"]["capabilities"] and rows["codex-1"]["capabilities"] == []
    assert rows["codex-1"]["context"] is None and rows["codex-1"]["model"] == "", "a context Codex never reported is unknown, never zero"

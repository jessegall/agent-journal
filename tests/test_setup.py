"""journal setup wires a project: hooks for Claude, the skills, the law in AGENTS.md, the import in CLAUDE.md. Real files in a temp root; the command lands inside the project."""

import json
from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.console.commands.setup_command import SetupCommand
from journal.providers.provider import HOOK_SCRIPT
from journal.support.caller import Caller
from tests.main_journal import main_journal


@pytest.fixture
def app(tmp_path: Path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
    (tmp_path / "home" / ".local" / "bin").mkdir(parents=True)
    return main_journal(Config(tmp_path, port=0))








def test_each_hooks_ready_state_is_read_from_the_projects_settings_and_codexs_trust(app: App, monkeypatch):
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    from journal.providers.support.hooks_ready import HooksReady
    monkeypatch.delenv("CODEX_HOME", raising=False)
    root = app.config.root
    (root / ".codex").mkdir()
    assert Codex().hooks_ready(root) == HooksReady.UNWIRED and Claude().hooks_ready(root) == HooksReady.UNWIRED, "no journal hook in the settings: not wired"
    for provider in (Claude(), Codex()):
        provider.wire_hooks(root, HOOK_SCRIPT, provider.hook_command(root))
    assert Claude().hooks_ready(root) == HooksReady.READY, "Claude Code runs a project's hooks with no trust step of its own"
    assert Codex().hooks_ready(root) == HooksReady.UNTRUSTED, "wired, but Codex was never asked to trust them"
    hooks = root.resolve() / ".codex" / "hooks.json"
    tables = lambda kinds: "".join(f'[hooks.state."{hooks}:{type_name}:0:0"]\ntrusted_hash = "x"\n\n' for type_name in kinds)
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
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
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
    assert {provider.name: provider.capabilities for provider in Providers().all()} == {"claude": frozenset(Capability), "codex": frozenset({Capability.CONTEXT_STATUS})}, "a change to what a provider can offer is seen here"


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
    assert "context status" in rows["claude-1"]["capabilities"] and rows["codex-1"]["capabilities"] == ["context status"]
    assert rows["codex-1"]["context"] is None and rows["codex-1"]["model"] == "", "a context Codex never reported is unknown, never zero"


def test_setup_writes_the_same_hook_settings_on_every_machine_and_both_forms_count_as_the_journals(tmp_path: Path, monkeypatch):
    from journal.launcher.support.program_settings import ProgramSettings
    from journal.providers import provider as provider_module
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    from journal.providers.provider import Provider
    written = {}
    for machine in ("mac", "server"):
        root = tmp_path / machine / "project"
        monkeypatch.setattr(provider_module, "HOOK_SCRIPT", root / ".journal" / "src" / "journal" / "hooks" / "hook.sh")
        for provider in (Claude(), Codex()):
            path = provider.wire_hooks(root, provider_module.HOOK_SCRIPT, provider.hook_command(root))
            hooks = json.loads(path.read_text())["hooks"]
            written[machine, provider.name] = hooks
            assert str(tmp_path) not in json.dumps(hooks), "the hook command names no machine's folder"
    assert written["mac", "claude"] == written["server", "claude"] and written["mac", "codex"] == written["server", "codex"], "two machines write the same hooks"
    assert '"${CLAUDE_PROJECT_DIR:-.}"' in Claude().hook_command(tmp_path) and "CLAUDE_PROJECT_DIR" not in Codex().hook_command(tmp_path), "Claude starts from its project folder, Codex from where it runs"
    old = {"hooks": [{"type": "command", "command": "test -f /data/project/.journal/src/journal/hooks/hook.sh && exec sh /data/project/.journal/src/journal/hooks/hook.sh codex /data/project; exit 0"}]}
    new = written["server", "codex"]["Stop"][0]
    assert Provider.journal_paths(old) and Provider.journal_paths(new), "setup replaces the journal's hooks in the old and the new form"
    assert ProgramSettings.is_journals(old) and ProgramSettings.is_journals(new), "the launcher keeps the journal's hooks in the old and the new form"


def test_the_hook_command_runs_the_main_checkouts_script_from_a_worktree_of_it(tmp_path: Path, monkeypatch):
    import subprocess
    from journal.providers import provider as provider_module
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    root = tmp_path / "project"
    script = root / ".journal" / "src" / "journal" / "hooks" / "hook.sh"
    script.parent.mkdir(parents=True)
    script.write_text('echo "$1 $2"\n')
    subprocess.run(["git", "init", "-q", str(root)], check=True)
    subprocess.run(["git", "-C", str(root), "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "start"], check=True)
    worktree = root / ".journal" / "worktrees" / "one"
    subprocess.run(["git", "-C", str(root), "worktree", "add", "-q", "--detach", str(worktree)], check=True)
    monkeypatch.setattr(provider_module, "HOOK_SCRIPT", script)
    for folder in (root, worktree):
        claude = subprocess.run(["sh", "-c", Claude().hook_command(root)], cwd=tmp_path, env={"PATH": "/usr/bin:/bin:/usr/local/bin", "CLAUDE_PROJECT_DIR": str(folder)}, capture_output=True, text=True)
        codex = subprocess.run(["sh", "-c", Codex().hook_command(root)], cwd=folder, env={"PATH": "/usr/bin:/bin:/usr/local/bin"}, capture_output=True, text=True)
        assert claude.stdout == f"claude {root.resolve()}\n" and codex.stdout == f"codex {root.resolve()}\n", f"from {folder} the hook runs for the main checkout"

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
    output = app.console().run(["setup"], Caller("main")).text
    settings = json.loads((root / ".claude/settings.json").read_text())
    assert "SessionStart" in settings["hooks"] and "MessageDisplay" in settings["hooks"]
    command = settings["hooks"]["PreToolUse"][0]["hooks"][0]["command"]
    assert command.startswith("test -f ") and f"hook.sh claude {root}; exit 0" in command and settings["statusLine"]["command"].endswith("status.sh")
    assert (root / ".claude/skills/journal/SKILL.md").is_file() and (root / ".agents/skills/journal-tasks/SKILL.md").is_file()
    assert (root / ".claude/agents/journal-researcher.md").read_text().startswith("---\nname: journal-researcher")
    agents = (root / "AGENTS.md").read_text()
    assert agents.startswith("# my project") and "My own rules." in agents and "L9 - A subagent only reads" in agents
    assert (root / "CLAUDE.md").read_text().strip() == "@AGENTS.md"
    assert "hooks   .claude/settings.json" in output
    assert not (root / ".codex").exists(), "Codex is wired only where its folder exists or its program is installed"
    monkeypatch.setattr(shutil, "which", lambda name: f"/usr/local/bin/{name}")
    assert "hooks   .codex/hooks.json" in app.console().run(["setup"], Caller("main")).text, "a fresh project is wired for Codex when Codex is installed"
    assert (root / ".journal/bin/journal").is_file() and "/.journal" in (root / ".gitignore").read_text().splitlines()
    dispatcher = (root / "home/.local/bin/journal").read_text()
    assert ".journal/src/journal.sh" in dispatcher and ".journal/journal" in dispatcher, "the dispatcher serves version 4 and version 3 projects alike"


def test_setup_is_idempotent_and_keeps_other_hooks(app: App):
    root = app.config.root
    (root / ".claude").mkdir()
    (root / ".claude/settings.json").write_text(json.dumps({"hooks": {"PreToolUse": [{"hooks": [{"type": "command", "command": "echo mine"}]}]}, "theme": "dark"}))
    app.console().run(["setup"], Caller("main"))
    first = (root / ".claude/settings.json").read_text()
    app.console().run(["setup"], Caller("main"))
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


def test_codex_hooks_count_as_trusted_once_codex_notes_them(tmp_path, monkeypatch):
    from journal.providers.codex import Codex
    monkeypatch.setattr(Path, "home", lambda: tmp_path)
    project = tmp_path / "proj"
    project.mkdir()
    assert not Codex().hooks_trusted(project), "no Codex settings: not trusted, and the launch says to trust them"
    (tmp_path / ".codex").mkdir()
    (tmp_path / ".codex" / "config.toml").write_text(f'[hooks.state."{project.resolve()}/.codex/hooks.json:session_start:0:0"]\ntrusted_hash = "x"\n')
    assert Codex().hooks_trusted(project)


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
    app.console().run(["setup"], Caller("main"))
    local = json.loads((root / ".claude/settings.local.json").read_text())
    assert local == {"hooks": {"PreToolUse": [mine]}, "model": "opus"}, "version 3's hook goes from the local settings, the user's own stays"
    assert "/.journal/src/hook.sh" not in (root / ".codex/hooks.json").read_text(), "and from Codex's hooks, where version 4's takes its place"

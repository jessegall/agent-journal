"""journal setup wires a project: hooks for Claude, the skills, the law in AGENTS.md, the import in CLAUDE.md. Real files in a temp root; the shim is not written here."""

import json
from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.console.commands.setup_command import SetupCommand
from journal.console.where import Where


@pytest.fixture
def app(tmp_path: Path, monkeypatch):
    monkeypatch.setattr(SetupCommand, "shim", lambda self: None)
    return App(Config(tmp_path, port=0))


def test_setup_wires_hooks_skills_and_the_law(app):
    root = app.config.root
    (root / "AGENTS.md").write_text("# my project\n\nMy own rules.\n")
    out = app.console().run(["setup", "here"], Where("main")).out
    settings = json.loads((root / ".claude/settings.json").read_text())
    assert "SessionStart" in settings["hooks"] and "MessageDisplay" in settings["hooks"]
    command = settings["hooks"]["PreToolUse"][0]["hooks"][0]["command"]
    assert command.endswith(f"hook.sh claude {root}") and settings["statusLine"]["command"].endswith("status.sh")
    assert (root / ".claude/skills/journal/SKILL.md").is_file() and (root / ".agents/skills/journal-tasks/SKILL.md").is_file()
    agents = (root / "AGENTS.md").read_text()
    assert agents.startswith("# my project") and "My own rules." in agents and "L9 - A subagent only reads" in agents
    assert (root / "CLAUDE.md").read_text().strip() == "@AGENTS.md"
    assert "hooks   .claude/settings.json" in out
    assert not (root / ".codex").exists(), "Codex is wired only where its folder exists"


def test_setup_is_idempotent_and_keeps_other_hooks(app):
    root = app.config.root
    (root / ".claude").mkdir()
    (root / ".claude/settings.json").write_text(json.dumps({"hooks": {"PreToolUse": [{"hooks": [{"type": "command", "command": "echo mine"}]}]}, "theme": "dark"}))
    app.console().run(["setup", "here"], Where("main"))
    first = (root / ".claude/settings.json").read_text()
    app.console().run(["setup", "here"], Where("main"))
    assert (root / ".claude/settings.json").read_text() == first
    settings = json.loads(first)
    assert settings["theme"] == "dark"
    assert [h["command"] for b in settings["hooks"]["PreToolUse"] for h in b["hooks"]][0] == "echo mine"
    assert len(settings["hooks"]["PreToolUse"]) == 2
    assert (root / "AGENTS.md").read_text().count("BEGIN: agent-journal") == 1


def test_a_command_from_inside_an_agent_is_the_live_agents(app):
    import json as js
    from urllib.request import Request as HttpRequest, urlopen
    from journal.models.actor import Actor
    from journal.repositories.tasks import Tasks
    app.runtime().start()
    try:
        port = app.server().port
        hook = js.dumps({"hook_event_name": "SessionStart", "session_id": "live-1"}).encode()
        urlopen(HttpRequest(f"http://127.0.0.1:{port}/hooks/claude", data=hook, method="POST", headers={"Content-Type": "application/json"}), timeout=5).read()
        body = js.dumps({"argv": ["task", "create", "from inside"], "env": "main", "session": "", "agent": True}).encode()
        urlopen(HttpRequest(f"http://127.0.0.1:{port}/cli", data=body, method="POST", headers={"Content-Type": "application/json"}), timeout=5).read()
        assert app.container.get(Tasks).find(1).created_by == Actor.agent("live-1")
    finally:
        app.runtime().stop()

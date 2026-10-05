import os

import features
from controllers.types import Agents, Environments, Messages
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh


def test_a_message_wakes_the_environments_last_conversation_when_no_agent_runs(monkeypatch):
    features.load()
    started = []
    monkeypatch.setattr("features.starting_agents.launch.detached",
                        lambda root, cwd, env, agent, args, conversation="": started.append((env, agent, conversation)) or 1)
    record = fresh()
    Environments(record, actor=SYSTEM).create(record.env)
    Agents(record, actor=SYSTEM).create("4d863ccb-old", event="SessionEnd", provider="claude", at=100.0)
    Agents(record, actor=SYSTEM).create("bea86f27-last", event="SessionEnd", provider="codex", at=200.0)
    Agents(record, actor=SYSTEM).create("claude-20640", provider="claude", at=300.0)
    Messages(record, actor=USER).create("are you there?")
    assert started == [], "with the setting off, a message starts nothing"
    record.set_setting("starting_agents", {"wake_on_message": True})
    Messages(record, actor=AGENT).create("I am writing to myself")
    assert started == [], "the agent's own message wakes nothing"
    Messages(record, actor=USER).create("are you there now?")
    assert started == [(record.env, "codex", "bea86f27-last")], "the user's message resumes the environment's last conversation on its provider"
    Messages(record, actor=USER).create("hello again")
    assert len(started) == 1, "a second message while that start is under way starts nothing more"


def test_the_agents_command_is_found_where_it_installs_itself_or_refused_in_words(tmp_path, monkeypatch):
    from providers import DRIVERS
    from tests.conftest import refused
    claude = DRIVERS["claude"]
    home = tmp_path / "local"
    home.mkdir()
    monkeypatch.setattr(claude, "HOMES", (str(home),))
    assert "install Claude Code, or put claude on your PATH" in refused(lambda: claude.binary(str(tmp_path / "empty"))), \
        "with no claude anywhere, the start is refused in words instead of a traceback"
    found = home / "claude"
    found.write_text("#!/bin/sh\n")
    found.chmod(0o755)
    assert claude.binary(str(tmp_path / "empty")) == str(found), "a claude off the PATH, where Claude Code installs itself, is found"


def test_the_start_offers_to_carry_on_the_environments_last_session():
    from tests.kit import asked_resume
    from engine.sessions import Sessions
    record = fresh()
    assert asked_resume(record, "codex", [], ask=lambda _: "1", answering=True) == [], "nothing to carry on, nothing asked"
    Sessions(record.root).bind("old-thread", record.env, pid=999999, provider="codex")
    Sessions(record.root).bind("5e3c0a1f-conversation", record.env, pid=999999, provider="claude")
    assert asked_resume(record, "codex", [], ask=lambda _: "1", answering=True) == ["resume", "old-thread"], "yes resumes that environment's own session"
    assert asked_resume(record, "claude", ["--model", "opus"], ask=lambda _: "2", answering=True) == ["--model", "opus"], "no starts a new one"
    assert asked_resume(record, "claude", ["-c"], ask=lambda _: "1", answering=True) == ["-c"], "a typed continue is the answer already"
    from tests.kit import defaults
    assert asked_resume(record, "codex", [], ask=defaults, answering=True) == ["resume", "old-thread"], "--no-interaction takes the default without asking"
    Sessions(record.root).bind("claude-4242", record.env, pid=999999, provider="claude")
    assert asked_resume(record, "claude", [], ask=lambda _: "1", answering=True) == ["--resume", "5e3c0a1f-conversation"], "a supervisor's name is no conversation"
    from tests.kit import answer
    answer(PROVIDERS["claude"](), record.root, {"hook_event_name": "UserPromptSubmit", "session_id": "5e3c0a1f-conversation", "cwd": str(record.root.parent)}, os.getpid())
    assert asked_resume(record, "claude", [], ask=lambda _: "1", answering=True) == [], "a conversation restarted under a new process is still running"
    Sessions(record.root).bind("7a1d-in-the-worktree", "0922-disposal-date", pid=999999, provider="claude")
    assert asked_resume(record, "claude", ["--worktree", "0922-disposal-date"], ask=lambda _: "1", answering=True) == [
        "--worktree", "0922-disposal-date", "--resume", "7a1d-in-the-worktree"], "a named worktree carries on its own last conversation"

"""Phase four: a posted hook lands as an entry and answers 200; a blocking listener can refuse with 409; a deferred listener runs after the reply."""

import json
import threading
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.events.bus import Bus
from journal.support.decision import Decision
from journal.support.listener_queue import ListenerQueue
from journal.repositories.entries import Entries
from journal.support.scope import Scope

MAIN = 1
"""The id of main, made by the first hook: what a test reads directly, it reads there."""


class RefuseWrites(AgentListener[ToolStarting]):
    blocking = True

    def handle(self, event):
        return Decision.refuse("no work declared") if event.call.tool == "Write" else Decision.allowed_with("carry on")


class Noted(AgentListener[ToolStarting]):
    def __init__(self):
        self.seen, self.ran = [], threading.Event()

    def handle(self, event):
        self.seen.append(event)
        self.ran.set()


@pytest.fixture
def app(journal_root: Path):
    app = App(Config(journal_root, port=0))
    app.container.get(ListenerQueue).start()
    app.server().start()
    with app.container.get(Scope).of(MAIN):
        yield app
    app.server().stop()
    app.container.get(ListenerQueue).stop()


def post_hook(app, body: dict, started_ms: int = 0):
    stamp = {"X-Journal-Hook-Started": str(started_ms)} if started_ms else {}
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=json.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main", **stamp})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def test_a_hook_lands_as_an_entry_and_answers_200(app: App):
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}})
    assert status == 200 and body == {}
    entries = app.container.get(Entries).in_()
    assert [e.kind for e in entries] == ["ToolStarting"] and entries[0].actor.stamp == "agent:s1"


def test_a_blocking_listener_refuses_with_409_and_tells_with_context(app: App):
    app.container.get(Bus).listen(ToolStarting, RefuseWrites())
    hook = {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Write", "tool_input": {}}
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Write", "tool_input": {}})
    assert status == 409 and body == {"error": "no work declared"}
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {}})
    assert status == 200 and body["hookSpecificOutput"]["additionalContext"] == "carry on"


def test_a_deferred_listener_runs_after_the_reply_and_never_refuses(app: App):
    noted = Noted()
    app.container.get(Bus).listen(ToolStarting, noted)
    status, _ = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Write", "tool_input": {}})
    assert status == 200
    assert noted.ran.wait(2)
    assert noted.seen[0].call.tool == "Write" and noted.seen[0].session == "s1" and noted.seen[0].environment_id == 1


def test_every_hook_kind_translates(app: App):
    for kind in ["SessionStart", "UserPromptSubmit", "PostToolUse", "PostToolUseFailure", "PreCompact", "Stop", "SubagentStart", "SubagentStop", "MessageDisplay", "SessionEnd"]:
        assert post_hook(app, {"hook_event_name": kind, "session_id": "s1"})[0] == 200
    assert len(app.container.get(Entries).in_()) == 10



def test_the_deferred_worker_survives_a_failing_piece_of_work(capsys):
    from journal.support.listener_queue import ListenerQueue
    ran = []
    deferred = ListenerQueue()
    deferred.start()
    deferred.add(lambda: 1 / 0)
    deferred.add(lambda: ran.append("after"))
    deferred.drain()
    deferred.stop()
    assert ran == ["after"] and "ZeroDivisionError" in capsys.readouterr().err


def test_a_status_file_caught_half_written_keeps_the_last_whole_reading(tmp_path: Path):
    from journal.support.context_file import ContextFile
    context = ContextFile(tmp_path)
    (tmp_path / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": 40}}))
    assert context.of("s1") == 0.4
    (tmp_path / "s1.json").write_text('{"context_window": {"used_percentage": 5')
    assert context.of("s1") == 0.4, "the statusline is still writing: the last whole reading stands"
    (tmp_path / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": 55}}))
    assert context.of("s1") == 0.55


class Raising(AgentListener[ToolStarting]):
    blocking = True

    def handle(self, event):
        raise RuntimeError("the guard broke")


def test_a_guard_that_raises_fails_open_and_is_reported_loudly(app: App):
    from journal.hooks.receiver import GUARD_FAILED
    from journal.repositories.messages import Messages
    app.container.get(Bus).listen(ToolStarting, Raising())
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Write", "tool_input": {}})
    assert status == 200 and "a guard failed and let this through: Raising raised RuntimeError: the guard broke" in body["hookSpecificOutput"]["additionalContext"], "the tool runs and the agent is told"
    failed = [e for e in app.container.get(Entries).in_() if e.kind == GUARD_FAILED]
    assert len(failed) == 1 and failed[0].data["listener"] == "Raising" and failed[0].data["event"] == "ToolStarting"
    assert any("A guard failed and let the event through" in m.text for m in app.container.get(Messages).in_()), "and the user sees a card in the chat"


def post_command(app, argv: list[str], headers: dict | None = None) -> dict:
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/cli", data=json.dumps({"argv": argv, "env": "main"}).encode(), method="POST", headers={"Content-Type": "application/json", **(headers or {})})
    with urlopen(request, timeout=5) as reply:
        return json.loads(reply.read())


def test_a_claude_subagents_command_is_told_by_the_hook_that_announced_it(app: App):
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "agent_id": "sub1", "tool_name": "Bash", "tool_input": {"command": "journal task list"}})
    assert status == 200 and body == {} and app.container.get(Entries).in_() == [], "announced, never recorded as the agent's"
    refused = post_command(app, ["task", "list"], {"X-Journal-Env": "main"})
    assert refused["code"] == 1 and "a subagent runs no journal command" in refused["err"]
    assert post_command(app, ["task", "list"], {"X-Journal-Env": "main"})["code"] == 0, "the announcement is used up by its command"


def test_a_command_under_the_sub_agent_actor_is_refused(app: App):
    refused = post_command(app, ["task", "list"], {"X-Journal-Actor": "sub-agent"})
    assert refused["code"] == 1 and "writes nothing" in refused["err"]
    assert post_command(app, ["task", "list"], {"X-Journal-Actor": "worker-agent"})["code"] == 0


def test_a_codex_command_from_another_thread_than_the_session_started_with_is_a_subagents(app: App):
    from journal.models.agent import Agent
    from journal.support.actor import Actor
    from journal.repositories.agents import Agents
    app.container.get(Agents).save(Agent(session="thread-1", provider="codex"), Actor.system())
    assert "a subagent runs no journal command" in post_command(app, ["task", "list"], {"X-Journal-Thread": "thread-2"})["err"]
    assert post_command(app, ["task", "list"], {"X-Journal-Thread": "thread-1"})["code"] == 0


def test_a_subagents_write_hook_makes_no_entry_and_moves_no_state(app: App):
    from journal.repositories.agents import Agents
    post_hook(app, {"hook_event_name": "SessionStart", "session_id": "s1", "source": "startup"})
    entries, states = len(app.container.get(Entries).in_()), [a.state for a in app.container.get(Agents).in_()]
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "agent_id": "sub1", "tool_name": "Write", "tool_input": {"file_path": "a.py"}})
    assert status == 200 and body == {}
    assert len(app.container.get(Entries).in_()) == entries and [a.state for a in app.container.get(Agents).in_()] == states


def test_a_hook_that_stamps_its_start_has_its_elapsed_time_on_its_entry(app: App):
    import time
    post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}}, started_ms=int(time.time() * 1000) - 120)
    entry = app.container.get(Entries).in_()[-1]
    assert entry.data["hook_ms"] >= 120, "the server measures from the script's stamp to its answer, so the shell side counts too"
    post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}})
    assert "hook_ms" not in app.container.get(Entries).in_()[-1].data, "a hook without the stamp is not measured"


def test_the_developer_numbers_average_every_stamped_hook_after_the_reply(app: App):
    import time
    from journal.repositories.statistics import Statistics
    post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}}, started_ms=int(time.time() * 1000) - 100)
    post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}}, started_ms=int(time.time() * 1000) - 300)
    settled = threading.Event()
    app.container.get(ListenerQueue).add(settled.set)
    assert settled.wait(5), "the deferred work ran"
    kept = app.container.get(Statistics).under("developer.hooks")
    assert kept["developer.hooks.count"] == 2 and kept["developer.hooks.total_ms"] >= 400 and kept["developer.hooks.slowest_ms"] >= 300, kept
    assert kept["developer.hooks.PreToolUse.count"] == 2, "a hook's time also counts under its kind"
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/developer", headers={"X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        numbers = json.loads(reply.read())
    assert numbers["hooks"]["count"] == 2 and numbers["hooks"]["average_ms"] >= 200 and numbers["by_kind"]["PreToolUse"]["slowest_ms"] >= 300, numbers
    hooks = [t for t in numbers["recent"] if t["method"] == "HOOK"]
    assert [t["route"] for t in hooks][:2] == ["/hooks/PreToolUse"] * 2 and hooks[0]["time"] > 0 and any(t["route"] == "/hooks/claude" for t in numbers["recent"]), "every request is logged with its route, kind and moment, newest first, the hook's own time beside the server's"
    assert numbers["slowest"][0]["ms"] >= numbers["slowest"][-1]["ms"] and numbers["slowest"][0]["ms"] >= 300, "and listed slowest first at a click"
    reset = HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/developer/reset", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    with urlopen(reset, timeout=5) as reply:
        numbers = json.loads(reply.read())
    assert numbers["hooks"]["count"] == 0 and numbers["by_kind"] == {} and numbers["recent"] == [], "a reset clears every count and the log, so the next reading starts from nothing"

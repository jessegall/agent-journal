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
from journal.features.agent_listener import AgentListener
from journal.features.bus import Bus
from journal.hooks.decision import Decision
from journal.hooks.deferred import Deferred
from journal.repositories.entries import Entries
from journal.repositories.scope import Scope

MAIN = 1
"""The id of main, made by the first hook: what a test reads directly, it reads there."""


class RefuseWrites(AgentListener[ToolStarting]):
    blocking = True

    def handle(self, event):
        return Decision.refuse("no work declared") if event.tool == "Write" else Decision.tell("carry on")


class Noted(AgentListener[ToolStarting]):
    def __init__(self):
        self.seen, self.ran = [], threading.Event()

    def handle(self, event):
        self.seen.append(event)
        self.ran.set()


@pytest.fixture
def app(journal_root: Path):
    app = App(Config(journal_root, port=0))
    app.container.get(Deferred).start()
    app.server().start()
    with app.container.get(Scope).of(MAIN):
        yield app
    app.server().stop()
    app.container.get(Deferred).stop()


def post_hook(app, body: dict):
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=json.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def test_a_hook_lands_as_an_entry_and_answers_200(app):
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}})
    assert status == 200 and body == {}
    entries = app.container.get(Entries).in_()
    assert [e.kind for e in entries] == ["ToolStarting"] and entries[0].actor.stamp == "agent:s1"


def test_a_blocking_listener_refuses_with_409_and_tells_with_context(app):
    app.container.get(Bus).listen(ToolStarting, RefuseWrites())
    hook = {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Write", "tool_input": {}}
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Write", "tool_input": {}})
    assert status == 409 and body == {"error": "no work declared"}
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {}})
    assert status == 200 and body["hookSpecificOutput"]["additionalContext"] == "carry on"


def test_a_deferred_listener_runs_after_the_reply_and_never_refuses(app):
    noted = Noted()
    app.container.get(Bus).listen(ToolStarting, noted)
    status, _ = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Write", "tool_input": {}})
    assert status == 200
    assert noted.ran.wait(2)
    assert noted.seen[0].tool == "Write" and noted.seen[0].session == "s1" and noted.seen[0].environment_id == 1


def test_every_hook_kind_translates(app):
    for kind in ["SessionStart", "UserPromptSubmit", "PostToolUse", "PreCompact", "Stop", "SubagentStart", "SubagentStop", "MessageDisplay", "SessionEnd"]:
        assert post_hook(app, {"hook_event_name": kind, "session_id": "s1"})[0] == 200
    assert len(app.container.get(Entries).in_()) == 9



def test_the_deferred_worker_survives_a_failing_piece_of_work(capsys):
    from journal.hooks.deferred import Deferred
    ran = []
    deferred = Deferred()
    deferred.start()
    deferred.add(lambda: 1 / 0)
    deferred.add(lambda: ran.append("after"))
    deferred.drain()
    deferred.stop()
    assert ran == ["after"] and "ZeroDivisionError" in capsys.readouterr().err


def test_a_status_file_caught_half_written_keeps_the_last_whole_reading(tmp_path: Path):
    from journal.hooks.context_file import ContextFile
    context = ContextFile(tmp_path)
    (tmp_path / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": 40}}))
    assert context.of("s1") == 0.4
    (tmp_path / "s1.json").write_text('{"context_window": {"used_percentage": 5')
    assert context.of("s1") == 0.4, "the statusline is still writing: the last whole reading stands"
    (tmp_path / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": 55}}))
    assert context.of("s1") == 0.55

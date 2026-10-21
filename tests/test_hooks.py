"""Phase four: a posted hook lands as an entry and answers 200; a blocking listener can refuse with 409; a deferred listener runs after the reply."""

import json
import threading
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.events.agent.stop import Stop
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.events.bus import Bus
from journal.support.decision import Decision
from journal.support.listener_queue import ListenerQueue
from journal.repositories.entries import Entries
from journal.repositories.scope import Scope

MAIN = 1
"""The id of main, made by the first hook: what a test reads directly, it reads there."""


class RefuseWrites(AgentListener[ToolStarting]):
    blocking = True

    def handle(self, event):
        return Decision.refuse("no work declared") if event.call.tool == "Write" else Decision.allowed_with("carry on")


class RefuseEveryStop(AgentListener[Stop]):
    blocking = True

    def handle(self, event):
        return Decision.refuse("finish the task in hand first")


class Noted(AgentListener[ToolStarting]):
    def __init__(self):
        self.seen, self.ran = [], threading.Event()

    def handle(self, event):
        self.seen.append(event)
        self.ran.set()


@pytest.fixture(scope="module")
def boot():
    def booted(root: Path, patch: pytest.MonkeyPatch) -> App:
        app = App(Config(root, port=0))
        app.container.get(ListenerQueue).start()
        app.server().start()
        return app
    return booted


@pytest.fixture
def app(app: App):
    with app.container.get(Scope).environment(MAIN):
        yield app


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
    entries = app.container.get(Entries).scoped()
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
    assert len(app.container.get(Entries).scoped()) == 10



def test_the_deferred_worker_survives_a_failing_piece_of_work(capsys):
    from journal.support.listener_queue import ListenerQueue
    completed = []
    deferred = ListenerQueue()
    deferred.start()
    deferred.add(lambda: 1 / 0)
    deferred.add(lambda: completed.append("after"))
    deferred.drain()
    deferred.stop()
    assert completed == ["after"] and "ZeroDivisionError" in capsys.readouterr().err


def test_a_status_file_caught_half_written_keeps_the_last_whole_reading(tmp_path: Path):
    from journal.providers.support.context_file import ContextFile
    context = ContextFile(tmp_path)
    (tmp_path / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": 40}}))
    assert context.build("s1") == 0.4
    (tmp_path / "s1.json").write_text('{"context_window": {"used_percentage": 5')
    assert context.build("s1") == 0.4, "the statusline is still writing: the last whole reading stands"
    (tmp_path / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": 55}}))
    assert context.build("s1") == 0.55


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
    failed = [e for e in app.container.get(Entries).scoped() if e.kind == GUARD_FAILED]
    assert len(failed) == 1 and failed[0].data["listener"] == "Raising" and failed[0].data["event"] == "ToolStarting"
    assert any("A guard failed and let the event through" in m.text for m in app.container.get(Messages).scoped()), "and the user sees a card in the chat"


def post_command(app, argv: list[str], headers: dict | None = None) -> dict:
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/cli", data=json.dumps({"argv": argv, "env": "main"}).encode(), method="POST", headers={"Content-Type": "application/json", **(headers or {})})
    with urlopen(request, timeout=5) as reply:
        return json.loads(reply.read())


def test_a_claude_subagents_command_is_told_by_the_hook_that_announced_it(app: App):
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "agent_id": "sub1", "tool_name": "Bash", "tool_input": {"command": "journal task list"}})
    assert status == 200 and body == {} and app.container.get(Entries).scoped() == [], "announced, never recorded as the agent's"
    refused = post_command(app, ["task", "list"], {"X-Journal-Env": "main"})
    assert refused["code"] == 1 and "a subagent runs no journal command" in refused["error"]
    assert post_command(app, ["task", "list"], {"X-Journal-Env": "main"})["code"] == 0, "the announcement is used up by its command"


def test_a_command_under_the_sub_agent_actor_is_refused(app: App):
    refused = post_command(app, ["task", "list"], {"X-Journal-Actor": "sub-agent"})
    assert refused["code"] == 1 and "writes nothing" in refused["error"]
    assert post_command(app, ["task", "list"], {"X-Journal-Actor": "worker-agent"})["code"] == 0


def test_a_codex_command_from_another_thread_than_the_session_started_with_is_a_subagents(app: App):
    from journal.models.agent import Agent
    from journal.support.actor import Actor
    from journal.repositories.agents import Agents
    app.container.get(Agents).save(Agent(session="thread-1", provider="codex"), Actor.system())
    assert "a subagent runs no journal command" in post_command(app, ["task", "list"], {"X-Journal-Thread": "thread-2"})["error"]
    assert post_command(app, ["task", "list"], {"X-Journal-Thread": "thread-1"})["code"] == 0


def test_a_subagents_write_hook_makes_no_entry_and_moves_no_state(app: App):
    from journal.repositories.agents import Agents
    post_hook(app, {"hook_event_name": "SessionStart", "session_id": "s1", "source": "startup"})
    entries, states = len(app.container.get(Entries).scoped()), [item.state for item in app.container.get(Agents).scoped()]
    status, body = post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "agent_id": "sub1", "tool_name": "Write", "tool_input": {"file_path": "a.py"}})
    assert status == 200 and body == {}
    assert len(app.container.get(Entries).scoped()) == entries and [item.state for item in app.container.get(Agents).scoped()] == states


def test_a_hook_that_stamps_its_start_has_its_elapsed_time_on_its_entry(app: App):
    import time
    post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}}, started_ms=int(time.time() * 1000) - 120)
    entry = app.container.get(Entries).scoped()[-1]
    assert entry.data["hook_ms"] >= 120, "the server measures from the script's stamp to its answer, so the shell side counts too"
    post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}})
    assert "hook_ms" not in app.container.get(Entries).scoped()[-1].data, "a hook without the stamp is not measured"


def test_the_developer_numbers_average_every_stamped_hook_after_the_reply(app: App):
    import time
    from journal.repositories.statistics import Statistics
    post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}}, started_ms=int(time.time() * 1000) - 100)
    post_hook(app, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": "a.py"}}, started_ms=int(time.time() * 1000) - 300)
    resolved = threading.Event()
    app.container.get(ListenerQueue).add(resolved.set)
    assert resolved.wait(5), "the deferred work ran"
    stored = app.container.get(Statistics).lower("developer.hooks")
    assert stored["developer.hooks.count"] == 2 and stored["developer.hooks.total_ms"] >= 400 and stored["developer.hooks.slowest_ms"] >= 300, stored
    assert stored["developer.hooks.PreToolUse.count"] == 2, "a hook's time also counts under its kind"
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


BODIES = Path(__file__).with_name("hook_bodies")
EVENTS = {"SessionStart": "SessionStarted", "UserPromptSubmit": "PromptSubmitted", "PreToolUse": "ToolStarting", "PostToolUse": "ToolFinished", "PostToolUseFailure": "ToolFailed", "PreCompact": "Compacting",
          "Stop": "Stop", "SubagentStart": "SubagentStarted", "SubagentStop": "SubagentEnded", "MessageDisplay": "TurnDisplayed", "SessionEnd": "SessionEnded"}


def captured(provider: str) -> list[dict]:
    """Every hook body a real run of the provider's program sent, in order; the file is named for the program's version."""
    return [json.loads(line) for path in sorted(BODIES.glob(f"{provider}_*.jsonl")) for line in path.read_text().splitlines() if line.strip()]


def post_as(app, provider: str, body: dict, launch: str = ""):
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/{provider}", data=json.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main", "X-Journal-Launch": launch})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


@pytest.mark.parametrize("provider", sorted({path.name.split("_")[0] for path in BODIES.glob("*.jsonl")}))
def test_every_hook_a_real_run_sent_decodes_into_its_agent_event(app: App, provider: str):
    from journal.providers.providers import Providers
    bodies = [body for body in captured(provider) if not (body.get("agent_id") and body["hook_event_name"] == "PreToolUse")]
    assert {body["hook_event_name"] for body in bodies} <= {kind.value for kind in Providers().lookup(provider).hook_kinds}, "a real run sends only the kinds the provider wires"
    for body in bodies:
        assert post_as(app, provider, body)[0] == 200, body
    assert [entry.kind for entry in app.container.get(Entries).scoped()] == [EVENTS[body["hook_event_name"]] for body in bodies]


def first_calls(provider: str) -> dict:
    """The input of the first call of each tool a real run of the provider's program made, by the tool's name."""
    calls = {}
    for body in captured(provider):
        if body["hook_event_name"] == "PreToolUse":
            calls.setdefault(body["tool_name"], []).append(body["tool_input"])
    return calls


def test_each_providers_tool_calls_decode_into_the_operations_the_features_read():
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    from journal.support.file_edit import FileEdit
    from journal.support.file_read import FileRead
    from journal.support.file_write import FileWrite
    from journal.support.undecoded_tool import UndecodedTool
    from journal.support.shell_line import ShellLine
    from journal.support.skill_load import SkillLoad
    from journal.support.subagent_dispatch import SubagentDispatch
    claude, codex = Claude(), Codex()
    calls, codex_calls = first_calls("claude"), first_calls("codex")
    ready = ShellLine("printf ready > ready.txt")
    assert claude.operation("Bash", calls["Bash"][0]) == ready and codex.operation("Bash", codex_calls["Bash"][0]) == ready, "both programs' shell hooks are the same operation"
    assert codex.operation("Bash", {"command": ["bash", "-lc", "printf ready > ready.txt"]}) == ready and codex.operation("Bash", {"command": ["git", "status", "--short"]}) == ShellLine("git status --short"), "a Codex command given as a list is one line"
    assert [codex.operation("apply_patch", value) for value in codex_calls["apply_patch"]] == [FileEdit(("/project/note2.txt",))] * 3, "a patch adding, changing or deleting a file is an edit of its path"
    patch = "*** Begin Patch\n*** Add File: new.txt\n+hi\n*** Update File: notes.txt\n@@\n-first\n+second\n*** Delete File: old.txt\n*** End Patch\n"
    assert codex.operation("apply_patch", {"command": patch}) == FileEdit(("new.txt", "notes.txt", "old.txt")), "and one patch of several files an edit of each"
    assert claude.operation("Edit", calls["Edit"][0]) == FileEdit(("/project/notes.txt",)) and claude.operation("Write", calls["Write"][0]) == FileWrite("/project/new.txt")
    assert claude.operation("Read", calls["Read"][0]) == FileRead("/project/notes.txt", False) and claude.operation("Skill", calls["Skill"][0]) == SkillLoad("greeting")
    assert claude.operation("Agent", calls["Agent"][0]) == SubagentDispatch("general-purpose", "", "Reply with one word", "reply with the word amber", False)
    assert codex.operation("collaborationspawn_agent", codex_calls["collaborationspawn_agent"][0]) == SubagentDispatch(None, None, "say_teal", None, True), "Codex's spawn names its task, carries no profile, model or readable brief, and runs in the background"
    assert claude.operation("Grep", {"pattern": "x"}) == UndecodedTool("Grep") and codex.operation("view_image", {}) == UndecodedTool("view_image"), "a tool a provider does not know is undecoded"


@pytest.mark.parametrize("provider", ["claude", "codex"])
def test_a_hold_answers_409_and_a_refused_stop_the_block_json_for_both_providers(app: App, provider: str):
    app.container.get(Bus).listen(ToolStarting, RefuseWrites())
    app.container.get(Bus).listen(Stop, RefuseEveryStop())
    assert post_as(app, provider, {"hook_event_name": "PreToolUse", "session_id": "s1", "tool_name": "Write", "tool_input": {}}) == (409, {"error": "no work declared"})
    status, body = post_as(app, provider, {"hook_event_name": "Stop", "session_id": "s1", "stop_hook_active": False})
    assert status == 200 and body["decision"] == "block" and body["reason"].startswith("finish the task in hand first") and "continue" not in body, "a refused stop goes on working; continue:false would end a Codex turn"


def test_a_claude_subagent_dispatch_is_paired_and_counted():
    from journal.features.workers.support.subagent_entries import SubagentEntries
    rows = SubagentEntries.paired(dispatch_entries("claude", lambda body: body["hook_event_name"] in ("SessionStart", "Stop") or body.get("tool_name") == "Agent" or body["hook_event_name"].startswith("Subagent")))
    assert [(row.agent_type, row.state) for row in rows] == [("general-purpose", "done")], "dispatched, run in the background, settled when its subagent stopped"


def test_a_codex_subagent_dispatch_is_paired_and_counted_like_a_claude_one():
    from journal.features.workers.support.subagent_entries import SubagentEntries
    spawn = lambda body: body["hook_event_name"] in ("SessionStart", "SubagentStart", "Stop", "SubagentStop") or body.get("tool_name") == "collaborationspawn_agent"
    bodies = [body for body in captured("codex") if spawn(body)][:6]
    assert [body["hook_event_name"] for body in bodies] == ["SessionStart", "PreToolUse", "PostToolUse", "SubagentStart", "Stop", "SubagentStop"], "the order a real Codex run sends them in"
    running = [SubagentEntries.paired(dispatch_entries("codex", lambda body: True, bodies[:n])) for n in range(2, 7)]
    assert [sum(1 for row in rows if row.is_running()) for rows in running] == [1, 1, 1, 1, 0], "the spawn counts against the limit from its start, through the agent's own stop, until its subagent stops"
    assert running[-1][0].session == bodies[3]["agent_id"] and running[-1][0].state == "done" and running[-1][0].task == "say_teal"


def dispatch_entries(provider: str, kept, bodies: list[dict] | None = None) -> list:
    """The entries a provider's captured hooks would leave, as SubagentEntries pairs them: each body with its event's kind and its call's reading."""
    from datetime import datetime, timezone
    from journal.models.entry import Entry
    from journal.providers.providers import Providers
    program = Providers().lookup(provider)
    entries = []
    for n, body in enumerate(body for body in (bodies or captured(provider)) if kept(body)):
        call = {"call": program.call(body["tool_name"], body["tool_input"]).as_data()} if "tool_name" in body else {}
        entries.append(Entry(id=n + 1, environment_id=1, kind=EVENTS[body["hook_event_name"]], data={**body, **call}, created_at=datetime(2026, 10, 21, 12, 0, n, tzinfo=timezone.utc)))
    return entries

import json
import os
import re
import time as timing
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

from journal.engine.clock import Clock
from journal.support.typed_lines import TypedLines
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.support.scope import Scope
from journal.supervisor_link import SupervisorLink

RECORDS = Path(__file__).with_name("replays")
FREEZE = os.environ.get("REPLAY_FREEZE") == "1"


@dataclass(frozen=True)
class Tools:
    """The names a provider's agent uses for reading, writing and the shell."""

    read: str
    write: str
    shell: str


TOOLS = {"claude": Tools("Read", "Write", "Bash"), "codex": Tools("read_file", "write_file", "Bash")}
PROVIDERS = tuple(TOOLS)


def hook_as(app, provider: str, kind: str, session: str = "s1", **body):
    """A hook as the provider's agent sends it, for the session named: the status and the answer."""
    data = json.dumps({"hook_event_name": kind, "session_id": session, **body}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/{provider}", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def catch_typed(app, monkeypatch, keystrokes: list) -> None:
    """Catches each line typed to the agent into typed and confirms it at once, as the agent's prompt hook would, so the next is not held behind it."""
    lines = app.container.get(TypedLines)

    def seen_back(link, environment_id: int, verb: str, fields: dict) -> None:
        keystrokes.append(fields["line"])
        lines.confirm(environment_id, fields["line"])

    monkeypatch.setattr(SupervisorLink, "_send", seen_back)


def drive_the_clock(app, monkeypatch) -> None:
    """The engine's clock held at the moment the replay starts, so every hook notes its time there and a tick says how long after it was."""
    clock = app.container.get(Clock)
    clock.driven_at = timing.time()
    clock.held_at = clock.driven_at
    monkeypatch.setattr(Clock, "now", lambda self: getattr(self, "driven_at", timing.time()))


def pass_time(app, seconds: float) -> None:
    """The held moment moved on, so the hooks after it come so many seconds later."""
    clock = app.container.get(Clock)
    clock.held_at += seconds
    clock.driven_at = clock.held_at


def tick_after(app, silent: float) -> list:
    """A tick so many seconds after the held moment, once what came before it has settled on the worker thread, as the clock gives it, its answers handed back; the clock is held again after it."""
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    app.runtime().deferred.drain()
    clock = app.container.get(Clock)
    environment = app.container.get(Environments).lookup("main").id
    clock.driven_at = clock.held_at + silent
    try:
        return app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=environment, time=clock.driven_at, quiet_for=silent))
    finally:
        clock.driven_at = clock.held_at


class Replay:
    """One journal under replay: the lines typed to its agent are caught, and each step closes with what the step answered, the lines typed, the nudges said and the stack of the live agent once the worker thread has settled."""

    def __init__(self, app, monkeypatch) -> None:
        """On a started journal, the lines typed to its agent caught."""
        self.app, self.typed, self.steps, self.seen = app, [], [], 0
        catch_typed(app, monkeypatch, self.typed)
        drive_the_clock(app, monkeypatch)

    def step(self, name: str, answer=None) -> None:
        """Closes a step: the hook's answer when the step was a hook, the lines typed since the last step, the nudges said since, the environment's counts as they stand once the worker has settled, so a count raised after the reply is in, and what the count checks of the walks since read."""
        keystrokes = list(self.typed)
        with self.app.container.get(Scope).environment(self.app.container.get(Environments).lookup("main").id):
            entries = list(reversed(self.app.container.get(Entries).kind_entries_scoped(1000)))
            nudges = [e.data["key"] for e in entries if e.kind == "nudge"]
            self.app.runtime().deferred.drain()
            agent = self.app.container.get(Agents).current()
        stack = [layer["state"] for layer in agent.stack] if agent else []
        self.steps.append({"name": name, "answer": answer, "typed": keystrokes, "nudges": nudges[self.seen:], "stack": stack})
        self.seen = len(nudges)
        del self.typed[:len(keystrokes)]

    def record(self) -> list[dict]:
        return list(self.steps)

    def freeze(self, name: str, nudges: bool) -> Path:
        """The record written to its file, with whether the nudges said count in the comparison."""
        RECORDS.mkdir(exist_ok=True)
        path = RECORDS / f"{name}.json"
        path.write_text(json.dumps({"nudges": nudges, "steps": self.record()}, indent=2) + "\n")
        return path


class Frozen:
    """A record read back from its file: what the listener side saw, in place of it."""

    def __init__(self, name: str) -> None:
        stored = json.loads((RECORDS / f"{name}.json").read_text())
        self.nudges, self.steps = stored["nudges"], stored["steps"]

    def record(self) -> list[dict]:
        return list(self.steps)


def played(name: str, app, monkeypatch, steps, provider: str, nudges: bool = False) -> tuple[Replay, list[str]]:
    """The steps played on one fresh journal, and what differs from the record frozen under that name: nothing when the agent would have seen the same. With REPLAY_FREEZE=1 the record is written anew instead and nothing differs."""
    app.runtime().start()
    replay = Replay(app, monkeypatch)
    steps(app, replay, provider)
    if FREEZE:
        replay.freeze(name, nudges)
        return replay, []
    return replay, differences(Frozen(name).record(), replay.record(), nudges)


def lines_of(answer) -> object:
    """A hook's answer with the lines it carries as a set: the lines said in one answer are each an instruction of their own, and which listener or workflow said them first is not what the agent sees."""
    if not isinstance(answer, dict):
        return answer
    flat = dict(answer)
    output = flat.get("hookSpecificOutput")
    if isinstance(output, dict) and "additionalContext" in output:
        flat["hookSpecificOutput"] = {**output, "additionalContext": sorted(clockless(output["additionalContext"]).split("\n"))}
    for key in ("reason", "error"):
        if key in flat:
            flat[key] = sorted(clockless(str(flat[key])).split("\n"))
    return flat


def clockless(text: str) -> str:
    """A time of day in a line, such as the hour another agent left, is the clock's and not the conduct's: the comparison reads it as the same."""
    return re.sub(r"\b\d\d:\d\d\b", "HH:MM", text)


def differences(remaining: list[dict], right: list[dict], nudges: bool = False) -> list[str]:
    """What differs between two records, step by step, in words; nothing when the agent would have seen the same: the same answer's lines, the same lines typed in order, the same stack when both records carry one, and, when asked, the same nudges said."""
    rows = []
    for item, b in zip(remaining, right):
        if lines_of(item["answer"]) != lines_of(b["answer"]):
            rows.append(f"{item['name']}: the hook's answer differs: {item['answer']} against {b['answer']}")
        if item["typed"] != b["typed"]:
            rows.append(f"{item['name']}: the lines typed differ: {item['typed']} against {b['typed']}")
        if nudges and sorted(item["nudges"]) != sorted(b["nudges"]):
            rows.append(f"{item['name']}: the nudges said differ: {item['nudges']} against {b['nudges']}")
        if "stack" in item and "stack" in b and item["stack"] != b["stack"]:
            rows.append(f"{item['name']}: the stack differs: {item['stack']} against {b['stack']}")
    if len(remaining) != len(right):
        rows.append(f"{len(remaining)} steps against {len(right)}")
    return rows

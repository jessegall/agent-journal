"""The replay harness of plan 2: the same scripted steps run on two fresh journals, one with a listener and one with the workflow
that replaces it, and what the agent would have seen is compared step by step: the hook's answer, the lines typed to its terminal,
and, when asked, the keys of the nudges said. A record can be frozen to a file, so the comparison survives the listener's deletion."""

import json
import os
import re
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

from journal.engine.clock import Clock
from journal.support.typed_lines import TypedLines
from journal.repositories.counts import Counts
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.support.scope import Scope
from journal.supervisor_link import SupervisorLink

RECORDS = Path(__file__).with_name("replays")
FREEZE = os.environ.get("REPLAY_FREEZE") == "1"
TOLD_ONLY = os.environ.get("REPLAY_TOLD_ONLY", "1") == "1"
"""Set, a replay is compared on what the agent is told alone, its answers, typed lines and nudges, not the counts and readings behind them: the proof that workflows redrawn from new parts tell the agent the same, before the records are frozen anew."""
"""Set, the listener side runs and its record is frozen anew; unset, the frozen record stands in for it, so the proof survives the listeners' deletion and the run boots one journal."""


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


def catch_typed(app, monkeypatch, typed: list) -> None:
    """Catches each line typed to the agent into typed and confirms it at once, as the agent's prompt hook would, so the next is not held behind it."""
    lines = app.container.get(TypedLines)

    def seen_back(link, environment_id: int, verb: str, fields: dict) -> None:
        typed.append(fields["line"])
        lines.confirm(environment_id, fields["line"])

    monkeypatch.setattr(SupervisorLink, "_send", seen_back)


def drive_the_clock(app, monkeypatch) -> None:
    """The engine's clock held at the moment the replay starts, so every hook notes its time there and a tick says how long after it was."""
    clock = app.container.get(Clock)
    clock.driven_at = time.time()
    clock.held_at = clock.driven_at
    monkeypatch.setattr(Clock, "now", lambda self: getattr(self, "driven_at", time.time()))


def pass_time(app, seconds: float) -> None:
    """The held moment moved on, so the hooks after it come so many seconds later."""
    clock = app.container.get(Clock)
    clock.held_at += seconds
    clock.driven_at = clock.held_at


def tick_after(app, quiet: float) -> list:
    """A tick so many seconds after the held moment, once what came before it has settled on the worker thread, as the clock gives it, its answers handed back; the clock is held again after it."""
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    app.runtime().deferred.drain()
    clock = app.container.get(Clock)
    env = app.container.get(Environments).named("main").id
    clock.driven_at = clock.held_at + quiet
    try:
        return app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=env, at=clock.driven_at, quiet_for=quiet))
    finally:
        clock.driven_at = clock.held_at


class Replay:
    """One journal under replay: the lines typed to its agent are caught, and each step closes with what the step answered, typed and said."""

    def __init__(self, app, monkeypatch) -> None:
        """On a started journal, the lines typed to its agent caught."""
        self.app, self.typed, self.steps, self.seen, self.last_walk = app, [], [], 0, 0
        catch_typed(app, monkeypatch, self.typed)
        drive_the_clock(app, monkeypatch)

    def step(self, name: str, answer=None) -> None:
        """Closes a step: the hook's answer when the step was a hook, the lines typed since the last step, the nudges said since, the environment's counts as they stand once the worker has settled, so a count raised after the reply is in, and what the count checks of the walks since read."""
        typed = list(self.typed)
        with self.app.container.get(Scope).of(self.app.container.get(Environments).named("main").id):
            entries = list(reversed(self.app.container.get(Entries).of_kind_in(1000)))
            nudges = [e.data["key"] for e in entries if e.kind == "nudge"]
            walks = [e for e in entries if e.kind == "walk"]
            self.app.runtime().deferred.drain()
            counts = {c.name: c.value for c in sorted(self.app.container.get(Counts).all(), key=lambda c: c.name)}
        read = [w.data["read"] for w in walks if w.id > self.last_walk and w.data.get("read")]
        self.steps.append({"name": name, "answer": answer, "typed": typed, "nudges": nudges[self.seen:], "counts": counts, "read": read})
        self.seen, self.last_walk = len(nudges), max([self.last_walk, *(w.id for w in walks)])
        del self.typed[:len(typed)]

    def record(self) -> list[dict]:
        return list(self.steps)

    def freeze(self, name: str, nudges: bool) -> Path:
        """The record written to its file, with whether the nudges said count in the comparison."""
        RECORDS.mkdir(exist_ok=True)
        path = RECORDS / f"{name}.json"
        path.write_text(json.dumps({"nudges": nudges, "steps": self.record()}, indent=2) + "\n")
        return path


class Frozen:
    """A record read back from its file: what the listener side saw, snapshot in for it."""

    def __init__(self, name: str) -> None:
        kept = json.loads((RECORDS / f"{name}.json").read_text())
        self.nudges, self.steps = kept["nudges"], kept["steps"]

    def record(self) -> list[dict]:
        return list(self.steps)


def recorded(name: str, app, monkeypatch, steps, provider: str, nudges: bool = False):
    """The frozen side of a replay, read from its record: first the listeners' conduct, frozen before they were deleted, and since phase one of plan 7 the shipped workflows' conduct as it stood when last frozen; with REPLAY_FREEZE set the steps run anew on a fresh journal and the record is written again."""
    if not FREEZE:
        return Frozen(name)
    app.runtime().start()
    replay = Replay(app, monkeypatch)
    steps(app, replay, provider)
    replay.freeze(name, nudges)
    return replay


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


DERIVED = ("edits", "uses", "owed", "namings", "lines")
"""The counts the shipped workflows read, now derived from the journal's record and kept by no workflow: what the agent heard proves them, not a row."""


def differences(left: list[dict], right: list[dict], nudges: bool = False) -> list[str]:
    """What differs between two records, step by step, in words; nothing when the agent would have seen the same: the same answer's lines, the same lines typed in order, and, when asked, the same nudges said."""
    found = []
    for a, b in zip(left, right):
        if lines_of(a["answer"]) != lines_of(b["answer"]):
            found.append(f"{a['name']}: the hook's answer differs: {a['answer']} against {b['answer']}")
        if a["typed"] != b["typed"]:
            found.append(f"{a['name']}: the lines typed differ: {a['typed']} against {b['typed']}")
        if nudges and sorted(a["nudges"]) != sorted(b["nudges"]):
            found.append(f"{a['name']}: the nudges said differ: {a['nudges']} against {b['nudges']}")
        kept = lambda counts: {k: v for k, v in counts.items() if k not in DERIVED}
        if not TOLD_ONLY and "counts" in a and "counts" in b and kept(a["counts"]) != kept(b["counts"]):
            found.append(f"{a['name']}: the counts differ: {a['counts']} against {b['counts']}")
        if not TOLD_ONLY and "read" in a and "read" in b and a["read"] != b["read"]:
            found.append(f"{a['name']}: what the count checks read differs: {a['read']} against {b['read']}")
    if len(left) != len(right):
        found.append(f"{len(left)} steps against {len(right)}")
    return found

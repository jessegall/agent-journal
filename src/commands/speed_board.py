import argparse
import json
import os
import resource
import shutil
import sys
import tempfile
import time
from collections.abc import Callable
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path

import features
from commands.speed import timed
from controllers.types import Messages, Todos
from engine.record import Record
from engine.sessions import Sessions
from engine.stored import write_text
from features.boards.controller import Boards
from features.plans.controller import Plans
from features.tickets.controller import Tickets
from providers import PROVIDERS
from resources.base import SYSTEM
from runner.hooks import answer

TICKETS, SESSIONS, MESSAGES, STAGES = 40, 90, 7800, ["New", "Doing", "Review", "Done"]
WAITS_BEHIND = 4


@dataclass
class Counts:
    """What a measured call made: command-line parsers built, records opened and processes asked whether they are alive."""

    parsers: int = 0
    records: int = 0
    probes: int = 0


def megabytes() -> float:
    used = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    return used / 1e6 if sys.platform == "darwin" else used / 1e3


@contextmanager
def counting():
    """Counts, while it lasts, the parsers built, the records opened and the pid probes made, by wrapping the three places they start."""
    counts = Counts()
    made, opened, killed, waited = argparse.ArgumentParser.__init__, Record.__init__, os.kill, os.waitpid

    def parser(self, *args, **kwargs):
        counts.parsers += 1
        return made(self, *args, **kwargs)

    def record(self, *args, **kwargs):
        counts.records += 1
        return opened(self, *args, **kwargs)

    def kill(pid, sig):
        counts.probes += 1
        return killed(pid, sig)

    def waitpid(pid, options):
        counts.probes += 1
        return waited(pid, options)
    argparse.ArgumentParser.__init__, Record.__init__, os.kill, os.waitpid = parser, record, kill, waitpid
    try:
        yield counts
    finally:
        argparse.ArgumentParser.__init__, Record.__init__, os.kill, os.waitpid = made, opened, killed, waited


def built(root: Path) -> tuple[Record, int]:
    """A journal the size of a large project's: a board of tickets that each have an environment, a plan and a wait on an earlier one, sessions for them and for other agents, and a long list of messages."""
    features.load()
    record = Record(root, "main")
    board = Boards(record, actor=SYSTEM).create("Benchmark board", stages=STAGES, meanings={"Doing": "start", "Done": "done"})
    tickets = Tickets(record, actor=SYSTEM)
    sessions = Sessions(root)
    for i in range(1, TICKETS + 1):
        ticket = tickets.create(f"Ticket {i}", brief="a ticket of the benchmark board", board=board.n)
        place = Record(root, tickets.bind(ticket.n).work_environment)
        todo = Todos(place, actor=SYSTEM).create(f"Row of ticket {i}")
        phase = {"title": "Build it", "when": "it is built", "checkpoint": False, "brief": "", "todos": [todo.n]}
        plan = Plans(place, actor=SYSTEM).create(f"Plan {i}", goal="the ticket is done")
        Plans(place, actor=SYSTEM).update(plan.n, status="active", phases=[phase])
        waits = {f"ticket:{i - WAITS_BEHIND}": "confirmed"} if i > WAITS_BEHIND else {}
        tickets.update(ticket.n, plan=plan.n, stage="Doing", dependencies=waits)
        sessions.write(f"claude-{i}", environment=place.env, provider="claude", pid=os.getpid(), seen=time.time())
    for i in range(TICKETS + 1, SESSIONS + 1):
        sessions.write(f"claude-{i}", environment="main", provider="claude", pid=os.getpid(), seen=time.time())
    messages = Messages(record, actor=SYSTEM)
    first = messages.create("message 1", brief="a message of the benchmark journal")
    for n in range(first.n + 1, first.n + MESSAGES):
        made = messages.resource(n=n, title=f"message {n}", brief="a message of the benchmark journal", data=dict(first.data), created=time.time(), seen=[SYSTEM], refs=[])
        messages.rows.write_file(made)
    return record, board.n


def hook_call(record: Record):
    body = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read", "tool_input": {"file_path": "x.py"}, "cwd": str(record.root.parent)}
    return lambda: answer(PROVIDERS["claude"](), record.root, body, os.getpid())


@dataclass(frozen=True)
class Row:
    name: str
    value: float


@dataclass(frozen=True)
class Call:
    name: str
    run: Callable[[], object]


def measured(call: Call, runs: int) -> list[Row]:
    """The median time of a call and what one call made: parsers, records and pid probes."""
    call.run()
    with counting() as counts:
        call.run()
    return [Row(call.name, timed(call.run, runs)), Row(f"{call.name}: parsers", counts.parsers), Row(f"{call.name}: records", counts.records),
            Row(f"{call.name}: pid probes", counts.probes)]


def measure_board(runs: int = 5, out: Path | None = None) -> str:
    """Times a board of forty tickets on a journal built for it, with what each call made: parsers, records and pid probes, and the memory of this process."""
    folder = Path(tempfile.mkdtemp())
    root = folder / ".journal"
    root.mkdir()
    rows: list[Row] = []
    try:
        began = time.perf_counter()
        record, board = built(root)
        rows += [Row("building the journal", (time.perf_counter() - began) * 1000), Row("memory after building MB", megabytes())]
        tickets = Tickets(record, actor=SYSTEM)
        calls = [Call(f"ticket board ({TICKETS} tickets)", lambda: tickets.board(board)),
                 Call(f"ticket status of {TICKETS} tickets", lambda: [tickets.status(n) for n in range(1, TICKETS + 1)]),
                 Call(f"list message ({MESSAGES})", lambda: Messages(record, actor=SYSTEM).rows.every()), Call("claude PreToolUse hook", hook_call(record))]
        for call in calls:
            rows += measured(call, runs)
        rows.append(Row("memory after timing MB", megabytes()))
    finally:
        shutil.rmtree(folder, ignore_errors=True)
    if out is not None:
        write_text(out, json.dumps({"at": time.time(), "runs": runs, "fixture": {"tickets": TICKETS, "sessions": SESSIONS, "messages": MESSAGES},
                                    "median_ms": {row.name: row.value for row in rows}}, indent=2))
    width = max(len(row.name) for row in rows)
    return "\n".join(f"{row.name:<{width}}  {row.value:9.1f}" for row in rows)

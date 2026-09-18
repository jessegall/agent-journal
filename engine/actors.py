import time
from abc import ABC, abstractmethod
from pathlib import Path

from controllers.types import CONTROLLERS
from engine.record import Record
from resources.base import AGENT, SYSTEM, USER, Event
from resources.types import TYPES

STOPPED, IDLE, WORKING, WAITING = "stopped", "idle", "working", "waiting"
STATES = (STOPPED, IDLE, WORKING, WAITING)
BATCH = {"quiet": 5.0, "size": 10}


def spoken(e: Event, record: Record) -> str:
    r = CONTROLLERS[e.type](record, actor=AGENT).read(e.n)
    return f"{r.title} — {r.brief}" if r.brief else r.title


def counted(events: list[Event]) -> list[str]:
    groups: dict[tuple, list] = {}
    for e in events:
        groups.setdefault((e.type, e.action), []).append(e.n)
    return [f"{len(ns)} new {t}{'s' if len(ns) != 1 else ''}" if a == "created" else f"{t}{'s' if len(ns) != 1 else ''} {' '.join(map(str, ns))} {a}"
            for (t, a), ns in groups.items()]


def render(events: list[Event], record: Record) -> str:
    said = [spoken(e, record) for e in events if TYPES[e.type].spoken]
    return "; ".join(list(dict.fromkeys(said)) + counted([e for e in events if not TYPES[e.type].spoken]))


class Actor(ABC):
    name = ""

    def __init__(self, record: Record):
        self.record = record

    @abstractmethod
    def notify(self, event: Event) -> None: ...

    def cursor(self) -> int:
        return self.record.cursor(self.name)

    def heard(self) -> int:
        return self.cursor()

    def notified(self, event: Event) -> None:
        self.record.set_cursor(self.name, event.id)


class User(Actor):
    name = USER

    def notify(self, event: Event) -> None:
        self.notified(event)

    def unread(self) -> list:
        return CONTROLLERS["notification"](self.record, actor=USER).unread()


class System(Actor):
    name = SYSTEM

    def notify(self, event: Event) -> None:
        self.notified(event)


class Agent(Actor):
    name = AGENT

    def __init__(self, record: Record, driver):
        super().__init__(record)
        self.driver = driver
        self.pending: list[Event] = []
        self.pending_at = 0.0

    def notify(self, event: Event) -> None:
        self.pending.append(event)
        self.pending_at = time.time()

    def heard(self) -> int:
        return self.pending[-1].id if self.pending else self.cursor()

    def flush(self) -> str:
        batch = {**BATCH, **(self.record.setting("batch", {}) or {})}
        if not self.pending or (time.time() - self.pending_at < batch["quiet"] and len(self.pending) < batch["size"]):
            return ""
        line = render(self.pending, self.record)
        self.driver.send(line)
        for e in self.pending:
            self.notified(e)
        self.pending = []
        return line

    def state(self) -> str:
        if not self.driver.alive():
            return STOPPED
        last = self.driver.last_report()
        quiet = self.driver.quiet_for()
        if last is None:
            return IDLE if quiet >= self.driver.QUIET else WORKING
        status = last.get("status", "")
        if status == STOPPED:
            return STOPPED
        if status == IDLE:
            return IDLE if quiet >= 1.0 else WORKING
        if last.get("event") == "PreToolUse" and quiet >= 5.0:
            return WAITING
        return WORKING

    def mark(self, status: str, event: str, **more) -> None:
        agents = CONTROLLERS["agent"](self.record, actor=SYSTEM)
        last = self.driver.last_report() or {}
        row = agents.by_session(last.get("session") or self.driver.session)
        agents.update(row.n, **{**row.data, "at": time.time(), **more, "status": status or row.data.get("status", ""), "event": event or row.data.get("event", "")})

    def is_idle(self) -> bool:
        return self.state() == IDLE

    def is_working(self) -> bool:
        return self.state() == WORKING

    def is_waiting(self) -> bool:
        return self.state() == WAITING


ACTORS = {USER: User, AGENT: Agent, SYSTEM: System}

import time
from abc import ABC, abstractmethod
from pathlib import Path

from controllers.types import Agents, CONTROLLERS, Notifications, Works
from engine.record import Record
from resources.base import AGENT, SYSTEM, USER, Event
from resources.types import AgentRow, TYPES

STOPPED, IDLE, BUSY, WORKING, COMPACTING = "stopped", "idle", "busy", "working", "compacting"
STATES = (STOPPED, IDLE, BUSY, WORKING, COMPACTING)
BATCH = {"quiet": 5.0, "size": 10}


def spoken(e: Event, record: Record) -> str:
    r = CONTROLLERS[e.type](record, actor=AGENT).read(e.n)
    return f"{r.title} — {r.brief}" if r.brief else r.title


def counted(events: list[Event]) -> list[str]:
    groups: dict[tuple, dict] = {}
    for e in events:
        groups.setdefault((e.type, e.action), {})[e.n] = True
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
        return Notifications(self.record, actor=USER).unread()


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
        batch = {**BATCH, **self.record.batch}
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
            return IDLE if quiet >= self.driver.QUIET else self.active()
        status = last.status or ""
        if status == STOPPED:
            return STOPPED
        if status == IDLE:
            return IDLE if quiet >= 1.0 else self.active()
        if status == COMPACTING:
            return COMPACTING
        return self.active()

    def active(self) -> str:
        return WORKING if any(not row.completed for row in Works(self.record, actor=SYSTEM).all()) else BUSY

    def mark(self, status: str, event: str, **more) -> None:
        agents = Agents(self.record, actor=SYSTEM)
        last = self.driver.last_report()
        row = agents.by_session((last and last.title) or self.driver.session)
        agents.update(row.n, **{**row.data, **more, AgentRow.at: more.get(AgentRow.at) or time.time(), AgentRow.status: status or row.status or "", AgentRow.event: event or row.event or ""})

    def is_idle(self) -> bool:
        return self.state() == IDLE

    def is_working(self) -> bool:
        return self.state() == WORKING

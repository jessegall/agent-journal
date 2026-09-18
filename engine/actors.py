import time
from abc import ABC, abstractmethod
from pathlib import Path

from controllers.types import CONTROLLERS
from engine.record import Record
from resources.base import AGENT, SYSTEM, USER, Event
from resources.types import TYPES

STOPPED, IDLE, WORKING, WAITING = "stopped", "idle", "working", "waiting"
STATES = (STOPPED, IDLE, WORKING, WAITING)


def render(e: Event, record: Record) -> str:
    if TYPES[e.type].spoken:
        r = CONTROLLERS[e.type](record, actor=AGENT).read(e.n)
        return f"{r.title} — {r.brief}" if r.brief else r.title
    return f"{e.type} {e.n} {e.action}"


class Actor(ABC):
    name = ""

    def __init__(self, record: Record):
        self.record = record

    @abstractmethod
    def notify(self, event: Event) -> None: ...

    def cursor(self) -> int:
        return self.record.cursor(self.name)

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

    def notify(self, event: Event) -> None:
        self.driver.send(render(event, self.record))
        self.notified(event)

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

    def mark(self, status: str, event: str) -> None:
        agents = CONTROLLERS["agent"](self.record, actor=SYSTEM)
        last = self.driver.last_report() or {}
        row = agents.by_session(last.get("session") or self.driver.session)
        agents.update(row.n, **{**row.data, "status": status, "event": event, "at": time.time()})

    def is_idle(self) -> bool:
        return self.state() == IDLE

    def is_working(self) -> bool:
        return self.state() == WORKING

    def is_waiting(self) -> bool:
        return self.state() == WAITING


ACTORS = {USER: User, AGENT: Agent, SYSTEM: System}

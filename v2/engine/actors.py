import json
import time
from abc import ABC, abstractmethod
from pathlib import Path

from v2.engine.record import Record
from v2.resources.base import AGENT, SYSTEM, USER, Event

STOPPED, IDLE, WORKING, WAITING = "stopped", "idle", "working", "waiting"
STATES = (STOPPED, IDLE, WORKING, WAITING)


def render(e: Event, env: str) -> str:
    return f"The {e.actor} {e.action} {e.type} {e.n} on {env}. Read it before you act on it: `journal {e.type} show {e.n}`."


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
        f = self.record.home / "notifications.jsonl"
        with f.open("a") as fh:
            fh.write(json.dumps({"at": time.time(), "event": event.id, "ref": event.ref, "action": event.action, "by": event.actor}) + "\n")
        self.notified(event)

    def unread(self) -> list[dict]:
        f = self.record.home / "notifications.jsonl"
        if not f.is_file():
            return []
        return [json.loads(l) for l in f.read_text().splitlines() if l.strip()]


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
        self.driver.send(render(event, self.record.env))
        self.notified(event)

    def state(self) -> str:
        if not self.driver.alive():
            return STOPPED
        last = self.driver.last_report()
        quiet = self.driver.quiet_for()
        if last is None:
            return IDLE if quiet >= self.driver.QUIET else WORKING
        if last.get("event") in ("Stop", "SessionStart"):
            return IDLE if quiet >= 1.0 else WORKING
        if last.get("event") == "PreToolUse" and quiet >= 5.0:
            return WAITING
        return WORKING

    def is_idle(self) -> bool:
        return self.state() == IDLE

    def is_working(self) -> bool:
        return self.state() == WORKING

    def is_waiting(self) -> bool:
        return self.state() == WAITING


ACTORS = {USER: User, AGENT: Agent, SYSTEM: System}

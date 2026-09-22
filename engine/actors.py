import time
from abc import ABC, abstractmethod

from controllers.types import Agents, CONTROLLERS, Notifications, Works
from engine.record import Record
from resources.base import AGENT, SYSTEM, USER, Event, Refused
from resources.types import AgentRow, TYPES
from engine.wording import counted
from engine.drivers import TERMINAL

STOPPED, IDLE, BUSY, WORKING, COMPACTING = "stopped", "idle", "busy", "working", "compacting"
STATES = (STOPPED, IDLE, BUSY, WORKING, COMPACTING)


def spoken_data(record: Record, event: Event) -> dict:
    if not TYPES[event.type].typed_as_title:
        return {}
    try:
        return CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n).data
    except Refused:
        return {}


def grouped(events: list[Event]) -> dict[tuple, dict]:
    groups: dict[tuple, dict] = {}
    for e in events:
        groups.setdefault((e.type, e.action), {})[e.n] = True
    return groups


def render(events: list[Event], record: Record) -> tuple[str, dict]:
    rows = [CONTROLLERS[e.type](record, actor=AGENT).read(e.n) for e in events if TYPES[e.type].typed_as_title]
    line = [r.agent_line() for r in sorted(rows, key=lambda r: not r.data.get("lead"))]
    return "; ".join(dict.fromkeys(line)), grouped([e for e in events if not TYPES[e.type].typed_as_title])


class Actor(ABC):
    name = ""

    def __init__(self, record: Record):
        self.record = record

    @abstractmethod
    def notify(self, event: Event) -> None: ...

    def cursor(self) -> int:
        return self.record.cursor(self.name)

    def delivered_until(self) -> int:
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

    def notify(self, event: Event) -> None:
        self.pending.append(event)

    def delivered_until(self) -> int:
        return self.pending[-1].id if self.pending else self.cursor()

    def typed(self, event: Event) -> bool:
        return spoken_data(self.record, event).get("delivery") == TERMINAL

    def flush(self) -> str:
        if not self.pending:
            return ""
        typed = [e for e in self.pending if self.typed(e)]
        line, groups = render([e for e in self.pending if e not in typed], self.record)
        landed = self.driver.send(line, groups=groups)
        if typed:
            landed = self.driver.type_in(render(typed, self.record)[0]) and landed
        for e in self.pending:
            if landed and TYPES[e.type].stamped_when_notified:
                CONTROLLERS[e.type](self.record, actor=SYSTEM).stamp(e.n, delivered=time.time())
            self.notified(e)
        self.pending = []
        return "; ".join([line, *counted(groups)] if line else counted(groups))

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
        return WORKING if Works(self.record, actor=SYSTEM)._standing() else BUSY

    def mark(self, status: str, event: str, **more) -> None:
        agents = Agents(self.record, actor=SYSTEM)
        last = self.driver.last_report()
        row = agents.by_session((last and last.title) or self.driver.session)
        agents.update(row.n, **{**row.data, **more, AgentRow.at: more.get(AgentRow.at) or time.time(), AgentRow.status: status or row.status or "", AgentRow.event: event or row.event or ""})

    def is_idle(self) -> bool:
        return self.state() == IDLE

    def is_working(self) -> bool:
        return self.state() == WORKING

import time
from abc import ABC, abstractmethod

from controllers.types import Agents, CONTROLLERS, Notifications, Works
from engine.record import Record
from resources.base import AGENT, SYSTEM, USER, Event, Refused
from resources.types import AgentRow, BUSY, COMPACTING, IDLE, STATES, STOPPED, TYPES, WORKING
from engine.wording import counted



def settled(record: Record, event: Event) -> bool:
    rows = event_data(record, event).get("rows") or []
    return bool(rows) and all(finished(record, ref) for ref in rows)


def finished(record: Record, ref: str) -> bool:
    kind, _, n = ref.partition(":")
    try:
        return bool(CONTROLLERS[kind](record, actor=SYSTEM).load(n).completed)
    except (KeyError, ValueError, Refused):
        return False


def event_data(record: Record, event: Event) -> dict:
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
    sent: frozenset[int] = frozenset()

    def __init__(self, record: Record):
        self.record = record

    @abstractmethod
    def notify(self, event: Event) -> None: ...

    def cursor(self) -> int:
        return self.record.event_log.cursor(self.name)

    def delivered_until(self) -> int:
        return self.cursor()

    def notified(self, event: Event) -> None:
        self.record.event_log.set_cursor(self.name, event.id)


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
        self.scanned = self.cursor()
        self.sent = {int(n) for n in self.record.event_log.cursor_text(self.sent_name).split(",") if n}

    def notify(self, event: Event) -> None:
        self.pending.append(event)
        self.scanned = max(self.scanned, event.id)

    def delivered_until(self) -> int:
        return self.scanned

    @property
    def sent_name(self) -> str:
        return f"{self.name}-sent"

    def notified(self, event: Event) -> None:
        """Keeps the cursor at the last event before the oldest one still held, and the ids handled beyond it in a file of their own: a worker that reloads reads on from there and takes none of them twice."""
        self.scanned = max(self.scanned, event.id)
        self.sent.add(event.id)
        held = min((e.id for e in self.pending), default=self.scanned + 1) - 1
        self.sent = {n for n in self.sent if n > held}
        self.record.event_log.set_cursor(self.name, held)
        self.record.event_log.set_cursor_text(self.sent_name, ",".join(map(str, sorted(self.sent))))

    def delivered(self, done: list[Event]) -> None:
        reported, agents = self.driver.last_report(), Agents(self.record, actor=SYSTEM)
        row = agents.rows.by_title(reported.title) if reported is not None else None
        if row is None:
            return
        earlier = [] if row.status in (IDLE, STOPPED) else list(row.delivered)
        agents.update(row.n, delivered=list(dict.fromkeys([*earlier, *(f"{e.type}:{e.n}" for e in done)])))

    def flush(self) -> str:
        if not self.pending or not self.driver.ready():
            return ""
        for e in [e for e in self.pending if settled(self.record, e)]:
            self.pending.remove(e)
            self.notified(e)
        whispers = [e for e in self.pending if event_data(self.record, e).get("whisper")]
        yielding = [e for e in self.pending if event_data(self.record, e).get("yields") and e not in whispers]
        line, groups = render([e for e in self.pending if e not in yielding and e not in whispers], self.record)
        if whispers:
            self.driver.whisper(render(whispers, self.record)[0])
        sent = self.driver.send(line, groups=groups, yielding=render(yielding, self.record)[0] if yielding else "")
        done = list(self.pending) if sent else []
        for e in done:
            if TYPES[e.type].stamped_when_notified:
                CONTROLLERS[e.type](self.record, actor=SYSTEM).stamp(e.n, delivered=time.time())
        self.pending = [e for e in self.pending if e not in done]
        for e in done:
            self.notified(e)
        if not sent:
            return ""
        self.delivered(done)
        return "; ".join([line, *counted(groups, self.record)] if line else counted(groups, self.record))

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
        return WORKING if Works(self.record, actor=SYSTEM).rows.standing() else BUSY

    def current(self):
        """The agent's held row as it stands now, not as the report cached a moment ago read it; it is read, never changed."""
        last = self.driver.last_report()
        return Agents(self.record, actor=SYSTEM).peek_session((last and last.title) or self.driver.session)

    def note(self, **facts) -> None:
        """Writes facts onto the agent's row and leaves its status, event and time to the hooks that report them, so a report read earlier never writes an older state over a newer one."""
        Agents(self.record, actor=SYSTEM).update(self.current().n, **facts)

    def mark(self, status: str, event: str, **more) -> None:
        agents = Agents(self.record, actor=SYSTEM)
        row = self.current()
        agents.update(row.n, **{**row.data, **more, AgentRow.at: more.get(AgentRow.at) or time.time(), AgentRow.status: status or row.status or "", AgentRow.event: event or row.event or ""})

    def is_idle(self) -> bool:
        return self.state() == IDLE

    def is_working(self) -> bool:
        return self.state() == WORKING

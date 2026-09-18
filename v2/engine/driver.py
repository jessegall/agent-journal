import json
import time
from pathlib import Path

from v2.controllers.types import CONTROLLERS
from v2.engine.agent import Agent
from v2.engine.record import Record
from v2.resources.base import Event

TICK = 1.0

def render(e: Event, env: str) -> str:
    return f"The {e.dispatcher} {e.action} {e.type} {e.n} on {env}. Read it before you act on it: `journal {e.type} show {e.n}`."


class Driver:
    def __init__(self, agent: Agent, record: Record, name: str):
        self.agent = agent
        self.record = record
        self.name = name                   # the cursor's name: one per agent session
        self.typed_at = 0.0
        self.why = ""

    def tick(self) -> str:
        self.why = self.deliver() or self.nudge()
        self.seat()
        return self.why

    def deliver(self) -> str:
        since = self.record.cursor(self.name)
        events = [e for e in self.record.events(since) if e.dispatcher == "user"]
        for e in events:
            self.agent.send(render(e, self.record.env))
            self.record.set_cursor(self.name, e.id)
            self.typed_at = time.time()
        return f"delivered {len(events)} event(s)" if events else ""

    def nudge(self) -> str:
        if not self.agent.is_idle():
            return "not idle"
        last = self.agent.last_report()
        if last and self.typed_at and float(last.get("at") or 0) < self.typed_at:
            return "typed, waiting for the hooks"
        line = self.owed()
        if not line:
            return "nothing owed"
        self.agent.send(line)
        self.typed_at = time.time()
        return f"typed: {line[:60]}"

    def owed(self) -> str:
        env = self.record.env
        messages = [m for m in CONTROLLERS["message"](self.record).list() if not m.data.get("processed")]
        if messages:
            n = messages[0].n
            return f"Message {n} on {env} is still unprocessed: `journal message show {n}`, then process it."
        open_work = [w for w in CONTROLLERS["work"](self.record).list() if w.data.get("status", "open") == "open"]
        if open_work:
            w = open_work[0]
            return f"Work is still open on {env}: {w.title}. Continue it, or `journal work end {w.n}`."
        if self.record.setting("auto", False):
            todos = [t for t in CONTROLLERS["todo"](self.record).list() if t.data.get("status", "open") == "open"]
            if todos:
                t = todos[0]
                return f"Auto is on and nothing is open on {env}: start to-do {t.n}, {t.title}: `journal todo start {t.n}`."
        return ""

    def seat(self) -> None:
        f = self.record.root / "runtime" / f"seat-{self.name}.json"
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps({"at": time.time(), "agent": self.agent.name, "idle": self.agent.is_idle(),
                                 "waiting": self.agent.is_waiting(), "why": self.why,
                                 "printed": self.agent.last_printed()}))

    def run(self) -> None:
        while True:
            self.tick()
            time.sleep(TICK)

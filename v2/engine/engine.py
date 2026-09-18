import json
import time

from v2.controllers.types import CONTROLLERS
from v2 import features
from v2.engine import bus
from v2.engine.actors import Actor, Agent, IDLE, System, User
from v2.engine.record import Record
from v2.resources.base import AGENT, SYSTEM
from v2.resources.types import PRIORITY

TICK = 1.0


class Engine:
    def __init__(self, record: Record, driver):
        self.record = record
        self.agent = Agent(record, driver)
        self.actors: list[Actor] = [User(record), self.agent, System(record)]
        self.running = False
        self.typed_at = 0.0
        self.why = ""

    def start(self) -> None:
        features.load()
        self.running = True

    def stop(self) -> None:
        self.running = False

    def tick(self) -> str:
        self.why = self.deliver() or self.nudge()
        self.seat()
        return self.why

    def deliver(self) -> str:
        if self.agent.driver.last_report() is None:       # the agent has not reported yet: it may still be at a dialog
            return "waiting for the agent's first report"
        count = 0
        for actor in self.actors:
            for e in self.record.events(actor.cursor()):
                if e.actor in (actor.name, SYSTEM):       # nobody is told of their own act, or of bookkeeping
                    actor.notified(e)
                    continue
                actor.notify(e)
                if actor is self.agent:
                    self.typed_at = time.time()
                count += 1
        return f"delivered {count}" if count else ""

    def nudge(self) -> str:
        if self.agent.state() != IDLE:
            return self.agent.state()
        last = self.agent.driver.last_report()
        if last and self.typed_at and float(last.get("at") or 0) < self.typed_at:
            return "typed, waiting for the hooks"
        line = self.owed()
        if not line:
            return "nothing owed"
        self.agent.driver.send(line)
        self.typed_at = time.time()
        return f"typed: {line[:60]}"

    def owed(self) -> str:
        for type_ in PRIORITY:
            unseen = CONTROLLERS[type_](self.record, actor=AGENT).unseen()
            if unseen:
                return f"{len(unseen)} unseen {type_}"
        works = [w for w in CONTROLLERS["work"](self.record).all() if not w.completed]
        if works:
            return f"work {works[0].n} open"
        if self.record.setting("auto", False):
            todos = [t for t in CONTROLLERS["todo"](self.record).all() if not t.completed]
            if todos:
                return f"todo {todos[0].n} next"
        return ""

    def seat(self) -> None:
        f = self.record.root / "runtime" / f"seat-{self.agent.driver.session}.json"
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps({"at": time.time(), "agent": self.agent.driver.name, "state": self.agent.state(),
                                 "why": self.why, "printed": self.agent.driver.last_printed()}))

    def run(self) -> None:
        self.start()
        while self.running:
            self.tick()
            time.sleep(TICK)

import json
import time

from controllers.types import CONTROLLERS
import features
from engine import bus
from engine.actors import Actor, Agent, IDLE, STOPPED, System, User, WAITING, WORKING
from engine.record import Record
from resources.base import AGENT
from resources.types import PRIORITY, TYPES

TICK = 1.0
SILENT_AFTER = 120.0
PROBE_WAIT = 5.0


class Engine:
    def __init__(self, record: Record, driver):
        self.record = record
        self.agent = Agent(record, driver)
        self.actors: list[Actor] = [User(record), self.agent, System(record)]
        self.running = False
        self.typed_at = 0.0
        self.probed_at = 0.0
        self.why = ""

    def start(self) -> None:
        features.load()
        self.running = True

    def stop(self) -> None:
        self.running = False

    def tick(self) -> str:
        self.why = self.probe() or self.deliver() or self.nudge()
        self.seat()
        return self.why

    def probe(self) -> str:
        driver = self.agent.driver
        last = driver.last_report()
        if last is None or not driver.alive():
            return ""
        reported = float(last.get("at") or 0)
        silent = time.time() - max(reported, self.typed_at) >= SILENT_AFTER and driver.quiet_for() >= SILENT_AFTER
        if self.probed_at > reported:
            if time.time() - self.probed_at < PROBE_WAIT:
                return "probed, waiting"
            if driver.at_prompt():
                self.agent.mark(IDLE, "probe")
                return "probe: at the prompt, idle"
            if driver.quiet_for() >= PROBE_WAIT:
                self.agent.mark(STOPPED, "probe")
                return "probe: nothing came back, stopped"
            self.probed_at = 0.0
            return "probe: working"
        if silent and self.agent.state() in (WORKING, WAITING):
            driver.interrupt()
            self.probed_at = time.time()
            return "silent for two minutes: probing with Ctrl-C"
        return ""

    def deliver(self) -> str:
        if self.agent.driver.last_report() is None:       # the agent has not reported yet: it may still be at a dialog
            return "waiting for the agent's first report"
        count = 0
        for actor in self.actors:
            for e in self.record.events(actor.cursor()):
                if e.actor == actor.name or actor.name not in TYPES[e.type].notify:
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
            if AGENT not in TYPES[type_].notify:
                continue
            unread = CONTROLLERS[type_](self.record, actor=AGENT).unread()
            if unread:
                return f"{len(unread)} unread {type_}"
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

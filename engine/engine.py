import json
import subprocess
import time

from controllers.types import CONTROLLERS
import features
from engine import bus
from engine.actors import Actor, Agent, IDLE, STOPPED, System, User, WAITING, WORKING
from engine.record import Record
from engine.sessions import Sessions
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
        self.born = time.time()
        self.branched_at = 0.0
        self.branch_name = ""
        self.typed_at = 0.0
        self.probed_at = 0.0
        self.why = ""

    def start(self) -> None:
        features.load()
        self.running = True

    def stop(self) -> None:
        self.running = False

    def tick(self) -> str:
        self.why = self.follow() or self.probe() or self.deliver() or self.nudge()
        self.seat()
        return self.why

    def private(self, e) -> bool:
        return TYPES[e.type].spoken and bool(CONTROLLERS[e.type](self.record, actor=AGENT).load(e.n).data.get("private"))

    def follow(self) -> str:
        last = self.agent.driver.last_report()
        if not last or not last.get("session"):
            return ""
        bound = Sessions(self.record.root).environment(last["session"])
        if not bound or bound == self.record.env:
            return ""
        self.record = Record(self.record.root, bound)
        self.agent.driver.record = self.record
        self.agent = Agent(self.record, self.agent.driver)
        self.actors = [User(self.record), self.agent, System(self.record)]
        return f"following the session to {bound}"

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
            fresh = actor.cursor() == 0
            for e in self.record.events(actor.cursor()):
                if fresh and e.at < self.born:
                    actor.notified(e)
                    continue
                if e.actor == actor.name or actor.name not in TYPES[e.type].notify or self.private(e):
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

    def branch(self) -> str:
        last = self.agent.driver.last_report() or {}
        cwd = last.get("cwd") or str(self.record.root.parent)
        if time.time() - self.branched_at < 10:
            return self.branch_name
        self.branched_at = time.time()
        try:
            self.branch_name = subprocess.run(["git", "-C", cwd, "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True, timeout=2).stdout.strip()
        except (OSError, subprocess.SubprocessError):
            self.branch_name = ""
        if last.get("session") and self.branch_name and last.get("branch") != self.branch_name:
            self.agent.mark(last.get("status", ""), last.get("event", ""), branch=self.branch_name, at=last.get("at"))
        return self.branch_name

    def seat(self) -> None:
        self.branch()
        f = self.record.root / "runtime" / f"seat-{self.agent.driver.session}.json"
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps({"at": time.time(), "agent": self.agent.driver.name, "state": self.agent.state(), "env": self.record.env,
                                 "why": self.why, "printed": self.agent.driver.last_printed()}))

    def run(self) -> None:
        self.start()
        while self.running:
            self.tick()
            time.sleep(TICK)

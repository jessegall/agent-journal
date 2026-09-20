import subprocess
import time
from pathlib import Path

from controllers.types import CONTROLLERS, Agents
import features
from engine import bus
from engine.actors import Actor, Agent, BUSY, COMPACTING, IDLE, STOPPED, System, User, WORKING
from engine.inputs import FORCE, take
from features.sessioncontrol.control import CARRY_ON, delivered
from features.start.feature import WAIT_FOR_REPORT, hello
from engine import steps
from engine.record import Record
from engine.terminal import pid_of
from engine.sessions import Sessions
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM
from resources.types import PRIORITY, RUNNING, TYPES
from engine.stored import write_json

TICK = 1.0
SETTLE, STEP = 3.0, 0.1
TYPING_HOLD = 30.0
WEB_HOSTS = ("github.com", "gitlab.com", "bitbucket.org")


def web_remote(url: str) -> str:
    if url.startswith("git@") or (url.startswith("ssh://") and "@" in url):
        url = f"https://{url.removeprefix('ssh://').split('@', 1)[-1].replace(':', '/', 1)}"
    url = url.removesuffix(".git").rstrip("/")
    host = url.split("://", 1)[-1].split("/", 1)[0]
    return url if url.startswith("https://") and host in WEB_HOSTS else ""

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
        self.crewed_at = 0.0
        self.crewed_size = -1
        self.relayed = None
        self.typed_at = 0.0
        self.probed_at = 0.0
        self.greeted = False
        self.controlled_at = 0.0
        self.stepped = ""
        self.carry_on = False
        self.why = ""

    def start(self) -> None:
        features.load()
        self.running = True

    def stop(self) -> None:
        self.running = False

    def tick(self) -> str:
        self.relay()
        self.why = self.follow() or self.probe() or self.forced() or self.typing() or self.control() or self.begin() or self.deliver() or self.nudge()
        self.seat()
        return self.why

    def relay(self) -> None:
        name = f"engine-{self.agent.driver.session}"
        if self.relayed is None:
            self.relayed = self.record.last_event()
        for e in self.record.events(self.relayed):
            self.relayed = e.id
            if not e.heard:
                bus.emit(e, self.record)

    def private(self, e) -> bool:
        return TYPES[e.type].spoken and bool(CONTROLLERS[e.type](self.record, actor=AGENT).load(e.n).private)

    def follow(self) -> str:
        last = self.agent.driver.last_report()
        if not last or not last.title:
            return ""
        bound = Sessions(self.record.root).environment(last.title)
        if not bound or bound == self.record.env:
            return ""
        self.record = Record(self.record.root, bound)
        self.relayed = None
        self.agent.driver.record = self.record
        self.agent = Agent(self.record, self.agent.driver)
        self.actors = [User(self.record), self.agent, System(self.record)]
        return f"following the session to {bound}"

    def probe(self) -> str:
        driver = self.agent.driver
        last = driver.last_report()
        if last is None or not driver.alive():
            return ""
        reported = float(last.at or 0)
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
        if silent and self.agent.state() in (BUSY, WORKING):
            driver.interrupt()
            self.probed_at = time.time()
            return "silent for two minutes: probing with Ctrl-C"
        return ""

    def names(self) -> set[str]:
        last = self.agent.driver.last_report()
        return {self.agent.driver.session, *([last.title] if last and last.title else [])}

    def typing(self) -> str:
        driver = self.agent.driver
        if driver.user_typing(TYPING_HOLD):
            return "holding: the user is typing in the terminal"
        if driver.typed.exists():
            driver.clear_input()
            driver.typed.unlink(missing_ok=True)
        return ""

    def forced(self) -> str:
        if self.agent.state() == IDLE or not take(self.record.root, self.names(), FORCE):
            return ""
        self.agent.driver.stop_turn()
        for _ in range(int(SETTLE / STEP)):
            if self.agent.driver.at_prompt():
                break
            time.sleep(STEP)
        self.carry_on = True
        self.controlled_at = 0.0
        return self.control(stopped=True) or "forced: stopped the turn, nothing was waiting"

    def control(self, stopped: bool = False) -> str:
        if not stopped and (self.agent.state() != IDLE or time.time() - self.controlled_at < TICK):
            return ""
        last = self.agent.driver.last_report()
        queued = take(self.record.root, self.names())
        if not queued:
            return ""
        self.agent.driver.send(queued["line"])
        self.controlled_at = time.time()
        if self.carry_on:
            self.carry_on = False
            self.agent.driver.send(CARRY_ON)
        if queued.get("action") and queued.get("label"):
            delivered(self.record, self.names(), queued["action"], queued["label"])
        row = Agents(self.record, actor=SYSTEM).by_session((last and last.title) or self.agent.driver.session)
        if queued.get("action") in row.pending:
            self.agent.mark(row.status or "", row.event or "", pending={k: v for k, v in row.pending.items() if k != queued["action"]})
        return f"controlled: {queued['label']}"

    def begin(self) -> str:
        driver = self.agent.driver
        if self.greeted or driver.last_report() is not None:
            return ""
        if time.time() - self.born < WAIT_FOR_REPORT or not driver.at_prompt():
            return ""
        self.greeted = True
        driver.send(hello(self.record.env))
        self.typed_at = time.time()
        return "typed the opening line"

    def deliver(self) -> str:
        if self.agent.driver.last_report() is None:       # the agent has not reported yet: it may still be at a dialog
            return "waiting for the agent's first report"
        count = 0
        for actor in self.actors:
            fresh = actor.cursor() == 0
            for e in self.record.events(actor.heard()):
                if fresh and e.at < self.born:
                    if actor is self.agent and TYPES[e.type].spoken:
                        CONTROLLERS[e.type](self.record, actor=AGENT).read(e.n)
                    actor.notified(e)
                    continue
                if e.actor == actor.name or actor.name not in TYPES[e.type].notify or self.private(e) or "seen" in e.data:
                    actor.notified(e)
                    continue
                actor.notify(e)
                count += 1
        waiting = len(self.agent.pending)
        if self.agent.flush():
            self.typed_at = time.time()
            return f"typed {waiting} in one line"
        return f"delivered {count}" if count else ""

    def nudge(self) -> str:
        if self.agent.state() != IDLE:
            return self.agent.state()
        last = self.agent.driver.last_report()
        if last and self.typed_at and float(last.at or 0) < self.typed_at:
            return "typed, waiting for the hooks"
        line = self.owed()
        if not line:
            return "nothing owed"
        self.agent.driver.send(line)
        self.typed_at = time.time()
        return f"typed: {line[:60]}"

    def owed(self) -> str:
        for type_ in PRIORITY:
            if AGENT not in TYPES[type_].notify or TYPES[type_].spoken:
                continue
            unread = CONTROLLERS[type_](self.record, actor=AGENT).unread()
            if unread:
                return f"{len(unread)} unread {type_}"
        return ""

    def branch(self) -> str:
        last = self.agent.driver.last_report()
        cwd = (last and last.cwd) or str(self.record.root.parent)
        if time.time() - self.branched_at < 10:
            return self.branch_name
        self.branched_at = time.time()
        try:
            self.branch_name = subprocess.run(["git", "-C", cwd, "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True, timeout=2).stdout.strip()
            remote = subprocess.run(["git", "-C", cwd, "remote", "get-url", "origin"], capture_output=True, text=True, timeout=2).stdout.strip()
        except (OSError, subprocess.SubprocessError):
            self.branch_name, remote = "", ""
        url = f"{web}/tree/{self.branch_name}" if self.branch_name and (web := web_remote(remote)) else ""
        if last and last.title and self.branch_name and (last.branch, last.branch_url) != (self.branch_name, url):
            self.agent.mark(last.status or "", last.event or "", branch=self.branch_name, branch_url=url, at=last.at)
        return self.branch_name

    def crew(self) -> None:
        last = self.agent.driver.last_report()
        path = last and last.title and last.transcript
        if not path or time.time() - self.crewed_at < 10:
            return
        self.crewed_at = time.time()
        try:
            size = Path(path).stat().st_size
        except OSError:
            return
        if size == self.crewed_size:
            return
        self.crewed_size = size
        facts = PROVIDERS[last.provider]().crew(Path(path)) if last.provider in PROVIDERS else {}
        if facts and any(last.data.get(k) != v for k, v in facts.items()):
            compacting = facts.get("compacting")
            status = COMPACTING if compacting else WORKING if compacting is False and last.status == COMPACTING else last.status or ""
            self.agent.mark(status, last.event or "", at=last.at, **facts)

    def step(self) -> None:
        pid = pid_of(self.agent.driver.session)
        command = steps.running(pid) if pid else ""
        if command == self.stepped:
            return
        self.stepped = command
        last = self.agent.driver.last_report()
        row = Agents(self.record, actor=SYSTEM).by_session((last and last.title) or self.agent.driver.session)
        running = dict(row.running)
        if not running.get(RUNNING.what) or running.get(RUNNING.done):
            return
        running[RUNNING.step] = command
        provider = PROVIDERS.get(self.agent.driver.name)
        running[RUNNING.step_effect] = provider().effect_of(command) if provider and command else ""
        self.agent.mark(row.status or "", row.event or "", running=running)

    def seat(self) -> None:
        self.branch()
        self.crew()
        self.step()
        last = self.agent.driver.last_report()
        write_json(self.record.root / "runtime" / f"seat-{self.agent.driver.session}.json", {"at": time.time(), "agent": self.agent.driver.name, "state": self.agent.state(), "env": self.record.env,
                                 "why": self.why, "printed": self.agent.driver.last_printed(),
                                 "report": {"title": last.title, **last.data} if last else {}})

    def run(self) -> None:
        self.start()
        while self.running:
            self.tick()
            time.sleep(TICK)

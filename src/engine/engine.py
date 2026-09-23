import time
from dataclasses import asdict, dataclass, field, replace

from pathlib import Path

from controllers.types import CONTROLLERS, Agents, Messages
import features
from engine import bus, chat, runtime
from engine.actors import Actor, Agent, BUSY, IDLE, STOPPED, System, User, WORKING, spoken_data
from engine.drivers import AGENT_COMMAND
from engine.inputs import BACKGROUND, FORCE, PAUSE, PERMIT, RESUME, SHELL, take, waiting_commands
from surfaces.control import CARRY_ON, RESUMED, delivered
from engine.record import Record
from engine.watch import STEADY_AFTER, steady, threw
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER, VIEW_ONLY, Event, titled
from resources.types import TYPES, priority
from engine.seat import Seat
from engine.wording import plural
from engine.transcript import PEER, SENT, turns
from engine.stored import read_json, write_json
from engine.fields import Loaded

CLOCK_EVERY = 5.0


def emit_clock(record: Record, session: str) -> None:
    row = Agents(record, actor=SYSTEM).by_session(session)
    bus.emit(Event(0, time.time(), "agent", row.n, "ticked", SYSTEM), record)

TICK = 1.0
STAMPED = "stamped"
SETTLE, STEP = 3.0, 0.1
TYPING_HOLD = 10.0

SILENT_AFTER = 120.0
PROBE_WAIT = 5.0


def after(written: list, line: int) -> list[str]:
    known = next((i for i, t in enumerate(written) if t.line == line), None)
    return [t.text for t in (written[known + 1:] if known is not None else written[-1:])]



@dataclass(frozen=True)
class PeerLog(Loaded):
    at: float = 0.0
    names: dict = field(default_factory=dict)

class Engine(Seat):
    def __init__(self, record: Record, driver):
        self.record = record
        self.agent = Agent(record, driver)
        driver.waiting = self.waiting
        self.actors: list[Actor] = [User(record), self.agent, System(record)]
        self.running = False
        self.born = time.time()
        self.branched_at = 0.0
        self.branch_name = ""
        self.branch_stamp = None
        self.crewed_at = 0.0
        self.crewed_size = -1
        self.subagents_ended: dict | None = None
        self.relayed = None
        self.peer_size = -1
        self.typed_at = 0.0
        self.ticked_at = 0.0
        self.probed_at = 0.0
        self.controlled_at = 0.0
        self.carry_on = False
        self.paused = False
        self.why = ""
        self.clean = 0

    def start(self) -> None:
        features.load(self.record.root)
        self.paused = bool(Agents(self.record, actor=SYSTEM).by_session(self.agent.driver.session).paused)
        self.running = True

    def stop(self) -> None:
        self.running = False

    def tick(self) -> str:
        self.agent.driver.pump()
        self.relay()
        self.relay_peers()
        self.ran()
        if not self.agent.driver.DISPLAY_HOOK:
            self.announce_written()
        self.why = (self.permitted() or self.pausing() or self.backgrounded() or self.probe() or self.forced() or self.typing() or self.shelled()
                    or self.control() or self.deliver() or self.nudge())
        self.seat()
        self.clock()
        return self.why

    def relay(self) -> None:
        f"engine-{self.agent.driver.session}"
        if self.relayed is None:
            self.relayed = self.record.last_event()
        for e in self.record.events(self.relayed):
            self.relayed = e.id
            features.passed(e, self.record)
            if not e.handled:
                bus.emit(e, self.record)

    def relay_peers(self) -> None:
        row = self.agent.driver.last_report()
        if not row or not row.title:
            return
        provider = PROVIDERS.get(row.provider)
        try:
            size = Path(row.transcript).stat().st_size if provider and row.transcript else -1
        except OSError:
            return
        if size < 0 or size == self.peer_size:
            return
        self.peer_size = size
        f = runtime.session_file(self.record.root, row.title, "peers.json")
        seen = read_json(f, None)
        log = PeerLog.from_json(seen)
        recent = sorted((t for t in provider().tail(row.transcript) if t.kind == PEER and t.who.startswith((f"{PEER}:", f"{SENT}:"))), key=lambda t: t.at)
        newest = max([t.at for t in recent] + [log.at])
        names = dict(log.names)
        for t in recent if seen is not None else []:
            if t.at <= log.at:
                continue
            kind, _, rest = t.who.partition(":")
            if kind == PEER:
                name, _, address = rest.partition(":")
                names[address] = name
                Messages(self.record, actor=AGENT).create(titled(t.text), brief=t.text, peer=name)
            else:
                Messages(self.record, actor=AGENT).create(titled(t.text), brief=t.text, sent_to=names.get(rest, rest))
        write_json(f, asdict(PeerLog(newest, names)))

    def announce_written(self) -> None:
        row = self.agent.driver.last_report()
        if not row or not row.title:
            return
        written = turns(self.record, row)
        f = runtime.announced_file(self.record.root, row.title)
        announced = read_json(f, None)
        now = {"line": written[-1].line if written else -1, "last_message": row.last_message or ""}
        if announced == now:
            return
        write_json(f, now)
        if announced is None:
            return
        stopped = [row.last_message] if row.last_message and row.event == "Stop" and row.last_message != announced.get("last_message") else []
        for text in [*after(written, announced["line"]), *stopped]:
            chat.send(self.record, row, text)

    def elsewhere(self, e) -> bool:
        meant = spoken_data(self.record, e).get("session")
        return bool(meant) and meant not in self.names()

    def probe(self) -> str:
        driver = self.agent.driver
        last = driver.last_report()
        if last is None or not driver.alive():
            return ""
        reported = float(last.at)
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

    def passed_over(self, actor, e) -> None:
        if actor is self.agent and TYPES[e.type].typed_as_title:
            CONTROLLERS[e.type](self.record, actor=AGENT).read(e.n)
        actor.notified(e)

    def addressed(self, e) -> bool:
        return spoken_data(self.record, e).get("session") in self.names()

    def names(self) -> set[str]:
        return {self.agent.driver.session, self.agent.driver.last_title()} - {""}

    def typing(self) -> str:
        driver = self.agent.driver
        if driver.user_typing(TYPING_HOLD):
            return "holding: the user is typing in the terminal"
        if driver.typed.exists():
            driver.clear_input()
            driver.typed.unlink(missing_ok=True)
        return ""

    def permitted(self) -> str:
        queued = take(self.record.root, self.names(), PERMIT)
        if not queued:
            return ""
        self.agent.driver.permit(queued.value == "allow")
        return f"permission: {queued.value}"

    def shelled(self) -> str:
        last = self.agent.driver.last_report()
        if last and last.data.get("asking"):
            return ""
        queued = take(self.record.root, self.names(), SHELL)
        if not queued:
            return ""
        driver = self.agent.driver
        typed = driver.run_command(queued.value) if queued.value.startswith(AGENT_COMMAND) else driver.run_shell(queued.value)
        agents = Agents(self.record, actor=SYSTEM)
        row = agents.by_session(queued.session)
        waiting = waiting_commands(row)
        kept = [replace(c, typed=time.time()) if c.at == queued.at else c for c in waiting if typed or c.at != queued.at]
        agents.update(row.n, queued_commands=[asdict(c) for c in kept])
        return f"typed in the terminal: {queued.value}" if typed else ""

    def ran(self) -> None:
        row = self.agent.driver.last_report()
        waiting = waiting_commands(row)
        provider = PROVIDERS.get(row.provider) if row else None
        if not any(c.typed for c in waiting) or not provider or not row.transcript:
            return
        runs = provider().shell_runs(Path(row.transcript))
        left = []
        for c in waiting:
            run = next((r for r in runs if c.typed and r[1] == c.command and r[0] >= c.typed - 1), None)
            if run:
                runs.remove(run)
            else:
                left.append(c)
        if len(left) != len(waiting):
            Agents(self.record, actor=SYSTEM).update(row.n, queued_commands=[asdict(c) for c in left])

    def pausing(self) -> str:
        if take(self.record.root, self.names(), PAUSE):
            self.agent.driver.stop_turn()
            self.paused = True
            self.agent.mark("", "", paused=time.time())
            return "paused: stopped the turn"
        if take(self.record.root, self.names(), RESUME):
            self.paused = False
            self.agent.mark("", "", paused=0)
            self.agent.driver.deliver(RESUMED)
            return "resumed"
        return "paused" if self.paused else ""

    def backgrounded(self) -> str:
        if not take(self.record.root, self.names(), BACKGROUND):
            return ""
        return "moved the running command to the background" if self.agent.driver.move_to_background() else ""

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
        self.agent.driver.press(queued.keys)
        self.controlled_at = time.time()
        if self.carry_on:
            self.carry_on = False
            self.agent.driver.deliver(CARRY_ON)
        if queued.action and queued.label:
            delivered(self.record, self.names(), queued.action, queued.label)
        row = Agents(self.record, actor=SYSTEM).by_session(last.title if last else self.agent.driver.session)
        if queued.action in row.pending:
            self.agent.mark(row.status, row.event, pending={k: v for k, v in row.pending.items() if k != queued.action})
        return f"controlled: {queued.label}"

    def deliver(self) -> str:
        if self.agent.driver.last_report() is None:
            return "waiting for the agent's first report"
        count = 0
        for actor in self.actors:
            fresh = actor.cursor() == 0
            for e in self.record.events(actor.delivered_until()):
                if e.type not in TYPES:
                    actor.notified(e)
                    continue
                if fresh and e.at < self.born and not self.addressed(e):
                    self.passed_over(actor, e)
                    continue
                caused = e.data.get("cause") == AGENT and not TYPES[e.type].addressed_to_agent
                mine = actor is self.agent and ((e.actor != USER and e.action not in TYPES[e.type].notify_actions) or caused)
                viewed = e.actor == USER and bool(e.data.get("fields")) and set(e.data["fields"]) <= set(VIEW_ONLY)
                if e.action == STAMPED or viewed or e.actor == actor.name or actor.name not in TYPES[e.type].notified or self.elsewhere(e) or "seen" in e.data or mine:
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
        if last and self.typed_at and float(last.at) < self.typed_at:
            return "typed, waiting for the hooks"
        line = self.owed()
        if not line:
            return "nothing owed"
        self.agent.driver.send(line)
        self.typed_at = time.time()
        return f"typed: {line[:60]}"

    def waiting(self) -> bool:
        from features.journal import waiting
        last = self.agent.driver.last_report()
        return bool(last) and waiting(self.record, last)

    def clock(self) -> None:
        if time.time() - self.ticked_at < CLOCK_EVERY:
            return
        self.ticked_at = time.time()
        emit_clock(self.record, self.agent.driver.last_title() or self.agent.driver.session)

    def owed(self) -> str:
        waiting = []
        for type_ in priority():
            if AGENT not in TYPES[type_].notified or TYPES[type_].typed_as_title:
                continue
            unread = [row["n"] for row in CONTROLLERS[type_](self.record, actor=AGENT).summaries()
                      if AGENT not in row["seen"] and not row["completed"] and not row["deleted"]]
            if unread:
                waiting.append(f"{plural(len(unread), f'unread {type_}')} {', '.join(map(str, unread[-5:]))}")
        return "waiting: " + "; ".join(waiting) if waiting else ""

    def step(self) -> None:
        try:
            self.tick()
            self.clean += 1
            if self.clean == STEADY_AFTER:
                steady(self.record)
        except Exception:
            self.clean = 0
            threw(self.record.root, self.record.env, "the engine", self.agent.driver)

    def run(self) -> None:
        self.start()
        while self.running:
            self.step()
            time.sleep(TICK)

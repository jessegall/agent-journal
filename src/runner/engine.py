import threading
import time
from dataclasses import asdict, dataclass, field, replace

from pathlib import Path

from controllers.requests import deliver
from controllers.types import CONTROLLERS, Agents, Messages, Notices, Notifications
import features
from engine.command_runs import command_runs
from engine import bus, clock, ran, runtime
from agents.actors import Actor, Agent, System, User, event_data
from resources.types import BUSY, FAILED, IDLE, STOPPED, WORKING
from providers.base import asking_row
from providers.drivers import AGENT_COMMAND
from engine.inputs import BACKGROUND, FORCE, PAUSE, PERMIT, RESUME, SHELL, UPDATE, filed, take, waiting_commands
from engine.record import Record
from controllers.faults import STEADY_AFTER, steady, threw
from providers import PROVIDERS
from providers.base import Provider
from providers.payload import HookEvent
from resources.base import AGENT, SYSTEM, USER, VIEW_ONLY, titled
from resources.types import TYPES, priority
from agents.seat import SeatReport
from engine.wording import plural
from engine.transcript import PEER
from providers.turns import turns
from runner.chat_mirror import send_row_to_chat
from engine.stored import Growth, read_json, write_json
from resources.fields import Loaded

CLOCK_EVERY = 5.0


def emit_beat(record: Record, session: str) -> None:
    row = Agents(record, actor=SYSTEM).by_session(session)
    clock.beat(record, row.n)


def emit_ticked(record: Record, session: str) -> None:
    row = Agents(record, actor=SYSTEM).by_session(session)
    clock.tick(record, row.n)


def emit_clock(record: Record, session: str) -> None:
    emit_beat(record, session)
    emit_ticked(record, session)

TICK = 1.0
STAMPED = "stamped"
SETTLE, STEP = 3.0, 0.1
OUTPUT_WAIT = 5.0
TYPING_HOLD = 10.0
DIALOG_AGAIN = 10.0

SILENT_AFTER = 120.0
LONG_COMMAND_AFTER = 1800.0
FORCE_AFTER = 30.0
PROBE_WAIT = 5.0


CARRY_ON = "Carry on with what you were doing; the model or effort change you were interrupted for is done."
RESUMED = "The user paused you and has resumed you now: carry on with what you were doing."
PAUSED_FOR_UPDATE = "The journal is updating, so you are paused: start no new command and wait; you will be told when to continue."
RESUMED_AFTER_UPDATE = "The journal has updated and resumed you now: carry on with exactly what you were doing; your open work stays open and is not to be parked."


def delivered(record, sessions: set[str], action: str, label: str) -> None:
    notices = Notices(record, actor=SYSTEM)
    for notice in notices.rows.every():
        if not notice.completed and notice.data.get("action") == action and notice.data.get("session") in sessions:
            notices.complete(notice.n, how="delivered")
    Notifications(record, actor=SYSTEM)._logged(f"{action.capitalize()} set to {label.lower()}", brief=f"The {action} change was typed into the agent.")


def asking(row) -> bool:
    return bool(row and row.asking)


@dataclass(frozen=True)
class PeerLog(Loaded):
    at: float = 0.0
    names: dict = field(default_factory=dict)


@dataclass(frozen=True)
class Announced(Loaded):
    """How far an agent's turns reached the chat: the transcript line and the Stop hook's last message."""

    line: int = -1
    last_message: str = ""


@dataclass(frozen=True)
class Reading:
    row: object
    provider: Provider
    transcript: Path


class Engine:
    def __init__(self, record: Record, driver):
        self.record = record
        self.agent = Agent(record, driver)
        driver.waiting = self.waiting
        self.actors: list[Actor] = [User(record), self.agent, System(record)]
        self.report = SeatReport(record, self.agent)
        self.born = time.time()
        self.relayed = None
        self.peer_growth = Growth()
        self.failure_growth = Growth()
        self.screen_call = ""
        self.dialog_at = 0.0
        self.typed_at = 0.0
        self.ticked_at = 0.0
        self.upkeep: threading.Thread | None = None
        self.probed_at = 0.0
        self.controlled_at = 0.0
        self.carry_on = False
        self.paused = False
        self.resumed_at = 0.0
        self.held_at = 0.0
        self.echoed_at = time.time()
        self.why = ""
        self.clean = 0

    def start(self) -> None:
        features.load(self.record.root)
        row = self.agent.driver.last_report()
        self.paused = row is not None and bool(row.paused)

    def tick(self) -> str:
        self.agent.driver.pump()
        self.agent.driver.recheck_channel()
        deliver(self.record.root)
        self.relay()
        self.relay_peers()
        self.ran()
        self.echoed()
        if not self.agent.driver.DISPLAY_HOOK:
            self.announce_written()
        self.screen_asks()
        self.dialog_settled()
        self.why = (self.permitted() or self.pausing() or self.backgrounded() or self.failed() or self.probe() or self.forced() or self.typing() or self.shelled()
                    or self.control() or self.deliver() or self.nudge())
        self.report.write(self.why)
        self.beat()
        self.clock()
        return self.why

    def reading(self) -> Reading | None:
        row = self.agent.driver.last_report()
        provider = PROVIDERS.get(row.provider) if row else None
        if provider is None or not row.transcript:
            return None
        return Reading(row, provider(), Path(row.transcript))

    def relay(self) -> None:
        if self.relayed is None:
            self.relayed = self.record.event_log.last_id()
        for e in self.record.event_log.events(self.relayed):
            self.relayed = e.id
            features.passed(e, self.record)
            if not e.handled:
                bus.emit(e, self.record)

    def relay_peers(self) -> None:
        reading = self.reading()
        if reading is None or not reading.row.title or not self.peer_growth.grew(reading.transcript):
            return
        row = reading.row
        f = runtime.session_file(self.record.root, row.title, "peers.json")
        seen = read_json(f, dict, None)
        log = PeerLog.from_json(seen)
        recent = sorted((t for t in reading.provider.last_turns(reading.transcript) if t.peer is not None), key=lambda t: t.at)
        newest = max([t.at for t in recent] + [log.at])
        names = dict(log.names)
        for t in recent if seen is not None else []:
            if t.at <= log.at:
                continue
            if t.peer.direction == PEER:
                names[t.peer.address] = t.peer.name
                made = Messages(self.record, actor=AGENT).create(titled(t.text), brief=t.text, peer=t.peer.name, from_session=t.peer.address)
                agents = Agents(self.record, actor=SYSTEM)
                agents.update(row.n, delivered=[*agents.load(row.n).delivered, made.ref])
            else:
                Messages(self.record, actor=AGENT).create(titled(t.text), brief=t.text, sent_to=names.get(t.peer.address, t.peer.address))
        write_json(f, asdict(PeerLog(newest, names)))

    def announce_written(self) -> None:
        row = self.agent.driver.last_report()
        if not row or not row.title:
            return
        written = turns(row)
        f = runtime.announced_file(self.record.root, row.title)
        kept = read_json(f, dict, None)
        now = Announced(written[-1].line if written else -1, row.last_message)
        if kept is None:
            write_json(f, asdict(now))
            return
        announced = Announced.from_json(kept)
        if (announced.line, announced.last_message) == (now.line, now.last_message):
            return
        stopped = [row.last_message] if row.last_message and row.event == HookEvent.STOP and row.last_message != announced.last_message else []
        known = next((i for i, turn in enumerate(written) if turn.line == announced.line), None)
        fresh = written[known + 1:] if known is not None else written[-1:]
        write_json(f, asdict(now))
        for turn in fresh:
            send_row_to_chat(self.record, row, turn.text, turn.key)
        for text in stopped:
            send_row_to_chat(self.record, row, text)

    def elsewhere(self, e) -> bool:
        meant = event_data(self.record, e).get("session")
        return bool(meant) and meant not in self.names()

    def failed(self) -> str:
        reading = self.reading()
        if reading is None or self.agent.state() not in (BUSY, WORKING) or not self.failure_growth.grew(reading.transcript):
            return ""
        failure = reading.provider.failure(reading.transcript)
        if failure is None or failure.at < float(reading.row.at):
            return ""
        self.agent.mark(IDLE, FAILED, failure=failure.message)
        self.noted(f"The turn ended in an error: {failure.message}")
        return f"the turn failed: {failure.message}"

    def probe(self) -> str:
        driver = self.agent.driver
        last = driver.last_report()
        if last is None or not driver.alive():
            return ""
        reported = float(last.at)
        silent = time.time() - max(reported, self.typed_at, self.resumed_at, self.born) >= SILENT_AFTER and driver.quiet_for() >= SILENT_AFTER and (not last.command_running or last.command_running_for >= LONG_COMMAND_AFTER)
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
        if silent and self.agent.state() in (BUSY, WORKING) and not driver.asking():
            driver.interrupt()
            self.probed_at = time.time()
            return "silent for two minutes: probing with Ctrl-C"
        return ""

    def passed_over(self, actor, e) -> None:
        if actor is self.agent and TYPES[e.type].typed_as_title:
            CONTROLLERS[e.type](self.record, actor=AGENT).read(e.n)
        actor.notified(e)

    def addressed(self, e) -> bool:
        return event_data(self.record, e).get("session") in self.names()

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

    def screen_asks(self) -> None:
        driver = self.agent.driver
        row = driver.last_report() if driver.ASKS_ON_SCREEN else None
        if row is None:
            return
        asked = asking_row(driver.asked())
        if asked.get("call") == row.asking.get("call") or (not asked and row.asking.get("call") != self.screen_call):
            return
        self.screen_call = asked.get("call", "")
        Agents(self.record, actor=SYSTEM).update(row.n, asking=asked)

    def dialog_settled(self) -> None:
        """Answers a dialog of the agent's own tool that only needs the safe choice, such as Claude Code's rewind dialog near its context limit: Summarize up to here, never Restore conversation."""
        driver = self.agent.driver
        option = driver.dialog() if driver.DIALOGS else 0
        if option and time.time() - self.dialog_at >= DIALOG_AGAIN:
            self.dialog_at = time.time()
            driver.press_raw(f"{option}\r".encode())

    def permitted(self) -> str:
        queued = take(self.record.root, self.names(), PERMIT)
        if not queued:
            return ""
        self.agent.driver.permit(queued.value == "allow")
        return f"permission: {queued.value}"

    def shelled(self) -> str:
        if asking(self.agent.driver.last_report()):
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
        if typed:
            self.typed(row, [queued.value])
        return f"typed in the terminal: {queued.value}" if typed else ""

    def typed(self, row, commands: list[str]) -> None:
        provider = PROVIDERS.get(row.provider)
        if provider and provider.echoes_typed:
            return
        for command in commands:
            ran.announce(self.record, row.n, ran.TYPED, command)

    def echoed(self) -> None:
        reading = self.reading()
        if reading is None or not reading.provider.echoes_typed:
            return
        row = reading.row
        for run in reading.provider.typed_runs(reading.transcript):
            if run.at <= self.echoed_at:
                continue
            if run.output is None and time.time() - run.at < OUTPUT_WAIT:
                return
            if run.output is None:
                ran.announce(self.record, row.n, ran.TYPED, run.command, at=run.at)
            else:
                ran.announce(self.record, row.n, ran.TYPED, run.command, run.output, at=run.at)
            self.echoed_at = run.at

    def noted(self, line: str, tool: str = ran.NOTED) -> None:
        row = self.agent.driver.last_report()
        if row is not None:
            ran.announce(self.record, row.n, tool, line)

    def held(self, line: str) -> str:
        self.agent.driver.stop_turn()
        self.held_at = time.time()
        self.noted(line)
        return line

    def ran(self) -> None:
        row = self.agent.driver.last_report()
        waiting = waiting_commands(row)
        reading = self.reading()
        if not any(c.typed for c in waiting) or reading is None:
            return
        runs = reading.provider.shell_runs(reading.transcript)
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
        if asked := take(self.record.root, self.names(), PAUSE):
            self.paused = True
            self.agent.mark("", "", paused=time.time(), paused_for=asked.value)
            if asked.value == UPDATE:
                self.agent.driver.send(PAUSED_FOR_UPDATE, now=True)
            return self.held("Paused")
        if asked := take(self.record.root, self.names(), RESUME):
            if not self.agent.driver.send(RESUMED_AFTER_UPDATE if asked.value == UPDATE else RESUMED, now=True):
                filed(self.record.root, asked)
                return "paused"
            self.paused = False
            self.resumed_at = time.time()
            self.agent.mark("", "", paused=0, paused_for="")
            self.noted("Continued")
            return "resumed"
        if not self.paused:
            return ""
        if self.agent.state() in (BUSY, WORKING) and time.time() - self.held_at > SETTLE:
            return self.held("Interrupted: the agent is paused")
        return "paused"

    def backgrounded(self) -> str:
        asked = take(self.record.root, self.names(), BACKGROUND)
        if not asked:
            return ""
        if asked.value and not self.still_running(asked.value):
            return "dropped the move to the background: that command has ended"
        return "moved the running command to the background" if self.agent.driver.move_to_background() else ""

    def still_running(self, started: str) -> bool:
        row = self.agent.driver.last_report()
        return bool(row) and any(str(one.at) == started and not one.done for one in command_runs(row))

    def forced(self) -> str:
        if not take(self.record.root, self.names(), FORCE) or self.agent.state() == IDLE:
            return ""
        self.agent.driver.stop_turn()
        self.noted("Interrupted")
        for _ in range(int(SETTLE / STEP)):
            if self.agent.driver.at_prompt():
                break
            time.sleep(STEP)
        self.carry_on = True
        self.controlled_at = 0.0
        return self.control(stopped=True) or "forced: stopped the turn, nothing was waiting"

    def control(self, stopped: bool = False) -> str:
        if not stopped and time.time() - self.controlled_at < TICK:
            return ""
        last = self.agent.driver.last_report()
        at_once = PROVIDERS.get(self.agent.driver.name, Provider).applies_at_once
        idle = stopped or self.agent.state() == IDLE
        if not idle and (not at_once or asking(last)):
            return ""
        queued = take(self.record.root, self.names()) if idle else take(self.record.root, self.names(), among=at_once)
        if not queued:
            return ""
        self.agent.driver.press(queued.keys)
        self.controlled_at = time.time()
        if self.carry_on:
            self.carry_on = False
            self.agent.driver.send(CARRY_ON, now=True)
        if queued.action and queued.label:
            delivered(self.record, self.names(), queued.action, queued.label)
        row = Agents(self.record, actor=SYSTEM).by_session(last.title if last else self.agent.driver.session)
        self.typed(row, [key for key in queued.keys if key.strip() and key.isprintable()])
        if queued.action in row.pending:
            self.agent.mark(row.status, row.event, pending={k: v for k, v in row.pending.items() if k != queued.action})
        return f"controlled: {queued.label}"

    def deliver(self) -> str:
        if self.agent.driver.last_report() is None and not self.idle_without_report():
            return "waiting for the agent's first report"
        count = 0
        for actor in self.actors:
            fresh = actor.cursor() == 0
            for e in self.record.event_log.events(actor.delivered_until()):
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
        flushed = time.time()
        line = self.agent.flush()
        if line:
            self.typed_at = time.time()
            self.noted(line, ran.DELIVERED)
            if self.agent.driver.sent_now >= flushed:
                self.moved_on()
            return f"typed {waiting} in one line"
        return f"delivered {count}" if count else ""

    def moved_on(self) -> None:
        row = self.agent.driver.last_report()
        if row is not None:
            Agents(self.record, actor=SYSTEM)._noted_on_move(row, "Your message went in while the command runs on")

    def idle_without_report(self) -> bool:
        driver = self.agent.driver
        return driver.at_prompt() and driver.quiet_for() >= FORCE_AFTER

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
        self.noted(line, ran.DELIVERED)
        return f"typed: {line[:60]}"

    def waiting(self) -> bool:
        from features.journal import waiting
        last = self.agent.driver.last_report()
        return bool(last) and waiting(self.record, last)

    def session_ticked(self) -> str:
        return self.agent.driver.last_title() or self.agent.driver.session

    def beat(self) -> None:
        emit_beat(self.record, self.session_ticked())

    def clock(self) -> None:
        """The slow upkeep runs on its own thread, one at a time, so a long run of it never keeps the engine from its next tick."""
        if time.time() - self.ticked_at < CLOCK_EVERY or (self.upkeep and self.upkeep.is_alive()):
            return
        self.ticked_at = time.time()
        self.upkeep = threading.Thread(target=self.kept_up, args=(self.session_ticked(),), daemon=True)
        self.upkeep.start()

    def kept_up(self, session: str) -> None:
        try:
            emit_ticked(self.record, session)
        except Exception:
            threw(self.record.root, self.record.env, "the engine's upkeep", self.agent.driver)

    def owed(self) -> str:
        waiting = []
        for type_ in priority():
            if AGENT not in TYPES[type_].notified or TYPES[type_].typed_as_title:
                continue
            unread = [row["n"] for row in CONTROLLERS[type_](self.record, actor=AGENT).rows.standing_summaries()
                      if AGENT not in row["seen"]
                      and (type_ != "worktree" or row.get("environment") == self.record.env)]
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

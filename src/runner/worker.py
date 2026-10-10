import signal
import sys
import threading
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from providers import DRIVERS  # noqa: E402
from engine import viewer  # noqa: E402
from engine.services import Manager  # noqa: E402
from runner.engines import ENDING, supervise  # noqa: E402
from features.plugins.services import plugin_services  # noqa: E402
from engine import runtime  # noqa: E402
from controllers.faults import threw  # noqa: E402
from engine.stop import asked, session_flag  # noqa: E402
from supervisor import HEAL, RELAUNCH, RELOAD, STOP  # noqa: E402
from agents.terminal import TerminalSession, seated  # noqa: E402
from agents.actors import Agent  # noqa: E402
from engine.record import Record  # noqa: E402
from controllers.types import Notices, Notifications  # noqa: E402
from providers.dialogs import Asking, Choice, Menu  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from engine.package import CODE, installed_digest, noticed_digest, own_build  # noqa: E402
from engine.sessions import Sessions, hold_build  # noqa: E402
import features  # noqa: E402
from features.switches import watch_change_log  # noqa: E402
from features.auto_update.check import UpdateCheck  # noqa: E402
from features.auto_update.relaunch import Relaunch  # noqa: E402
from features.work_tracking.auto import CheckIn  # noqa: E402

TICK = 0.25
RELOAD_EVERY = 1.0
VIEWER_EVERY = 10.0
SERVICES_EVERY = 1.0
CHECKS_EVERY = 1.0
SERVER_CRASHES = 3
RETRY_AFTER = 1.0
STARTUP, EARLY = 30.0, 16384
CONSENT_EVERY = 3.0
DIALOG_EVERY, DIALOG_QUIET = 1.0, 1.5
KEY_BEFORE, KEY_ECHO = 3.0, 2.0
TERMINATED = threading.Event()


def keep_viewer(root: Path, cwd: Path, watching, exits: list) -> object:
    if watching and watching.is_alive():
        return watching
    thread = threading.Thread(target=lambda: exits.append(viewer.launch(root, cwd)[1]), daemon=True)
    thread.start()
    return thread


def watch_server(root: Path, env: str, ending: threading.Event) -> None:
    stuck = viewer.StuckServer(root, env)
    while not ending.wait(VIEWER_EVERY):
        kept = stuck.restarted()
        if kept:
            Notifications(Record(root, env), actor=SYSTEM).create("The viewer stopped answering, so the journal restarted it",
                                                                    brief=f"Its requests were stuck for half a minute. What each thread was doing is kept in {kept}.")


def moved(seat: TerminalSession) -> bool:
    return Sessions(seat.root).environment(seat.session) not in ("", seat.env)


def crashing(exits: list) -> bool:
    return len(exits) >= SERVER_CRASHES and all(exits[-SERVER_CRASHES:])


def checks(seat: TerminalSession, driver) -> list:
    try:
        features.load()
        watcher = Agent(driver.record, driver)
        return [CheckIn(watcher), UpdateCheck(watcher), Relaunch(watcher)]
    except Exception:
        threw(seat.root, seat.env, "starting the worker's checks")
        return []


def run_checks(seat: TerminalSession, driver, kept: list) -> None:
    for step in [driver.pump, *(check.tick for check in kept)] if kept else []:
        try:
            step()
        except Exception:
            threw(seat.root, seat.env, f"a worker check: {type(getattr(step, '__self__', step)).__name__}")


def run_services(seat: TerminalSession, services: Manager) -> None:
    try:
        services.tick()
    except Exception:
        threw(seat.root, seat.env, "the worker's services")


class Confirm:
    def __init__(self, driver):
        self.driver = driver
        self.at = self.driver.printed.stat().st_size if self.driver.printed.is_file() else 0
        self.started = self.consented = time.time()
        self.ready = 0.0
        self.answered = False

    def tick(self) -> None:
        if self.answered or time.time() - self.started >= STARTUP or not self.driver.printed.is_file():
            return
        fresh = self.driver.printed.stat().st_size - self.at
        early = self.driver.printed_tail(min(fresh, EARLY)) if fresh > 0 else b""
        if self.driver.consent(early):
            self.consent(early)
            return
        opening = self.driver.opening(early)
        self.ready = (self.ready or time.time()) if opening else 0.0
        if opening and time.time() - self.ready >= self.driver.CONFIRM_AFTER:
            self.answered = True
            self.driver.send(opening, now=True)

    def consent(self, early: bytes) -> None:
        if time.time() - self.consented < CONSENT_EVERY:
            return
        self.consented = time.time()
        self.driver.press_raw(self.driver.consent(early))


class Dialogs:
    """Answers any menu the program itself puts on an agent's terminal, a consent, a folder to trust, a data-sharing question, so the agent is never held by one; it says once what it chose, and leaves a menu alone that a key opened or that a key was pressed in."""

    def __init__(self, driver):
        self.driver = driver
        self.said: tuple = ()
        self.seen: tuple = ()
        self.seen_at = self.pressed_at = 0.0
        self.yours = False
        self.at = 0.0
        self.asking = Asking(driver)

    def tick(self) -> None:
        if time.time() - self.at < DIALOG_EVERY:
            return
        self.at = time.time()
        menu = Menu.on(self.driver.screen(self.driver.PROMPT_TAIL))
        report = self.driver.last_report()
        if menu is None or not menu.foreign() or (report and report.asking):
            self.said = self.seen = ()
            return
        if menu.signature() != self.seen:
            self.seen, self.seen_at = menu.signature(), time.time()
            self.yours = self.driver.keyed_at() > self.seen_at - KEY_BEFORE
        keyed = self.driver.keyed_at()
        self.yours = self.yours or keyed > max(self.seen_at, self.pressed_at + KEY_ECHO)
        if self.yours or self.driver.quiet_for() < DIALOG_QUIET:
            return
        decided = self.decide(menu)
        if decided is None:
            return
        choice, source = decided
        self.driver.press_raw(choice.keys)
        self.pressed_at = time.time()
        if menu.signature() != self.said:
            self.said = menu.signature()
            Notices(self.driver.record, actor=SYSTEM).create(f"A menu in {self.driver.name}'s terminal was answered", tone="note", brief=f'"{menu.question[-200:]}" The journal {choice.said}, {source}.')

    def decide(self, menu: Menu) -> tuple[Choice, str] | None:
        """What to press and where the choice came from: memory, the word rules, then a dispatched agent whose pick is stored; none while that agent is still answering."""
        taken = menu.remembered(self.driver.record)
        if taken:
            return menu.choice(taken), "from memory"
        taken = menu.wanted()
        if taken:
            return menu.choice(taken), "by the word rules"
        self.asking.start(menu)
        if self.asking.pending(menu):
            return None
        if self.asking.answered(menu):
            taken = self.asking.answer(menu)
            menu.remember(self.driver.record, taken)
            return menu.choice(taken), "as an asked agent said"
        return menu.choice(), "because even the asked agent could not say"


def run(root: Path, cwd: Path, env: str, agent: str, session: str, lifeline: int = -1) -> int:
    hold_build(root, CODE)
    watch_change_log()
    seat = seated(TerminalSession(root, env, agent, session))
    relaunching = runtime.relaunch_file(root, session)
    stopping = session_flag(root, session)
    stamps = installed_digest(root)
    began = time.time()
    driver = DRIVERS[agent](Record(root, env), session)
    confirm = Confirm(driver)
    dialogs = Dialogs(driver)
    kept = checks(seat, driver)
    services = Manager(root, lifeline, sources=(plugin_services,), faulted=lambda where: threw(root, env, where))
    last_check = last_viewer = last_services = last_checks = 0.0
    watching = None
    exits: list = []
    keeps = own_build(root)
    engines = threading.Event()
    supervising = threading.Thread(target=supervise, args=(root, engines), daemon=True)
    if keeps:
        supervising.start()
        threading.Thread(target=watch_server, args=(root, env, engines), daemon=True).start()
    try:
        while True:
            time.sleep(TICK)
            confirm.tick()
            dialogs.tick()
            if asked(root, began) or stopping.is_file() or TERMINATED.is_set():
                stopping.unlink(missing_ok=True)
                return STOP
            if relaunching.is_file():
                return RELAUNCH
            now = time.time()
            if keeps and now - last_services >= SERVICES_EVERY:
                last_services = now
                run_services(seat, services)
            if keeps and now - last_viewer >= (RETRY_AFTER if exits and exits[-1] else VIEWER_EVERY):
                last_viewer = now
                watching = keep_viewer(root, cwd, watching, exits)
                if crashing(exits):
                    return HEAL
            if now - last_checks >= CHECKS_EVERY:
                last_checks = now
                if moved(seat):
                    return RELOAD
                if not kept:
                    kept = checks(seat, driver)
                run_checks(seat, driver, kept)
            if now - last_check >= RELOAD_EVERY:
                last_check = now
                if noticed_digest(root) != stamps and not runtime.upgrading(root):
                    return RELOAD
    finally:
        engines.set()
        if keeps:
            supervising.join(timeout=ENDING)


def ended(signum, frame) -> None:
    TERMINATED.set()


if __name__ == "__main__":
    signal.signal(signal.SIGTERM, ended)
    root, cwd, env, agent, session = sys.argv[1:6]
    raise SystemExit(run(Path(root), Path(cwd), env, agent, session, int(sys.argv[6]) if len(sys.argv) > 6 else -1))

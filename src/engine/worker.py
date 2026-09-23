import sys
import threading
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from providers import DRIVERS  # noqa: E402
from engine import viewer  # noqa: E402
from engine.services import Manager  # noqa: E402
from engine import typist  # noqa: E402
from engine import runtime  # noqa: E402
from engine.watch import threw  # noqa: E402
from engine.stop import asked  # noqa: E402
from engine.terminal import HEAL, RELAUNCH, RELOAD, STOP, Seat, seated, watched  # noqa: E402
from engine.actors import Agent  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.package import CODE  # noqa: E402
from engine.sessions import hold_build  # noqa: E402
import features  # noqa: E402
from features.auto_update.check import Relaunch, UpdateCheck  # noqa: E402
from features.work_tracking.auto import CheckIn  # noqa: E402

TICK = 0.25
RELOAD_EVERY = 1.0
VIEWER_EVERY = 10.0
SERVICES_EVERY = 1.0
CHECKS_EVERY = 1.0
SERVER_CRASHES = 3
RETRY_AFTER = 1.0
STARTUP, EARLY = 30.0, 16384
ENTER_AFTER = 0.3


def keep_viewer(root: Path, cwd: Path, watching, exits: list) -> object:
    if watching and watching.is_alive():
        return watching
    thread = threading.Thread(target=lambda: exits.append(viewer.launch(root, cwd)[1]), daemon=True)
    thread.start()
    return thread


def crashing(exits: list) -> bool:
    return len(exits) >= SERVER_CRASHES and all(exits[-SERVER_CRASHES:])


def checks(seat: Seat) -> tuple:
    try:
        features.load()
        record = Record(seat.root, seat.env)
        watcher = Agent(record, DRIVERS[seat.agent](record, seat.session))
        return watcher.driver, (CheckIn(watcher), UpdateCheck(watcher), Relaunch(watcher))
    except Exception:
        threw(seat.root, seat.env, "starting the worker's checks")
        return None, ()


def run_checks(root: Path, driver, kept: tuple) -> None:
    try:
        if driver:
            driver.pump()
        for check in kept:
            check.tick()
    except Exception:
        threw(root, runtime.env(root), "a worker check")


def press(root: Path, session: str, keys: bytes) -> None:
    text = keys.rstrip(b"\r")
    if text:
        typist.send(root, session, text)
        time.sleep(ENTER_AFTER)
    if len(text) < len(keys):
        typist.send(root, session, keys[len(text):])


class Confirm:
    def __init__(self, root: Path, session: str, agent: str):
        self.root, self.session, self.agent = root, session, agent
        self.printed = runtime.session_file(root, session, "printed")
        self.at = self.printed.stat().st_size if self.printed.is_file() else 0
        self.started = time.time()
        self.answered = False

    def tick(self) -> None:
        if self.answered or time.time() - self.started >= STARTUP or not self.printed.is_file():
            return
        with self.printed.open("rb") as f:
            f.seek(max(self.at, self.printed.stat().st_size - EARLY))
            early = f.read()
        keys = DRIVERS[self.agent].confirm(early)
        if keys:
            self.answered = True
            time.sleep(DRIVERS[self.agent].CONFIRM_AFTER)
            press(self.root, self.session, keys)


def run(root: Path, cwd: Path, env: str, agent: str, session: str, lifeline: int = -1) -> int:
    hold_build(root, CODE)
    seat = Seat(root, env, agent, session)
    seated(seat)
    relaunching = runtime.relaunch_file(root, session)
    stamps = watched(root)
    began = time.time()
    confirm = Confirm(root, session, agent)
    last_check = last_viewer = last_services = last_checks = 0.0
    watching = None
    exits: list = []
    driver, kept = checks(seat)
    services = Manager(root, lifeline)
    while True:
        time.sleep(TICK)
        confirm.tick()
        if asked(root, began):
            return STOP
        if relaunching.is_file():
            return RELAUNCH
        now = time.time()
        if now - last_services >= SERVICES_EVERY:
            last_services = now
            services.tick()
        if now - last_viewer >= (RETRY_AFTER if exits and exits[-1] else VIEWER_EVERY):
            last_viewer = now
            watching = keep_viewer(root, cwd, watching, exits)
            if crashing(exits):
                return HEAL
        if now - last_checks >= CHECKS_EVERY:
            last_checks = now
            if not kept:
                driver, kept = checks(seat)
            run_checks(root, driver, kept)
        if now - last_check >= RELOAD_EVERY:
            last_check = now
            if watched(root) != stamps and not runtime.upgrading(root):
                return RELOAD


if __name__ == "__main__":
    root, cwd, env, agent, session = sys.argv[1:6]
    raise SystemExit(run(Path(root), Path(cwd), env, agent, session, int(sys.argv[6]) if len(sys.argv) > 6 else -1))

import fcntl
import os
import re
import select
import signal
import struct
import sys
import termios
import threading
import time
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine import band  # noqa: E402
from providers import DRIVERS  # noqa: E402
from engine import viewer  # noqa: E402
from engine.services import Manager  # noqa: E402
from engine import typist  # noqa: E402
from engine import runtime  # noqa: E402
from engine.stop import asked  # noqa: E402
from engine.terminal import HEAL, RELAUNCH, RELOAD, STOP, watched  # noqa: E402
from engine.actors import Agent  # noqa: E402
from engine.record import Record  # noqa: E402
import features  # noqa: E402
from features.auto_update.check import UpdateCheck  # noqa: E402
from features.work_tracking.auto import CheckIn  # noqa: E402
from engine.stored import write_json  # noqa: E402

ESCAPES = re.compile(rb"\x1b(?:\[[\x30-\x3f]*[\x20-\x2f]*[\x40-\x7e]|\][^\x07\x1b]*(?:\x07|\x1b\\)|[P_^X][^\x1b]*\x1b\\|O[\x40-\x7e]|[@-_])")
RELOAD_EVERY = 5.0
VIEWER_EVERY = 10.0
SERVICES_EVERY = 1.0
TYPED_EVERY = 1.0
CHECKS_EVERY = 1.0
SERVER_CRASHES = 3
RETRY_AFTER = 1.0


def press(fd: int, keys: bytes) -> None:
    text = keys.rstrip(b"\r")
    if text:
        os.write(fd, text)
        time.sleep(ENTER_AFTER)
    if len(text) < len(keys):
        os.write(fd, keys[len(text):])

def typing(data: bytes) -> bool:
    return any(byte >= 0x20 for byte in ESCAPES.sub(b"", data))


def size() -> tuple[int, int]:
    try:
        rows, cols = struct.unpack("HHHH", fcntl.ioctl(sys.stdout.fileno(), termios.TIOCGWINSZ, b"\0" * 8))[:2]
        return rows or 24, cols or 80
    except OSError:
        return 24, 80


def resize(fd: int) -> tuple[int, int]:
    rows, cols = size()
    try:
        fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", max(rows - (band.ROWS if band.SHOWN else 0), 4), cols, 0, 0))
    except OSError:
        pass
    return rows, cols


REDRAWS = (b"\x1b[2J", b"\x1b[?1049h", b"\x1b[?1049l", b"\x1b[r")
RESET = b"\x1bc"
STARTUP, EARLY = 30.0, 16384
ENTER_AFTER = 0.3
FRAME_END = b"\x1b[?25h"


def keep_viewer(root: Path, cwd: Path, watching, exits: list) -> object:
    if watching and watching.is_alive():
        return watching
    thread = threading.Thread(target=lambda: exits.append(viewer.launch(root, cwd)[1]), daemon=True)
    thread.start()
    return thread


def crashing(exits: list) -> bool:
    return len(exits) >= SERVER_CRASHES and all(exits[-SERVER_CRASHES:])


def checks(root: Path, env: str, agent: str, session: str) -> tuple:
    try:
        features.load()
        record = Record(root, env)
        watcher = Agent(record, DRIVERS[agent](record, session))
        return watcher.driver, (CheckIn(watcher), UpdateCheck(watcher))
    except Exception:
        failed(root, "the checks could not start")
        return None, ()


def run_checks(root: Path, driver, kept: tuple) -> None:
    try:
        if driver:
            driver.pump()
        for check in kept:
            check.tick()
    except Exception:
        failed(root, "a check failed")


def failed(root: Path, what: str) -> None:
    with (root / "runtime" / "supervisor.log").open("a") as log:
        log.write(f"{time.ctime()} {what}\n{traceback.format_exc()}\n")


def run(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str, lifeline: int = -1) -> int:
    rows, cols = resize(fd)
    top = band.Band(root, env, session, root.resolve().parent.name)
    rows_below = band.Translator(rows)
    drawn = top.draw if band.SHOWN else (lambda *_, **__: b"")
    shifted = rows_below.feed if band.SHOWN else (lambda data: data)
    unshifted = band.unshifted if band.SHOWN else (lambda data: data)
    printed = runtime.session_file(root, session, "printed")
    typed = runtime.session_file(root, session, "typed")
    typed_at = 0.0
    relaunching = runtime.relaunch_file(root, session)
    printed.parent.mkdir(parents=True, exist_ok=True)
    out = printed.open("ab")
    screen = runtime.session_file(root, session, "screen").open("ab")
    inbox = typist.listen(root, session)
    answered = False
    early = b""
    queued, due = b"", 0.0
    started = time.time()
    stamps = watched(root)
    stdin, stdout = sys.stdin.fileno(), sys.stdout.fileno()
    shape = [rows, cols]
    result = 0

    def show(data: bytes) -> None:
        os.write(stdout, data)
        screen.write(data)
        screen.flush()

    def sized() -> None:
        write_json(runtime.session_file(root, session, "screen.json"), {"rows": shape[0], "cols": shape[1], "at": screen.tell(), "printed": out.tell()})

    def frame() -> None:
        shape[0], shape[1] = resize(fd)
        rows_below.rows = shape[0]
        where.resized(shape[0], shape[1])
        sized()
        if band.SHOWN:
            show(b"\x1b[2J" + drawn(shape[1], force=True, cursor=where, first=band.region(shape[0])))

    where = band.Cursor(rows, cols)
    signal.signal(signal.SIGWINCH, lambda *_: frame())
    sized()
    show(drawn(cols, force=True, cursor=where, first=band.region(rows)))
    began = time.time()
    last_check = 0.0
    last_viewer = 0.0
    last_services = 0.0
    watching = None
    exits: list = []
    driver, kept = checks(root, env, agent, session)
    last_checks = 0.0
    services = Manager(root, lifeline)
    last_band = 0.0
    last_out = 0.0
    BETWEEN_FRAMES = 0.12
    try:
        while True:
            ready, _, _ = select.select([fd, stdin, inbox], [], [], 0.5)
            if inbox in ready:
                for raw in typist.receive(inbox):
                    os.write(fd, raw)
            if fd in ready:
                try:
                    data = os.read(fd, 65536)
                except OSError:
                    break
                if not data:
                    break
                last_out = time.time()
                visible = shifted(data)
                show(visible)
                where.feed(visible)
                early = (early + data)[-EARLY:] if not answered else early
                if RESET in data:
                    rows_below.margins = None
                    show(drawn(shape[1], force=True, cursor=where, first=band.region(shape[0])))
                elif any(mark in data for mark in REDRAWS):
                    show(drawn(shape[1], force=True, cursor=where, first=rows_below.region()))
                elif data.rstrip().endswith(FRAME_END):
                    show(drawn(shape[1], cursor=where))
                out.write(data)
                out.flush()
            if queued and time.time() >= due:
                press(fd, queued)
                queued = b""
            if not answered and time.time() - started < STARTUP:
                if (keys := DRIVERS[agent].confirm(early)):
                    answered = True
                    queued, due = keys, time.time() + DRIVERS[agent].CONFIRM_AFTER
            elif not answered and early:
                answered, early = True, b""
            if time.time() - last_band >= 1.0 and time.time() - last_out >= BETWEEN_FRAMES and where.sure:
                last_band = time.time()
                show(drawn(shape[1], cursor=where))
            if stdin in ready:
                data = os.read(stdin, 65536)
                if not data:
                    result = STOP
                    break
                os.write(fd, unshifted(data))
                if b"\r" in data or b"\n" in data:
                    typed.unlink(missing_ok=True)
                elif typing(data) and time.time() - typed_at >= TYPED_EVERY:
                    typed.touch()
                    typed_at = time.time()
            if asked(root, began):
                result = STOP
                break
            if relaunching.is_file():
                result = RELAUNCH
                break
            now = time.time()
            if now - last_services >= SERVICES_EVERY:
                last_services = now
                services.tick()
            if now - last_viewer >= (RETRY_AFTER if exits and exits[-1] else VIEWER_EVERY):
                last_viewer = now
                watching = keep_viewer(root, cwd, watching, exits)
                if crashing(exits):
                    result = HEAL
                    break
            if now - last_checks >= CHECKS_EVERY:
                last_checks = now
                run_checks(root, driver, kept)
            if now - last_check >= RELOAD_EVERY:
                last_check = now
                if watched(root) != stamps:
                    result = RELOAD
                    break
    finally:
        signal.signal(signal.SIGWINCH, signal.SIG_DFL)
        typist.close(inbox, root, session)
        out.close()
    return result


if __name__ == "__main__":
    root, cwd, env, agent, fd, session = sys.argv[1:7]
    raise SystemExit(run(Path(root), Path(cwd), env, agent, int(fd), session, int(sys.argv[7]) if len(sys.argv) > 7 else -1))

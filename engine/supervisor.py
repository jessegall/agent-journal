import fcntl
import os
import re
import select
import signal
import struct
import subprocess
import sys
import termios
import threading
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine import band  # noqa: E402
from engine.drivers import DRIVERS  # noqa: E402
from engine import viewer  # noqa: E402
from engine.services import Manager  # noqa: E402
from engine import watch  # noqa: E402
from engine.stop import asked  # noqa: E402
from engine.terminal import RELOAD, STOP, watched  # noqa: E402

ESCAPES = re.compile(rb"\x1b(?:\[[\x30-\x3f]*[\x20-\x2f]*[\x40-\x7e]|\][^\x07\x1b]*(?:\x07|\x1b\\)|O[\x40-\x7e]|[@-_])")
RELOAD_EVERY = 5.0
VIEWER_EVERY = 10.0
SERVICES_EVERY = 1.0
TYPED_EVERY = 1.0


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
        fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", max(rows - band.ROWS, 4), cols, 0, 0))
    except OSError:
        pass
    return rows, cols


REDRAWS = (b"\x1b[2J", b"\x1b[?1049h", b"\x1b[?1049l", b"\x1bc", b"\x1b[r")
STARTUP, EARLY = 10.0, 16384
FRAME_END = b"\x1b[?25h"


def spawn_driver(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str) -> subprocess.Popen:
    main = Path(__file__).resolve().with_name("engine_main.py")
    said = watch.log_file(root)
    said.parent.mkdir(parents=True, exist_ok=True)
    return subprocess.Popen([sys.executable, str(main), str(root), env, agent, str(fd), session], cwd=cwd, pass_fds=(fd,),
                            stderr=said.open("a"))


def stop_driver(driver: subprocess.Popen) -> None:
    if driver.poll() is not None:
        return
    driver.terminate()
    try:
        driver.wait(timeout=5)
    except subprocess.TimeoutExpired:
        driver.kill()
        driver.wait()


def keep_viewer(root: Path, cwd: Path, watching) -> object:
    if watching and watching.is_alive():
        return watching
    thread = threading.Thread(target=viewer.start, args=(root, cwd), daemon=True)
    thread.start()
    return thread


def run(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str, lifeline: int = -1) -> int:
    rows, cols = resize(fd)
    top = band.Band(root, env, session, root.resolve().parent.name)
    rows_below = band.Translator(rows)
    printed = root / "runtime" / f"printed-{session}"
    typed = root / "runtime" / f"typed-{session}"
    typed_at = 0.0
    printed.parent.mkdir(parents=True, exist_ok=True)
    out = printed.open("ab")
    driver = spawn_driver(root, cwd, env, agent, fd, session)
    answered = False
    early = b""
    started = time.time()
    settled = False
    stamps = watched(root)
    stdin, stdout = sys.stdin.fileno(), sys.stdout.fileno()
    shape = [rows, cols]
    result = 0

    def frame() -> None:
        shape[0], shape[1] = resize(fd)
        rows_below.rows = shape[0]
        where.resized(shape[0], shape[1])
        os.write(stdout, b"\x1b[2J" + band.region(shape[0]) + top.draw(shape[1], force=True, cursor=where))

    where = band.Cursor(rows, cols)
    signal.signal(signal.SIGWINCH, lambda *_: frame())
    os.write(stdout, band.region(rows) + top.draw(cols, force=True, cursor=where))
    began = time.time()
    last_check = 0.0
    last_viewer = time.time()
    last_services = 0.0
    watching = None
    services = Manager(root, lifeline)
    last_band = 0.0
    last_out = 0.0
    BETWEEN_FRAMES = 0.12
    try:
        while True:
            ready, _, _ = select.select([fd, stdin], [], [], 0.5)
            if fd in ready:
                try:
                    data = os.read(fd, 65536)
                except OSError:
                    break
                if not data:
                    break
                last_out = time.time()
                shown = rows_below.feed(data)
                os.write(stdout, shown)
                where.feed(shown)
                early = (early + data)[-EARLY:] if not answered else early
                if any(mark in data for mark in REDRAWS):
                    os.write(stdout, band.region(shape[0]) + top.draw(shape[1], force=True, cursor=where))
                elif data.rstrip().endswith(FRAME_END):
                    os.write(stdout, top.draw(shape[1], cursor=where))
                out.write(data[-4096:])
                out.flush()
            if not answered and time.time() - started < STARTUP:
                if (keys := DRIVERS[agent].confirm(early)):
                    answered = True
                    os.write(fd, keys)
            elif not answered and early:
                answered, early = True, b""
            if time.time() - last_band >= 1.0 and time.time() - last_out >= BETWEEN_FRAMES and where.sure:
                last_band = time.time()
                os.write(stdout, top.draw(shape[1], cursor=where))
            if stdin in ready:
                data = os.read(stdin, 65536)
                if not data:
                    result = STOP
                    break
                os.write(fd, band.unshifted(data))
                if b"\r" in data or b"\n" in data:
                    typed.unlink(missing_ok=True)
                elif typing(data) and time.time() - typed_at >= TYPED_EVERY:
                    typed.touch()
                    typed_at = time.time()
            if asked(root, began):
                result = STOP
                break
            now = time.time()
            if now - last_services >= SERVICES_EVERY:
                last_services = now
                services.tick()
            if now - last_viewer >= VIEWER_EVERY:
                last_viewer = now
                watching = keep_viewer(root, cwd, watching)
            if now - last_check >= RELOAD_EVERY:
                last_check = now
                if not settled and driver.poll() is None and now - started >= watch.CRASH_WITHIN:
                    settled = True
                    watch.cleared(root, env)
                if driver.poll() is not None or watched(root) != stamps:
                    if watch.crashed(driver.poll(), started) and watch.told(root, env, watch.why(root)):
                        os.write(fd, f"{watch.SAID} {watch.why(root, 3)}\r".encode())
                    result = RELOAD
                    break
    finally:
        signal.signal(signal.SIGWINCH, signal.SIG_DFL)
        stop_driver(driver)
        out.close()
    return result


if __name__ == "__main__":
    root, cwd, env, agent, fd, session = sys.argv[1:7]
    raise SystemExit(run(Path(root), Path(cwd), env, agent, int(fd), session, int(sys.argv[7]) if len(sys.argv) > 7 else -1))

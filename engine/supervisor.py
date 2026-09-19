import fcntl
import os
import select
import signal
import struct
import subprocess
import sys
import termios
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine import band  # noqa: E402
from engine.terminal import RELOAD, STOP, watched  # noqa: E402

RELOAD_EVERY = 5.0
TYPED_EVERY = 1.0


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
FRAME_END = b"\x1b[?25h"


def spawn_driver(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str) -> subprocess.Popen:
    main = Path(__file__).resolve().with_name("engine_main.py")
    return subprocess.Popen([sys.executable, str(main), str(root), env, agent, str(fd), session], cwd=cwd, pass_fds=(fd,))


def stop_driver(driver: subprocess.Popen) -> None:
    if driver.poll() is not None:
        return
    driver.terminate()
    try:
        driver.wait(timeout=5)
    except subprocess.TimeoutExpired:
        driver.kill()
        driver.wait()


def run(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str) -> int:
    rows, cols = resize(fd)
    top = band.Band(root, env, session, root.resolve().parent.name)
    rows_below = band.Translator(rows)
    printed = root / "runtime" / f"printed-{session}"
    typed = root / "runtime" / f"typed-{session}"
    typed_at = 0.0
    printed.parent.mkdir(parents=True, exist_ok=True)
    out = printed.open("ab")
    driver = spawn_driver(root, cwd, env, agent, fd, session)
    stamps = watched(root)
    stdin, stdout = sys.stdin.fileno(), sys.stdout.fileno()
    shape = [rows, cols]
    result = 0

    def frame() -> None:
        shape[0], shape[1] = resize(fd)
        rows_below.rows = shape[0]
        os.write(stdout, b"\x1b[2J" + band.region(shape[0]) + top.draw(shape[1], force=True))

    signal.signal(signal.SIGWINCH, lambda *_: frame())
    os.write(stdout, band.region(rows) + top.draw(cols, force=True))
    last_check = 0.0
    last_band = 0.0
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
                os.write(stdout, rows_below.feed(data))
                if any(mark in data for mark in REDRAWS):
                    os.write(stdout, band.region(shape[0]) + top.draw(shape[1], force=True))
                elif data.rstrip().endswith(FRAME_END):
                    os.write(stdout, top.draw(shape[1]))
                out.write(data[-4096:])
                out.flush()
            if time.time() - last_band >= 1.0:
                last_band = time.time()
                os.write(stdout, top.draw(shape[1]))
            if stdin in ready:
                data = os.read(stdin, 65536)
                if not data:
                    result = STOP
                    break
                os.write(fd, data)
                if b"\r" in data or b"\n" in data:
                    typed.unlink(missing_ok=True)
                elif time.time() - typed_at >= TYPED_EVERY:
                    typed.touch()
                    typed_at = time.time()
            now = time.time()
            if now - last_check >= RELOAD_EVERY:
                last_check = now
                if driver.poll() is not None or watched(root) != stamps:
                    result = RELOAD
                    break
    finally:
        signal.signal(signal.SIGWINCH, signal.SIG_DFL)
        stop_driver(driver)
        out.close()
    return result


if __name__ == "__main__":
    root, cwd, env, agent, fd, session = sys.argv[1:7]
    raise SystemExit(run(Path(root), Path(cwd), env, agent, int(fd), session))

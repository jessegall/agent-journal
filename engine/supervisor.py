import fcntl
import os
import pty
import select
import signal
import struct
import subprocess
import sys
import termios
import time
import tty
from pathlib import Path

from engine import band
from engine.drivers import DRIVERS

RELOAD_EVERY = 5.0


def watched(root: Path) -> tuple:
    files = sorted(root.rglob("*.py"))
    return tuple(f.stat().st_mtime_ns for f in files if f.is_file())


def spawn_agent(command: list[str], cwd: Path) -> tuple[int, int]:
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        os.execvp(command[0], command)
    return pid, fd


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


def spawn_driver(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str) -> subprocess.Popen:
    main = Path(__file__).resolve().with_name("engine_main.py")
    return subprocess.Popen([sys.executable, str(main), str(root), env, agent, str(fd), session], cwd=cwd, pass_fds=(fd,))


def run(root: Path, cwd: Path, env: str, agent: str, args: list[str]) -> int:
    driver = DRIVERS[agent]
    command = driver.command(driver, args)
    pid, fd = spawn_agent(command, cwd)
    rows, cols = resize(fd)
    session = f"{agent}-{pid}"
    top = band.Band(root, env, session, root.resolve().parent.name)
    printed = root / "runtime" / f"printed-{session}"
    printed.parent.mkdir(parents=True, exist_ok=True)
    (root / "runtime" / "env").write_text(env)
    print(f"journal: environment {env} — a session bound elsewhere is followed there")
    out = printed.open("ab")
    driver = spawn_driver(root, cwd, env, agent, fd, session)
    stamps = watched(root)
    stdin, stdout = sys.stdin.fileno(), sys.stdout.fileno()
    saved = None
    try:
        saved = termios.tcgetattr(stdin)
        tty.setraw(stdin)
    except termios.error:
        pass
    shape = [rows, cols]

    def frame() -> None:
        shape[0], shape[1] = resize(fd)
        os.write(stdout, b"\x1b[2J" + band.region(shape[0]) + top.draw(shape[1]))

    signal.signal(signal.SIGWINCH, lambda *_: frame())
    os.write(stdout, band.region(rows) + top.draw(cols))
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
                os.write(stdout, data)
                if any(mark in data for mark in REDRAWS):
                    os.write(stdout, band.region(shape[0]) + top.draw(shape[1]))
                out.write(data[-4096:])
                out.flush()
            if time.time() - last_band >= 1.0:
                last_band = time.time()
                os.write(stdout, top.draw(shape[1]))
            if stdin in ready:
                data = os.read(stdin, 65536)
                if not data:
                    break
                os.write(fd, data)
            now = time.time()
            if now - last_check >= RELOAD_EVERY:
                last_check = now
                dead = driver.poll() is not None
                changed = watched(root) != stamps
                if dead or changed:
                    if not dead:
                        driver.terminate()
                        driver.wait(timeout=5)
                    stamps = watched(root)
                    driver = spawn_driver(root, cwd, env, agent, fd, session)
    finally:
        signal.signal(signal.SIGWINCH, signal.SIG_DFL)
        os.write(stdout, band.release())
        if saved is not None:
            termios.tcsetattr(stdin, termios.TCSADRAIN, saved)
        driver.terminate()
        out.close()
    _, status = os.waitpid(pid, 0)
    return os.waitstatus_to_exitcode(status)

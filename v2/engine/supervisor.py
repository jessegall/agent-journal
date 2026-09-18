import fcntl
import os
import pty
import select
import signal
import struct
import subprocess
import sys
import termios
import tty
from pathlib import Path

from v2.engine.agent import AGENTS

RELOAD_EVERY = 5.0


def watched(root: Path) -> tuple:
    files = sorted((root / "v2").rglob("*.py"))
    return tuple(f.stat().st_mtime_ns for f in files if f.is_file())


def spawn_agent(command: list[str], cwd: Path) -> tuple[int, int]:
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        os.execvp(command[0], command)
    return pid, fd


def resize(fd: int) -> None:
    try:
        size = fcntl.ioctl(sys.stdout.fileno(), termios.TIOCGWINSZ, b"\0" * 8)
        fcntl.ioctl(fd, termios.TIOCSWINSZ, size)
    except OSError:
        pass


def spawn_driver(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str) -> subprocess.Popen:
    return subprocess.Popen([sys.executable, "-m", "v2.engine.driver_main", str(root), env, agent, str(fd), session],
                            cwd=cwd, pass_fds=(fd,))


def run(root: Path, cwd: Path, env: str, agent: str, args: list[str]) -> int:
    kind = AGENTS[agent]
    command = kind.command(kind, args)
    pid, fd = spawn_agent(command, cwd)
    resize(fd)
    session = f"{agent}-{pid}"
    printed = root / "runtime" / f"printed-{session}"
    printed.parent.mkdir(parents=True, exist_ok=True)
    out = printed.open("ab")
    os.environ["JOURNAL_SESSION"] = session
    driver = spawn_driver(root, cwd, env, agent, fd, session)
    stamps = watched(root)
    stdin, stdout = sys.stdin.fileno(), sys.stdout.fileno()
    saved = None
    try:
        saved = termios.tcgetattr(stdin)
        tty.setraw(stdin)
    except termios.error:
        pass
    signal.signal(signal.SIGWINCH, lambda *_: resize(fd))
    last_check = 0.0
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
                out.write(data[-4096:])
                out.flush()
            if stdin in ready:
                data = os.read(stdin, 65536)
                if not data:
                    break
                os.write(fd, data)
            now = __import__("time").time()
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
        if saved is not None:
            termios.tcsetattr(stdin, termios.TCSADRAIN, saved)
        driver.terminate()
        out.close()
    _, status = os.waitpid(pid, 0)
    return os.waitstatus_to_exitcode(status)

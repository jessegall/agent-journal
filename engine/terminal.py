import os
import pty
import signal
import subprocess
import sys
import termios
import time
import tty
from pathlib import Path

from engine.sessions import ACTIVE_ENV
from install import code

RELOAD = 75
STOP = 76
CHECK_EVERY = 0.5


def watched(root: Path) -> tuple:
    files = sorted(code(root).rglob("*.py"))
    return tuple((str(f), f.stat().st_mtime_ns) for f in files if f.is_file())


def agent_environment(base: dict | None = None) -> dict:
    return {**(base if base is not None else os.environ), ACTIVE_ENV: "1"}


def session_of(agent: str, pid: int) -> str:
    return f"{agent}-{pid}"


def pid_of(session: str) -> int:
    tail = session.rsplit("-", 1)[-1]
    return int(tail) if tail.isdigit() else 0


def spawn_agent(command: list[str], cwd: Path) -> tuple[int, int]:
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        os.execvpe(command[0], command, agent_environment())
    return pid, fd


def spawn_supervisor(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str) -> subprocess.Popen:
    main = Path(__file__).resolve().with_name("supervisor.py")
    return subprocess.Popen([sys.executable, str(main), str(root), str(cwd), env, agent, str(fd), session], cwd=cwd, pass_fds=(fd,))


def child(pid: int, block: bool = False) -> tuple[int, int]:
    try:
        return os.waitpid(pid, 0 if block else os.WNOHANG)
    except ChildProcessError:
        return pid, 0


def stop(pid: int) -> int:
    try:
        os.kill(pid, signal.SIGHUP)
    except ProcessLookupError:
        pass
    return child(pid, block=True)[1]


def run(root: Path, cwd: Path, env: str, agent: str, args: list[str]) -> int:
    from engine.drivers import DRIVERS
    from engine.record import Record
    from features.auto.policy import launch_args

    driver = DRIVERS[agent]
    command = driver.command(driver, launch_args(Record(root, env), agent, args))
    pid, fd = spawn_agent(command, cwd)
    session = session_of(agent, pid)
    runtime = root / "runtime"
    runtime.mkdir(parents=True, exist_ok=True)
    (runtime / "env").write_text(env)
    print(f"journal: environment {env} — a session bound elsewhere is followed there")
    stdin, stdout = sys.stdin.fileno(), sys.stdout.fileno()
    saved = None
    coordinator = None
    status = None
    try:
        try:
            saved = termios.tcgetattr(stdin)
            tty.setraw(stdin)
        except termios.error:
            pass
        while status is None:
            stamps = watched(root)
            coordinator = spawn_supervisor(root, cwd, env, agent, fd, session)
            code = coordinator.wait()
            coordinator = None
            ended, status = child(pid)
            if ended:
                break
            status = None
            if code == RELOAD:
                continue
            if code == STOP:
                status = stop(pid)
                break
            while watched(root) == stamps:
                ended, status = child(pid)
                if ended:
                    break
                status = None
                time.sleep(CHECK_EVERY)
    finally:
        if coordinator and coordinator.poll() is None:
            coordinator.terminate()
            coordinator.wait()
        if status is None:
            status = stop(pid)
        from engine.band import release
        os.write(stdout, release())
        if saved is not None:
            termios.tcsetattr(stdin, termios.TCSADRAIN, saved)
        os.close(fd)
    return os.waitstatus_to_exitcode(status)

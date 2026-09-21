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
from engine import runtime

RELOAD = 75
STOP = 76
CHECK_EVERY = 0.5


def watched(root: Path) -> tuple:
    files = sorted(code(root).rglob("*.py"))
    return tuple((str(f), f.stat().st_mtime_ns) for f in files if f.is_file())


def agent_environment(base: dict | None = None, env: str = "") -> dict:
    return {**(base if base is not None else os.environ), ACTIVE_ENV: "1", **({"JOURNAL_ENV": env} if env else {})}


def session_of(agent: str, pid: int) -> str:
    return f"{agent}-{pid}"


def pid_of(session: str) -> int:
    tail = session.rsplit("-", 1)[-1]
    return int(tail) if tail.isdigit() else 0


def spawn_agent(command: list[str], cwd: Path, env: str = "") -> tuple[int, int]:
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        os.execvpe(command[0], command, agent_environment(env=env))
    return pid, fd


def spawn_supervisor(root: Path, cwd: Path, env: str, agent: str, fd: int, session: str, lifeline: int = -1) -> subprocess.Popen:
    main = Path(__file__).resolve().with_name("supervisor.py")
    return subprocess.Popen([sys.executable, str(main), str(root), str(cwd), env, agent, str(fd), session, str(lifeline)], cwd=cwd,
                            pass_fds=(fd, lifeline) if lifeline >= 0 else (fd,))


def lifeline() -> tuple[int, int]:
    read, write = os.pipe()
    os.set_inheritable(read, True)
    os.set_inheritable(write, False)
    return read, write


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


def seat(root: Path, env: str, session: str, pid: int, agent: str) -> None:
    from engine.hooks import seated
    from engine.sessions import Sessions
    Sessions(root).bind(session, env, pid=pid, provider=agent)
    seated(root, env, session)


def run(root: Path, cwd: Path, env: str, agent: str, args: list[str]) -> int:
    from engine.drivers import DRIVERS
    from engine.record import Record
    from features.work.auto import launch_args

    driver = DRIVERS[agent]
    command = driver.command(driver, launch_args(Record(root, env), agent, args))
    pid, fd = spawn_agent(command, cwd, env)
    session = session_of(agent, pid)
    runtime.set_env(root, env)
    seat(root, env, session, pid, agent)
    print(f"journal: environment {env}")
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
        alive, held = lifeline()
        while status is None:
            stamps = watched(root)
            coordinator = spawn_supervisor(root, cwd, env, agent, fd, session, alive)
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

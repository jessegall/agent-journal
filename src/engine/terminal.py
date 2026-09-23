import json
import os
import subprocess
from dataclasses import dataclass, replace
from pathlib import Path

from engine.sessions import ACTIVE_ENV, hold_build
from install import code
from engine import runtime
from engine.stored import read_json, write_json
from engine.package import CODE, entry
from engine.fields import Loaded
from engine.worktree import checkout, environment

RELOAD = 75
STOP = 76
RELAUNCH = 77
HEAL = 78
LAUNCH = 2
CARRIED = "AGENT_JOURNAL_CARRIED"
LAUNCHED = "launched.json"


@dataclass(frozen=True)
class Launched(Loaded):
    pid: int = 0
    command: tuple = ()
    args: tuple = ()
    cwd: str = ""
    launch: int = 0

    @classmethod
    def read(cls, root: Path, session: str) -> "Launched":
        return cls.from_json(read_json(runtime.session_file(root, session, LAUNCHED), {}))


def watched(root: Path) -> tuple:
    files = sorted(code(root).rglob("*.py"))
    return (str((root / "journal.pyz").resolve()), *((str(f), f.stat().st_mtime_ns) for f in files if f.is_file()))


def agent_environment(base: dict | None = None, env: str = "", capped: dict | None = None) -> dict:
    return {**(base if base is not None else os.environ), ACTIVE_ENV: "1", **({"JOURNAL_ENV": env} if env else {}), **(capped or {})}


def output_cap(root: Path, env: str, provider) -> dict:
    from engine.record import Record
    from features.journal_laws.details import LawDetails
    lines = int(LawDetails.values(Record(root, env)).output_lines)
    wrapper = provider.shell_wrapper(code(root) / "output_cap.sh") if lines > 0 else {}
    return {**wrapper, "JOURNAL_OUTPUT_LINES": str(lines), "JOURNAL_PROVIDER": provider.name, "JOURNAL_OUTPUT_DIR": str(runtime.folder(root) / "outputs")} if wrapper else {}


def launching(root: Path, cwd: Path, env: str, agent: str, args: list[str], conversation: str = "") -> dict:
    from providers import DRIVERS, PROVIDERS
    from engine.record import Record
    from features.work_tracking.auto import launch_args
    driver = DRIVERS[agent]
    command = driver.command(driver, driver.resumed(launch_args(Record(root, env), agent, args), conversation), cwd)
    return {"command": command, "args": args, "launch": LAUNCH, "exit": "" if driver.worktree(args) else driver.EXIT,
            "environ": agent_environment(env=env, capped=output_cap(root, env, PROVIDERS[agent]()))}


@dataclass(frozen=True)
class Seat:
    root: Path
    env: str
    agent: str
    session: str


def seated(seat: Seat) -> Seat:
    from controllers.types import Environments
    from engine.record import Record
    from engine.sessions import Sessions
    from resources.base import SYSTEM
    launched = Launched.read(seat.root, seat.session)
    sessions = Sessions(seat.root)
    if not sessions.known(seat.session):
        sessions.bind(seat.session, seat.env)
        Environments(Record(seat.root, seat.env), actor=SYSTEM)._seat(seat.env, seat.session)
    sessions.write(seat.session, pid=launched.pid, provider=seat.agent, args=list(launched.command), launch=launched.launch)
    return replace(seat, env=sessions.environment(seat.session) or seat.env)


def relaunch(root: Path, env: str, session: str, conversation: str) -> Path:
    from engine.sessions import Sessions
    launched = Launched.read(root, session)
    provider = Sessions(root).read(session).provider
    agent = provider if provider else session.split("-", 1)[0]
    cwd = Path(launched.cwd) if launched.cwd else root.parent
    asked = runtime.relaunch_file(root, session)
    write_json(asked, launching(root, cwd, env, agent, list(launched.args), conversation))
    return asked


def lifeline() -> tuple[int, int]:
    read, write = os.pipe()
    os.set_inheritable(read, True)
    os.set_inheritable(write, False)
    return read, write


def carried() -> dict | None:
    given = os.environ.pop(CARRIED, "")
    return json.loads(given) if given else None


def launch_spec(root: Path, cwd: Path, env: str, agent: str, args: list[str], taken: dict | None = None) -> dict:
    from providers import DRIVERS
    if not taken:
        cwd, args = DRIVERS[agent].placed(cwd, args)
        env = environment(checkout(cwd)) or env
    journal = [*entry("journal"), "--root", str(root)]
    return {"root": str(root), "cwd": str(cwd), "env": env, "agent": agent,
            "worker": entry("engine.worker"), "heal": [*journal, "heal"], "ended": [*journal, "--env", env, "ended"],
            **({"adopt": {"pid": taken["pid"], "fd": taken["fd"], "session": taken["session"], "saved": taken["saved"]}, "args": args}
               if taken else launching(root, cwd, env, agent, args))}


def supervise(root: Path, cwd: Path, env: str, agent: str, args: list[str], taken: dict | None = None) -> None:
    hold_build(root, CODE)
    runtime.set_env(root, env)
    spec = launch_spec(root, cwd, env, agent, args, taken)
    if taken:
        os.set_inheritable(taken["fd"], True)
    else:
        print(f"journal: environment {spec['env']}")
    started = entry("supervisor")
    os.execv(started[0], [*started, json.dumps(spec)])


def detached(root: Path, cwd: Path, env: str, agent: str, args: list[str]) -> int:
    started = entry("supervisor")
    child = subprocess.Popen([*started, json.dumps({**launch_spec(root, cwd, env, agent, args), "headless": True})],
                             stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    hold_build(root, CODE, child.pid)
    return child.pid


DETACH = b"\x1d"
SHOWN_BACK = 65536


@dataclass(frozen=True)
class ScreenPart:
    data: str
    at: int
    rows: int
    cols: int


def screen_since(root: Path, terminal: str, since: int) -> ScreenPart:
    import base64
    screen = runtime.session_file(root, terminal, "screen")
    shape = read_json(runtime.session_file(root, terminal, "screen.json"), {"rows": 40, "cols": 120})
    if not screen.is_file():
        return ScreenPart("", 0, int(shape["rows"]), int(shape["cols"]))
    size = screen.stat().st_size
    at = max(0, size - SHOWN_BACK) if since < 0 or since > size else since
    with screen.open("rb") as shown:
        shown.seek(at)
        fresh = shown.read(size - at)
    return ScreenPart(base64.b64encode(fresh).decode(), at + len(fresh), int(shape["rows"]), int(shape["cols"]))


def type_keys(root: Path, terminal: str, text: str) -> bool:
    from engine import typist
    return typist.send(root, terminal, text.encode())


def attach(root: Path, session: str) -> str:
    import select
    import sys
    import termios
    import tty
    from engine import typist
    screen = runtime.session_file(root, session, "screen")
    if not screen.is_file():
        return f"journal: no session {session} to attach to"
    at = max(0, screen.stat().st_size - SHOWN_BACK)
    saved = termios.tcgetattr(sys.stdin.fileno())
    tty.setraw(sys.stdin.fileno())
    try:
        while True:
            with screen.open("rb") as shown:
                shown.seek(at)
                fresh = shown.read()
            at += len(fresh)
            os.write(sys.stdout.fileno(), fresh)
            ready, _, _ = select.select([sys.stdin.fileno()], [], [], 0.2)
            if ready:
                keys = os.read(sys.stdin.fileno(), 4096)
                if not keys or DETACH in keys:
                    break
                typist.send(root, session, keys)
    finally:
        termios.tcsetattr(sys.stdin.fileno(), termios.TCSADRAIN, saved)
    return f"\njournal: left session {session}; it runs on"


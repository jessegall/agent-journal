import json
import os
import subprocess
from dataclasses import dataclass, replace
from pathlib import Path

from engine.sessions import ACTIVE_ENV, Sessions, hold_build
from engine import runtime
from engine.stored import read_json, write_json
from engine.package import CODE, code, entry_in
from engine.fields import Loaded
from engine.worktree import checkout, environment, share_journal
from typing import TypedDict

from supervisor import LAUNCHED

LAUNCH = 2
CARRIED = "AGENT_JOURNAL_CARRIED"
LAUNCH_ARGS: list = []
OUTPUT_LINES: list = []


@dataclass(frozen=True)
class Launched(Loaded):
    pid: int = 0
    command: tuple = ()
    args: tuple = ()
    cwd: str = ""
    launch: int = 0

    @classmethod
    def read(cls, root: Path, session: str) -> "Launched":
        return read_json(runtime.session_file(root, session, LAUNCHED), cls.from_json, cls.from_json({}))


def agent_environment(base: dict | None = None, env: str | None = None, capped: dict | None = None) -> dict:
    made = {**(base if base is not None else os.environ), ACTIVE_ENV: "1"}
    if env is not None:
        made["JOURNAL_ENV"] = env
    return {**made, **(capped or {})}


def session_named(provider) -> dict:
    return {"JOURNAL_SESSION_VARIABLE": provider.session_variable} if provider.session_variable else {}


def output_lines(record) -> int:
    return max((int(lines(record)) for lines in OUTPUT_LINES), default=0)


def shaped_args(record, agent: str, args: list[str]) -> list[str]:
    for shape in LAUNCH_ARGS:
        args = shape(record, agent, args)
    return args


def output_cap(root: Path, env: str, provider) -> dict:
    from engine.record import Record
    lines = output_lines(Record(root, env))
    wrapper = provider.shell_wrapper(code(root) / "output_cap.sh") if lines > 0 else {}
    return {**wrapper, "JOURNAL_OUTPUT_LINES": str(lines), "JOURNAL_PROVIDER": provider.name, "JOURNAL_OUTPUT_DIR": str(runtime.folder(root) / "outputs")} if wrapper else {}


class Launching(TypedDict):
    command: list[str]
    args: list[str]
    launch: int
    exit: str
    environ: dict[str, str]


def launching(root: Path, cwd: Path, env: str, agent: str, args: list[str], conversation: str = "") -> Launching:
    from providers import DRIVERS, PROVIDERS
    from engine.record import Record
    driver = DRIVERS[agent]
    named = driver.command(driver.resumed(shaped_args(Record(root, env), agent, args), conversation), cwd)
    command = [driver.binary(os.environ.get("PATH", "")), *named[1:]]
    provider = PROVIDERS[agent]()
    inherited = {name: value for name, value in os.environ.items() if name not in provider.session_markers}
    return {"command": command, "args": args, "launch": LAUNCH, "exit": "" if driver.worktree(args) else driver.EXIT,
            "environ": agent_environment(inherited, env=env, capped={**output_cap(root, env, provider), **session_named(provider)})}


@dataclass(frozen=True)
class TerminalSession:
    root: Path
    env: str
    agent: str
    session: str


def seat_session(sessions: Sessions, env: str, session: str, **bound) -> None:
    from controllers.types import Environments
    from engine.record import Record
    from resources.base import SYSTEM
    sessions.bind(session, env, **bound)
    Environments(Record(sessions.root, env), actor=SYSTEM)._seat(env, session)


def seated(seat: TerminalSession) -> TerminalSession:
    launched = Launched.read(seat.root, seat.session)
    sessions = Sessions(seat.root)
    if not sessions.known(seat.session):
        seat_session(sessions, seat.env, seat.session)
    sessions.write(seat.session, pid=launched.pid, provider=seat.agent, args=list(launched.command), launch=launched.launch)
    return replace(seat, env=sessions.environment(seat.session) or seat.env)


def relaunch(root: Path, env: str, session: str, conversation: str) -> Path:
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


def launch_spec(root: Path, cwd: Path, env: str, agent: str, args: list[str], taken: dict | None = None, conversation: str = "") -> dict:
    from providers import DRIVERS, workspace_folders
    if not taken:
        cwd, args = DRIVERS[agent].placed(cwd, args)
        top = checkout(cwd, workspace_folders())
        if top:
            share_journal(top, root, workspace_folders())
        worked = environment(top)
        env = Sessions(root).free(worked) if worked else env
    journal = [*entry_in(root, "journal"), "--root", str(root)]
    return {"root": str(root), "cwd": str(cwd), "env": env, "agent": agent,
            "worker": entry_in(root, "worker"), "heal": [*journal, "heal"], "ended": [*journal, "--env", env, "ended"],
            **({"adopt": {"pid": taken["pid"], "fd": taken["fd"], "session": taken["session"], "saved": taken["saved"]}, "args": args}
               if taken else launching(root, cwd, env, agent, args, conversation))}


def supervise(root: Path, cwd: Path, env: str, agent: str, args: list[str], taken: dict | None = None) -> None:
    hold_build(root, CODE)
    spec = launch_spec(root, cwd, env, agent, args, taken)
    if taken:
        os.set_inheritable(taken["fd"], True)
    else:
        print(f"journal: environment {spec['env']}")
    started = entry_in(root, "supervisor")
    os.execv(started[0], [*started, json.dumps(spec)])


def launch_log(root: Path, env: str) -> Path:
    return runtime.folder(root) / "launches" / f"{env}.log"


def detached(root: Path, cwd: Path, env: str, agent: str, args: list[str], conversation: str = "") -> int:
    started = entry_in(root, "supervisor")
    log = launch_log(root, env)
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open("ab") as kept:
        child = subprocess.Popen([*started, json.dumps({**launch_spec(root, cwd, env, agent, args, conversation=conversation), "headless": True})],
                                 stdin=subprocess.DEVNULL, stdout=kept, stderr=kept, start_new_session=True)
    hold_build(root, CODE, child.pid)
    return child.pid

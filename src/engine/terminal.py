import json
import os
from dataclasses import dataclass
from pathlib import Path

from engine.sessions import ACTIVE_ENV, hold_build
from install import code
from engine import runtime
from engine.stored import read_json, write_json
from engine.package import CODE, entry
from engine.fields import list_of, text_of, whole_of

RELOAD = 75
STOP = 76
RELAUNCH = 77
HEAL = 78
LAUNCH = 2
CARRIED = "AGENT_JOURNAL_CARRIED"
LAUNCHED = "launched.json"


@dataclass(frozen=True)
class Launched:
    pid: int = 0
    command: tuple = ()
    args: tuple = ()
    cwd: str = ""
    launch: int = 0

    @classmethod
    def read(cls, root: Path, session: str) -> "Launched":
        raw = read_json(runtime.session_file(root, session, LAUNCHED), {})
        raw = raw if isinstance(raw, dict) else {}
        return cls(whole_of(raw, "pid"), tuple(list_of(raw, "command")), tuple(list_of(raw, "args")), text_of(raw, "cwd"), whole_of(raw, "launch"))


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
    return {"command": command, "args": args, "launch": LAUNCH, "environ": agent_environment(env=env, capped=output_cap(root, env, PROVIDERS[agent]()))}


@dataclass(frozen=True)
class Seat:
    root: Path
    env: str
    agent: str
    session: str


def seated(seat: Seat) -> None:
    from controllers.types import Environments
    from engine.record import Record
    from engine.sessions import Sessions
    from resources.base import SYSTEM
    launched = Launched.read(seat.root, seat.session)
    Sessions(seat.root).bind(seat.session, seat.env, pid=launched.pid, provider=seat.agent)
    Sessions(seat.root).write(seat.session, args=list(launched.command), launch=launched.launch)
    Environments(Record(seat.root, seat.env), actor=SYSTEM)._seat(seat.env, seat.session)


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


def supervise(root: Path, cwd: Path, env: str, agent: str, args: list[str], taken: dict | None = None) -> None:
    hold_build(root, CODE)
    runtime.set_env(root, env)
    journal = [*entry("journal"), "--root", str(root)]
    spec = {"root": str(root), "cwd": str(cwd), "env": env, "agent": agent,
            "worker": entry("engine.worker"), "heal": [*journal, "heal"], "ended": [*journal, "--env", env, "ended"],
            **({"adopt": {"pid": taken["pid"], "fd": taken["fd"], "session": taken["session"], "saved": taken["saved"]}, "args": args}
               if taken else launching(root, cwd, env, agent, args))}
    if taken:
        os.set_inheritable(taken["fd"], True)
    else:
        print(f"journal: environment {env}")
    started = entry("supervisor")
    os.execv(started[0], [*started, json.dumps(spec)])

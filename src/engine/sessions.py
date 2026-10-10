import fcntl
import os
import time
from dataclasses import dataclass, field
from pathlib import Path

from resources.fields import Loaded

from resources.types import TYPES
from engine.stored import read_json, write_json, write_text
from engine.proc import run
from engine import runtime, waits


RECENT = 600.0
ACTIVE_ENV = "AGENT_JOURNAL_ACTIVE"
SHELLS = {"sh", "bash", "zsh", "dash", "fish"}


def alive(pid) -> bool:
    try:
        pid = int(pid)
    except (ValueError, TypeError):
        return False
    if pid <= 0:
        return False
    try:
        if os.waitpid(pid, os.WNOHANG)[0]:
            return False
    except ChildProcessError:
        pass
    try:
        os.kill(pid, 0)
    except PermissionError:
        return True
    except OSError:
        return False
    return True


def hold_build(root: Path, build: Path, pid: int | None = None) -> None:
    if build.suffix == ".pyz":
        write_text(runtime.builds(root) / str(pid or os.getpid()), build.name)


def held_builds(root: Path) -> set[str]:
    held = set()
    for marker in runtime.builds(root).glob("*") if runtime.builds(root).is_dir() else ():
        if marker.name.isdigit() and alive(int(marker.name)):
            held.add(marker.read_text().strip())
        else:
            marker.unlink(missing_ok=True)
    return held


@dataclass(frozen=True)
class SessionRecord(Loaded):
    environment: str = ""
    provider: str = ""
    pid: int = 0
    since: float = 0.0
    seen: float = 0.0
    args: tuple = ()
    launch: int = 0
    before: str = ""
    evicted: dict = field(default_factory=dict)
    grants: tuple = ()
    worked_in: str = ""

    @property
    def evicted_since_start(self) -> bool:
        return "at" in self.evicted and self.evicted["at"] > self.since

    @property
    def last_heard(self) -> float:
        return self.seen if self.seen else self.since


def live(session: SessionRecord) -> bool:
    if session.pid:
        return alive(session.pid)
    return time.time() - session.last_heard < RECENT


def agent_pid(pid: int) -> int:
    for _ in range(4):
        try:
            parent, name = run(["ps", "-o", "ppid=,comm=", "-p", str(pid)], timeout=2).split(None, 1)
        except ValueError:
            return pid
        if Path(name.strip()).name.lstrip("-") not in SHELLS:
            return pid
        pid = int(parent)
    return pid


class SessionFiles:
    """Every session.json of one root, read once and kept while the sessions folder's stamp stands.

    A write stamps the folder (its modification time, raised past the last one) so every process
    sees the change with one stat; the file is read only by the funnel."""

    NONE = SessionRecord()

    def __init__(self, root: Path):
        self.folder = runtime.sessions(root)
        self.stamp = -1
        self.records: dict[str, SessionRecord] = {}

    def current(self) -> int:
        try:
            return self.folder.stat().st_mtime_ns
        except OSError:
            return 0

    def all(self) -> dict[str, SessionRecord]:
        stamp = self.current()
        if stamp != self.stamp:
            self.records = self.scanned()
            self.stamp = stamp
        return self.records

    def scanned(self) -> dict[str, SessionRecord]:
        try:
            names = sorted(entry.name for entry in os.scandir(self.folder) if entry.is_dir())
        except OSError:
            return {}
        found = {}
        for name in names:
            path = self.folder / name / SESSION
            if path.is_file():
                found[name] = read_json(path, SessionRecord.from_json, self.NONE)
        return found

    def stamped(self, session: str, written: SessionRecord, before: int) -> None:
        """Raise the folder's stamp past the last one and keep the record, when nobody else wrote in between."""
        after = max(time.time_ns(), self.current() + 1)
        os.utime(self.folder, ns=(after, after))
        if self.stamp == before and self.current() == after:
            self.records = {**self.records, session: written}
            self.stamp = after


class SessionFilesSet:
    def __init__(self):
        self.by_root: dict[Path, SessionFiles] = {}

    def of(self, root: Path) -> SessionFiles:
        return self.by_root.setdefault(Path(root), SessionFiles(root))


SESSION_FILES = SessionFilesSet()
SESSION = "session.json"


class Sessions:
    def __init__(self, root: Path):
        self.root = Path(root)
        self.files = SESSION_FILES.of(self.root)

    def path(self, session: str) -> Path:
        return runtime.session_file(self.root, session, SESSION)

    def read(self, session: str) -> SessionRecord:
        return self.files.all().get(session, SessionFiles.NONE)

    def known(self, session: str) -> bool:
        return session in self.files.all()

    def write(self, session: str, **fields) -> SessionRecord:
        self.path(session).parent.mkdir(parents=True, exist_ok=True)
        before = self.files.stamp if self.files.current() == self.files.stamp else -1
        with (self.path(session).parent / "session.lock").open("w") as lock:
            with waits.waited("sessions"):
                fcntl.flock(lock, fcntl.LOCK_EX)
            raw = read_json(self.path(session), dict, {})
            got = {**(raw if isinstance(raw, dict) else {}), **fields}
            write_json(self.path(session), got)
        written = SessionRecord.from_json(got)
        self.files.stamped(session, written, before)
        return written

    def bind(self, session: str, env: str, pid: int = 0, provider: str = "") -> dict:
        given = {"pid": pid, "provider": provider}
        return self.write(session, environment=env, since=time.time(), **{key: value for key, value in given.items() if value})

    def choose(self, session: str, provider: str, prefer: str, owned: set[str]) -> str:
        own = self.environment(session)
        if own and self.holder(own) in ("", session):
            return own
        others = self.all()
        ended = sorted((s for name, s in others.items() if name != session and s.provider == provider and s.environment and not live(s)
                        and s.environment not in owned), key=lambda s: s.last_heard)
        for s in reversed(ended):
            if not self.holder(s.environment):
                return s.environment
        return prefer

    def last(self, env: str, provider: str) -> str:
        ended = [(s.last_heard, name) for name, s in self.all().items()
                 if s.environment == env and s.provider == provider and s.pid and not live(s)
                 and not name.startswith(f"{provider}-")]
        return max(ended)[1] if ended else ""

    def touch(self, session: str, worked_in: str) -> None:
        self.write(session, seen=time.time(), worked_in=worked_in)

    def unbind(self, session: str) -> None:
        self.write(session, environment="")

    def rebind(self, old: str, new: str) -> None:
        for session, s in self.all().items():
            if s.environment == old:
                self.write(session, environment=new)
        if runtime.env_file(self.root).is_file() and runtime.env(self.root) == old:
            runtime.set_env(self.root, new)
        runtime.note_rename(self.root, old, new)

    def terminal(self, provider: str, pid: int) -> str:
        return next((name for name, s in self.all().items() if name.startswith(f"{provider}-") and s.pid == pid), "")

    def environment(self, session: str) -> str:
        return self.read(session).environment

    def all(self) -> dict[str, SessionRecord]:
        return self.files.all()

    def running(self) -> list[str]:
        return [name for name, s in self.all().items() if s.pid and alive(s.pid)]

    def holder(self, env: str) -> str:
        return next(iter(self.holders(env)), "")

    def free(self, env: str) -> str:
        return next(name for name in (env, *(f"{env}-{i}" for i in range(2, 100))) if not self.holder(name))

    def holders(self, env: str) -> list[str]:
        held = [(s.last_heard, session) for session, s in self.all().items() if s.environment == env and live(s)]
        return [session for _, session in sorted(held, reverse=True)]

    def evict(self, session: str, by: str, env: str, why: str) -> None:
        self.write(session, environment="", evicted={"by": by, "environment": env, "why": why, "at": time.time()})

    def grant(self, session: str, env: str, on: bool = True) -> list[str]:
        lent = set(self.read(session).grants)
        if on:
            lent.add(env)
        else:
            lent.discard(env)
        return list(self.write(session, grants=sorted(lent)).grants)

    def granted(self, session: str, env: str) -> bool:
        return env in self.read(session).grants


def allowed(sessions: Sessions, session: str, env: str, actor_id: str, type_: str) -> str:
    if not actor_id:
        return ""
    if not sessions.granted(session, env):
        return f"environment {env!r} is not lent to this session's subagents: journal environment grant <n> first"
    if not TYPES[type_].subagent_writable:
        return f"a subagent never writes a {type_}: report it, and the main conversation files it"
    return ""

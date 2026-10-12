import fcntl
import os
import time
from dataclasses import dataclass, field
from pathlib import Path

from resources.fields import Loaded

from resources.types import TYPES
from engine.stored import read_promised_json, write_json, write_text
from engine.proc import process
from engine import locks, runtime, waits


RECENT = 600.0
VERIFY_EVERY = 5.0
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
    takeover: dict = field(default_factory=dict)
    retired: dict = field(default_factory=dict)

    @property
    def evicted_since_start(self) -> bool:
        return "at" in self.evicted and self.evicted["at"] > self.since

    @property
    def last_heard(self) -> float:
        return self.seen if self.seen else self.since


def live(session: SessionRecord) -> bool:
    """Whether a session still stands as an environment's own: running, and not succeeded by another."""
    return running(session) and not session.retired


def running(session: SessionRecord) -> bool:
    """Whether the session is at work, by its process or by having been heard from lately. It says nothing about whose turn the environment is."""
    if session.pid:
        return alive(session.pid)
    return time.time() - session.last_heard < RECENT


FOREBEARS = 2
"""How far up the journal looks for the process it launched: the process itself and the one that started it. A provider may run its conversation in a child of the process the journal spawned, which is one step; anything further up is another agent's, and merging those would take an environment from an agent that holds it."""


def forebears(pid: int) -> list[int]:
    """A process and the one that started it, as far as FOREBEARS allows."""
    walked = []
    for _ in range(FOREBEARS):
        if not pid:
            break
        walked.append(pid)
        found = process(pid)
        pid = found.parent if found else 0
    return walked


def agent_pid(pid: int) -> int:
    for _ in range(4):
        found = process(pid)
        if found is None or found.name.lstrip("-") not in SHELLS:
            return pid
        pid = found.parent
    return pid


class SessionFiles:
    """Every session.json of one root, kept in memory: the sessions folder's stamp says when one was added or removed, and the names a writer appends to the changes file say which one changed."""

    NONE = SessionRecord()
    CHANGES = ".changes"
    MOST = 256 * 1024

    def __init__(self, root: Path):
        self.folder = runtime.sessions(root)
        self.stamp = -1
        self.read_to = 0
        self.verified = 0.0
        self.records: dict[str, SessionRecord] = {}
        self.kept: dict[str, tuple[tuple[int, int], SessionRecord]] = {}

    def current(self) -> int:
        try:
            return self.folder.stat().st_mtime_ns
        except OSError:
            return 0

    def size(self) -> int:
        try:
            return (self.folder / self.CHANGES).stat().st_size
        except OSError:
            return 0

    def all(self) -> dict[str, SessionRecord]:
        stamp, size = self.current(), self.size()
        if stamp != self.stamp or size < self.read_to:
            self.records, self.stamp, self.read_to = self.scanned(), stamp, size
            self.verified = time.monotonic()
        elif size > self.read_to:
            self.take_changes(size)
        if time.monotonic() - self.verified >= VERIFY_EVERY:
            self.verify()
        return self.records

    def verify(self) -> None:
        """Looks at every known session file's time and size, since a process on an older build writes one without telling anyone; only a file that changed is read."""
        self.verified = time.monotonic()
        found = {name: record for name in self.records if (record := self.record_of(name)) is not None}
        if found != self.records:
            self.records = found

    def take_changes(self, size: int) -> None:
        with (self.folder / self.CHANGES).open("rb") as changes:
            changes.seek(self.read_to)
            written = changes.read(size - self.read_to)
        whole = written[: written.rfind(b"\n") + 1]
        self.read_to += len(whole)
        records = dict(self.records)
        for name in {line.decode() for line in whole.splitlines() if line}:
            record = self.record_of(name)
            if record is None:
                records.pop(name, None)
            else:
                records[name] = record
        self.records = records

    def scanned(self) -> dict[str, SessionRecord]:
        try:
            names = sorted(entry.name for entry in os.scandir(self.folder) if entry.is_dir())
        except OSError:
            return {}
        found = {name: record for name in names if (record := self.record_of(name)) is not None}
        self.kept = {name: self.kept[name] for name in found}
        return found

    def record_of(self, name: str) -> SessionRecord | None:
        """One session's record, read again only when its own file changed."""
        path = self.folder / name / SESSION
        try:
            found = os.stat(path)
        except OSError:
            return None
        stamp = (found.st_mtime_ns, found.st_size)
        held = self.kept.get(name)
        if not held or held[0] != stamp:
            held = self.kept[name] = (stamp, read_promised_json(path, SessionRecord.from_json, self.NONE))
        return held[1]

    def append_change(self, name: str) -> None:
        """Tells every process which session changed, after its file is written."""
        if self.size() > self.MOST:
            (self.folder / self.CHANGES).write_bytes(b"")
        with (self.folder / self.CHANGES).open("ab") as changes:
            changes.write(f"{name}\n".encode())


class SessionFilesSet:
    def __init__(self):
        self.by_root: dict[Path, SessionFiles] = {}

    def of(self, root: Path) -> SessionFiles:
        return self.by_root.setdefault(Path(root), SessionFiles(root))


SESSION_FILES = SessionFilesSet()
SESSION = "session.json"


@dataclass(frozen=True)
class Seat:
    """Which chair an agent takes: the environment, the name its session goes by, the process behind it and the provider running it. They travel together wherever a seat is claimed, succeeded or taken over, and the process and the provider together are what say two names are one agent."""

    env: str
    session: str
    pid: int = 0
    provider: str = ""


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
        with (self.path(session).parent / "session.lock").open("w") as lock:
            with waits.waited("sessions"):
                fcntl.flock(lock, fcntl.LOCK_EX)
            with locks.locked_apart():
                raw = read_promised_json(self.path(session), dict, {})
                got = {**(raw if isinstance(raw, dict) else {}), **fields}
                write_json(self.path(session), got)
        self.files.append_change(session)
        return SessionRecord.from_json(got)

    def bind(self, session: str, env: str, pid: int = 0, provider: str = "") -> dict:
        given = {"pid": pid, "provider": provider}
        return self.write(session, environment=env, since=time.time(), **{key: value for key, value in given.items() if value})

    def choose(self, session: str, provider: str, prefer: str, owned: set[str]) -> str:
        own = self.environment(session)
        if own and self.holder(own) in ("", session):
            return own
        others = self.all()
        ended = sorted((s for name, s in others.items() if name != session and s.provider == provider and s.environment and not live(s)
                        and not s.retired and s.environment not in owned), key=lambda s: s.last_heard)
        for s in reversed(ended):
            if not self.holder(s.environment):
                return s.environment
        return prefer

    def last(self, env: str, provider: str) -> str:
        """The session of this environment to start again: the one heard from last that is not running. A session is there to be taken up again because it exists, not because nothing has taken its place since, so what succeeded it does not come into it."""
        ended = [(s.last_heard, name) for name, s in self.all().items()
                 if s.environment == env and s.provider == provider and s.pid and not running(s)
                 and not name.startswith(f"{provider}-")]
        return max(ended)[1] if ended else ""

    def touch(self, session: str, worked_in: str) -> None:
        self.write(session, seen=time.time(), worked_in=worked_in, **self._unretired(session))

    def _unretired(self, session: str) -> dict:
        """Clears a retirement made by another name of this same agent. One process is one agent, so a record it retired and then went on reporting through was never succeeded: it took the environment from itself, which leaves the environment held by a record nobody touches while the working session sits retired out of sight."""
        held = self.read(session)
        return {"retired": {}} if held.retired and held.retired.get("by") in self.agent(session, held.pid) else {}

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
        """The session the journal launched for this agent: the process itself, or the one that started it. Codex runs its conversation in a child of the process the journal spawned and names that session after its rollout, so without the second step the conversation and the terminal read as two agents and the newcomer asks to take the environment from the agent it IS."""
        live = self.all()
        for walked in forebears(pid):
            found = next((name for name, s in live.items() if name.startswith(f"{provider}-") and s.pid == walked), "")
            if found:
                return found
        return ""

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
        """The sessions running in an environment, the one heard from last first: an environment's agent is whichever of its sessions is working, and nothing else decides it. A session that was once succeeded and is running again is its agent again, since being someone's past says nothing about whether it is at work now."""
        held = [(s.last_heard, session) for session, s in self.all().items() if s.environment == env and running(s)]
        return [session for _, session in sorted(held, reverse=True)]

    def version(self) -> tuple[int, int]:
        """Where the sessions stand on disk, the folder's stamp and the changes file's length, which moves whenever any session is written."""
        return self.files.current(), self.files.size()

    def holding(self) -> dict[str, str]:
        """Each environment's holder, the session heard from last, from one pass over the sessions with one liveness check each."""
        held: dict[str, str] = {}
        for _, session, env in sorted(((s.last_heard, session, s.environment) for session, s in self.all().items() if s.environment and live(s)), reverse=True):
            held.setdefault(env, session)
        return held

    def retire(self, session: str, by: str, why: str) -> None:
        """Marks a session as the environment's past: it keeps the environment, its transcript and its chat, and stops holding it, being nudged or being taken up again."""
        self.write(session, retired={"by": by, "why": why, "at": time.time()})

    def retired_in(self, env: str) -> SessionRecord:
        """The last session this environment moved past, so a new one can be told whose the chat above it is; a session with no retirement stands for none."""
        past = [s for s in self.all().values() if s.environment == env and s.retired]
        return max(past, key=lambda s: s.retired["at"], default=SessionFiles.NONE)

    def succeed(self, seat: "Seat") -> list[str]:
        """Retires every other session of an environment when a new one takes it: an environment houses one agent, and the ones before it become its past rather than disappearing from it."""
        env = seat.env
        mine = self.agent(seat.session, seat.pid)
        before = [name for name, s in self.all().items() if s.environment == env and name not in mine and not s.retired]
        for name in before:
            self.retire(name, seat.session, "a new session took this environment")
        return before

    def evict(self, session: str, by: str, env: str, why: str) -> None:
        self.write(session, environment="", evicted={"by": by, "environment": env, "why": why, "at": time.time()})

    def agent(self, session: str, pid: int = 0, provider: str = "") -> set[str]:
        """The names one agent goes by: its conversation and its terminal. They are one process, or the terminal's process started the conversation's. A session being seated for the first time is not in the record yet, so its provider comes from the caller that is seating it."""
        pid = pid or self.read(session).pid
        if not pid:
            return {session}
        live = self.all()
        launched = self.terminal(provider or live.get(session, SessionFiles.NONE).provider, pid)
        pids = {pid, live[launched].pid} if launched in live else {pid}
        return {name for name, s in live.items() if s.pid in pids} | {session}

    def _others(self, seat: "Seat") -> list[str]:
        """Every other agent holding an environment: its holders but this session's own."""
        mine = self.agent(seat.session, seat.pid, seat.provider)
        return [holder for holder in self.holders(seat.env) if holder not in mine]

    def rivals(self, seat: "Seat") -> list[str]:
        """The sessions of other agents on an environment whose process is alive: an environment has one live session, and one with no process behind it, as in a record only read, is no rival."""
        return [holder for holder in self._others(seat) if self.read(holder).pid]

    def take(self, seat: "Seat", why: str) -> list[str]:
        """Unbinds every other agent from an environment, each told it was taken over, so the session that asked for it is the one that holds it."""
        ended = self._others(seat)
        for holder in ended:
            for each in self.agent(holder):
                self.evict(each, seat.session, seat.env, why)
        return ended

    def asking(self, question: int) -> str:
        """The session that waits for the user to answer this question about taking an environment over."""
        return next((name for name, s in self.all().items() if s.takeover.get("question") == question), "")

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

import os
import time
from dataclasses import dataclass, field
from pathlib import Path

from engine.fields import list_of, mapping_of, number_of, text_of

from resources.types import TYPES
from engine.stored import read_json, write_json, write_text
from engine.proc import run
from engine import runtime


RECENT = 600.0
ACTIVE_ENV = "AGENT_JOURNAL_ACTIVE"
SHELLS = {"sh", "bash", "zsh", "dash", "fish"}


def alive(pid: int) -> bool:
    try:
        os.kill(int(pid), 0)
        return True
    except (OSError, ValueError, TypeError):
        return False


def hold_build(root: Path, build: Path) -> None:
    if build.suffix == ".pyz":
        write_text(runtime.builds(root) / str(os.getpid()), build.name)


def held_builds(root: Path) -> set[str]:
    held = set()
    for marker in runtime.builds(root).glob("*") if runtime.builds(root).is_dir() else ():
        if marker.name.isdigit() and alive(int(marker.name)):
            held.add(marker.read_text().strip())
        else:
            marker.unlink(missing_ok=True)
    return held


@dataclass(frozen=True)
class SessionRecord:
    environment: str = ""
    provider: str = ""
    pid: int = 0
    since: float = 0.0
    seen: float = 0.0
    args: tuple = ()
    launch: int = 0
    evicted: dict = field(default_factory=dict)
    grants: tuple = ()

    @classmethod
    def from_json(cls, raw) -> "SessionRecord":
        raw = raw if isinstance(raw, dict) else {}
        return cls(environment=text_of(raw, "environment"), provider=text_of(raw, "provider"), pid=int(number_of(raw, "pid")),
                   since=number_of(raw, "since"), seen=number_of(raw, "seen"), args=tuple(list_of(raw, "args")), launch=int(number_of(raw, "launch")),
                   evicted=mapping_of(raw, "evicted"), grants=tuple(list_of(raw, "grants")))

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


class Sessions:
    def __init__(self, root: Path):
        self.root = Path(root)

    def path(self, session: str) -> Path:
        return runtime.session_file(self.root, session, "session.json")

    def read(self, session: str) -> SessionRecord:
        return SessionRecord.from_json(read_json(self.path(session), {}))

    def known(self, session: str) -> bool:
        return self.path(session).is_file()

    def write(self, session: str, **fields) -> SessionRecord:
        raw = read_json(self.path(session), {})
        got = {**(raw if isinstance(raw, dict) else {}), **fields}
        write_json(self.path(session), got)
        return SessionRecord.from_json(got)

    def bind(self, session: str, env: str, pid: int = 0, provider: str = "") -> dict:
        return self.write(session, environment=env, since=time.time(), **({"pid": pid} if pid else {}), **({"provider": provider} if provider else {}))

    def choose(self, session: str, provider: str, prefer: str) -> str:
        own = self.environment(session)
        if own and self.holder(own) in ("", session):
            return own
        others = self.all()
        ended = sorted((s for name, s in others.items() if name != session and s.provider == provider and s.environment and not live(s)),
                       key=lambda s: s.last_heard)
        for s in reversed(ended):
            if not self.holder(s.environment):
                return s.environment
        return prefer

    def last(self, env: str, provider: str) -> str:
        ended = [(s.last_heard, name) for name, s in self.all().items()
                 if s.environment == env and s.provider == provider and s.pid and not live(s)
                 and not name.startswith(f"{provider}-")]
        return max(ended)[1] if ended else ""

    def touch(self, session: str) -> None:
        self.write(session, seen=time.time())

    def unbind(self, session: str) -> None:
        self.write(session, environment="")

    def rebind(self, old: str, new: str) -> None:
        for session, s in self.all().items():
            if s.environment == old:
                self.write(session, environment=new)
        if runtime.env_file(self.root).is_file() and runtime.env(self.root) == old:
            runtime.set_env(self.root, new)

    def environment(self, session: str) -> str:
        return self.read(session).environment

    def all(self) -> dict[str, SessionRecord]:
        return {p.parent.name: SessionRecord.from_json(read_json(p, {})) for p in sorted(runtime.sessions(self.root).glob("*/session.json"))}

    def holder(self, env: str) -> str:
        for session, s in self.all().items():
            if s.environment == env and live(s):
                return session
        return ""

    def evict(self, session: str, by: str, env: str, why: str) -> None:
        self.write(session, environment="", evicted={"by": by, "environment": env, "why": why, "at": time.time()})

    def grant(self, session: str, env: str, on: bool = True) -> list[str]:
        lent = set(self.read(session).grants)
        lent.add(env) if on else lent.discard(env)
        return list(self.write(session, grants=sorted(lent)).grants)

    def granted(self, session: str, env: str) -> bool:
        return env in self.read(session).grants


def allowed(sessions: Sessions, session: str, env: str, actor_id: str, type_: str) -> str:
    if not actor_id:
        return ""
    if not sessions.granted(session, env):
        return f"environment {env!r} is not lent to this session's subagents: journal environment <n> grant first"
    if not TYPES[type_].subagent_writable:
        return f"a subagent never writes a {type_}: report it, and the main conversation files it"
    return ""

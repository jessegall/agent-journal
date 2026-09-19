import os
import subprocess
import time
from pathlib import Path

from resources.types import TYPES
from engine.stored import read_json, write_json


RECENT = 600.0
ACTIVE_ENV = "AGENT_JOURNAL_ACTIVE"
SHELLS = {"sh", "bash", "zsh", "dash", "fish"}


def alive(pid: int) -> bool:
    try:
        os.kill(int(pid), 0)
        return True
    except (OSError, ValueError, TypeError):
        return False


def live(session: dict) -> bool:
    if session.get("pid"):
        return alive(session["pid"])
    return time.time() - float(session.get("seen") or session.get("since") or 0) < RECENT


def agent_pid(pid: int) -> int:
    for _ in range(4):
        try:
            parent, name = subprocess.run(["ps", "-o", "ppid=,comm=", "-p", str(pid)], capture_output=True, text=True, timeout=2).stdout.split(None, 1)
        except (OSError, ValueError, subprocess.TimeoutExpired):
            return pid
        if Path(name.strip()).name.lstrip("-") not in SHELLS:
            return pid
        pid = int(parent)
    return pid


class Sessions:
    def __init__(self, root: Path):
        self.root = Path(root)

    def path(self, session: str) -> Path:
        return self.root / "runtime" / f"session-{session}.json"

    def read(self, session: str) -> dict:
        return read_json(self.path(session), {})

    def write(self, session: str, **fields) -> dict:
        got = {**self.read(session), **fields}
        write_json(self.path(session), got)
        return got

    def bind(self, session: str, env: str, pid: int = 0, provider: str = "") -> dict:
        return self.write(session, environment=env, since=time.time(), **({"pid": pid} if pid else {}), **({"provider": provider} if provider else {}))

    def choose(self, session: str, provider: str, prefer: str) -> str:
        own = self.environment(session)
        if own and self.holder(own) in ("", session):
            return own
        others = self.all()
        ended = sorted((s for name, s in others.items() if name != session and s.get("provider") == provider and s.get("environment") and not live(s)),
                       key=lambda s: float(s.get("seen") or s.get("since") or 0))
        for s in reversed(ended):
            if not self.holder(s["environment"]):
                return s["environment"]
        return prefer

    def touch(self, session: str) -> None:
        self.write(session, seen=time.time())

    def unbind(self, session: str) -> None:
        self.write(session, environment="")

    def rebind(self, old: str, new: str) -> None:
        for session, s in self.all().items():
            if s.get("environment") == old:
                self.write(session, environment=new)
        f = self.root / "runtime" / "env"
        if f.is_file() and f.read_text().strip() == old:
            f.write_text(new)

    def environment(self, session: str) -> str:
        return self.read(session).get("environment", "")

    def all(self) -> dict[str, dict]:
        return {p.stem.removeprefix("session-"): read_json(p, {})
                for p in sorted((self.root / "runtime").glob("session-*.json"))} if (self.root / "runtime").is_dir() else {}

    def holder(self, env: str) -> str:
        for session, s in self.all().items():
            if s.get("environment") == env and live(s):
                return session
        return ""

    def evict(self, session: str, by: str, env: str, why: str) -> None:
        self.write(session, environment="", evicted={"by": by, "environment": env, "why": why, "at": time.time()})

    def grant(self, session: str, env: str, on: bool = True) -> list[str]:
        lent = set(self.read(session).get("grants", []))
        lent.add(env) if on else lent.discard(env)
        return self.write(session, grants=sorted(lent))["grants"]

    def granted(self, session: str, env: str) -> bool:
        return env in self.read(session).get("grants", [])


def allowed(sessions: Sessions, session: str, env: str, actor_id: str, type_: str) -> str:
    if not actor_id:
        return ""
    if not sessions.granted(session, env):
        return f"environment {env!r} is not lent to this session's subagents: journal environment <n> grant first"
    if not TYPES[type_].lent:
        return f"a subagent never writes a {type_}: report it, and the main conversation files it"
    return ""

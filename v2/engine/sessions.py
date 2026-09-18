import json
import os
import time
from pathlib import Path


def alive(pid: int) -> bool:
    try:
        os.kill(int(pid), 0)
        return True
    except (OSError, ValueError, TypeError):
        return False


class Sessions:
    def __init__(self, root: Path):
        self.root = Path(root)

    def path(self, session: str) -> Path:
        return self.root / "runtime" / f"session-{session}.json"

    def read(self, session: str) -> dict:
        try:
            return json.loads(self.path(session).read_text())
        except (OSError, ValueError):
            return {}

    def write(self, session: str, **fields) -> dict:
        got = {**self.read(session), **fields}
        self.path(session).parent.mkdir(parents=True, exist_ok=True)
        self.path(session).write_text(json.dumps(got))
        return got

    def bind(self, session: str, env: str, pid: int = 0) -> dict:
        return self.write(session, environment=env, since=time.time(), pid=pid or os.getpid())

    def unbind(self, session: str) -> None:
        self.write(session, environment="")

    def environment(self, session: str) -> str:
        return self.read(session).get("environment", "")

    def all(self) -> dict[str, dict]:
        return {p.stem.removeprefix("session-"): json.loads(p.read_text())
                for p in sorted((self.root / "runtime").glob("session-*.json"))} if (self.root / "runtime").is_dir() else {}

    def holder(self, env: str) -> str:
        for session, s in self.all().items():
            if s.get("environment") == env and alive(s.get("pid")):
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

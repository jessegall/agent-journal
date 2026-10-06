from pathlib import Path

from engine import runtime
from engine.paths import environments
from engine.sessions import Sessions


def bound_environment(root: Path, sessions: Sessions, session: str, named: str, top: Path | None, fallback: str) -> str:
    worked = top.name if top and (environments(root) / top.name).is_dir() else ""
    return named or (sessions.environment(session) if session else "") or worked or runtime.renamed(root, fallback) or runtime.env(root)

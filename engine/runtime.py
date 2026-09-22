import time
from pathlib import Path

from engine.stored import write_text

DEFAULT_ENV = "main"
WARM_UP = 20.0
STARTED: list[float] = [0.0]


def folder(root: Path) -> Path:
    return Path(root) / "runtime"


def env_file(root: Path) -> Path:
    return folder(root) / "env"


def off_file(root: Path) -> Path:
    return folder(root) / "off"


def channel_queue(root: Path) -> Path:
    return folder(root) / "channel.jsonl"


def channel_alive(root: Path) -> Path:
    return folder(root) / "channel.on"


def sessions(root: Path) -> Path:
    return folder(root) / "sessions"


def session_file(root: Path, session: str, name: str) -> Path:
    return sessions(root) / session / name


def announced_file(root: Path, session: str) -> Path:
    return session_file(root, session, "announced.json")


def relaunch_file(root: Path, session: str) -> Path:
    return session_file(root, session, "relaunch.json")


def env(root: Path) -> str:
    try:
        return env_file(root).read_text().strip() or DEFAULT_ENV
    except OSError:
        return DEFAULT_ENV


def set_env(root: Path, name: str) -> None:
    write_text(env_file(root), name)


def off(root: Path) -> bool:
    return off_file(root).is_file()


def warming() -> bool:
    return bool(STARTED[0]) and time.time() - STARTED[0] < WARM_UP

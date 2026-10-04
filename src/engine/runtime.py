import time
from pathlib import Path

from engine.stored import RUNTIME, read_json, write_json, write_text

DEFAULT_ENV = "main"
WARM_UP = 20.0
STARTED: list[float] = [0.0]


def folder(root: Path) -> Path:
    return Path(root) / RUNTIME


def env_file(root: Path) -> Path:
    return folder(root) / "env"


def off_file(root: Path) -> Path:
    return folder(root) / "off"


def restarting(root: Path) -> Path:
    return folder(root) / "restarting"


def channel_queue(root: Path, pid: int) -> Path:
    return folder(root) / "channels" / f"{pid}.jsonl"


def channel_alive(root: Path, pid: int) -> Path:
    return folder(root) / "channels" / f"{pid}.on"


def profiles(root: Path) -> Path:
    return folder(root) / "slow"


def sessions(root: Path) -> Path:
    return folder(root) / "sessions"


def builds(root: Path) -> Path:
    return folder(root) / "builds"


def inputs(root: Path) -> Path:
    return folder(root) / "inputs"


def viewer_log(root: Path) -> Path:
    return folder(root) / "viewer.log"


def upstream_cache(root: Path) -> Path:
    return folder(root) / "upstream.cache"


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


def renames_file(root: Path) -> Path:
    return folder(root) / "renamed.json"


def renamed(root: Path, name: str) -> str:
    table = read_json(renames_file(root), dict, {})
    seen = {name}
    while table.get(name) and table[name] not in seen:
        name = table[name]
        seen.add(name)
    return name


def note_rename(root: Path, old: str, new: str) -> None:
    table = {k: v for k, v in read_json(renames_file(root), dict, {}).items() if k != new}
    write_json(renames_file(root), {**table, old: new})


def forget_rename(root: Path, name: str) -> None:
    table = read_json(renames_file(root), dict, {})
    if name in table:
        write_json(renames_file(root), {k: v for k, v in table.items() if k != name})


def off(root: Path) -> bool:
    return off_file(root).is_file()


def warming() -> bool:
    return bool(STARTED[0]) and time.time() - STARTED[0] < WARM_UP


UPGRADE_MARK = "upgrading"
UPGRADE_LONGEST = 600


def upgrade_mark(root: Path) -> Path:
    return folder(root) / UPGRADE_MARK


def upgrading(root: Path) -> bool:
    try:
        return time.time() - upgrade_mark(root).stat().st_mtime < UPGRADE_LONGEST
    except OSError:
        return False


TESTS_RUNNING = "tests-running"


def tests_running(root: Path) -> bool:
    from engine.sessions import alive
    try:
        return alive(int((folder(root) / TESTS_RUNNING).read_text()))
    except (OSError, ValueError):
        return False


def default_env(root: Path, prefer: str = "") -> str:
    return prefer or env(root)

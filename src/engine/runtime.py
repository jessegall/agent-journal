import time
from pathlib import Path

from engine.locks import RUNTIME
from engine.stored import read_json, write_json, write_text

DEFAULT_ENV = "main"
WARM_UP = 20.0
STARTED: list[float] = [0.0]


def folder(root: Path) -> Path:
    return Path(root) / RUNTIME


def env_file(root: Path) -> Path:
    return folder(root) / "env"


class FlagFile:
    def __init__(self, name: str):
        self.name = name
        self.known: dict[Path, bool] = {}

    def path(self, root: Path) -> Path:
        return folder(root) / self.name

    def is_raised(self, root: Path) -> bool:
        root = Path(root)
        if root not in self.known:
            self.refresh(root)
        return self.known[root]

    def refresh(self, root: Path) -> None:
        self.known[Path(root)] = self.path(root).exists()

    def raise_flag(self, root: Path) -> None:
        self.path(root).parent.mkdir(parents=True, exist_ok=True)
        self.path(root).write_text(str(time.time()))
        self.refresh(root)

    def lower_flag(self, root: Path) -> None:
        self.path(root).unlink(missing_ok=True)
        self.refresh(root)


FLAGS: list[FlagFile] = []


def flag(name: str) -> FlagFile:
    made = FlagFile(name)
    FLAGS.append(made)
    return made


OFF = flag("off")


def refresh_flags(root: Path) -> None:
    for flag in FLAGS:
        flag.refresh(root)


def hook_failures(root: Path) -> Path:
    return folder(root) / "hook-failures.log"


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
    return OFF.is_raised(root)


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

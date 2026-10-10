import json
import time
from pathlib import Path

from engine.git import config_changed_at, git_user_name
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


RESTART_FRESH = 300.0
STEP_TIMES = "upgrade-steps.jsonl"
STEP_TIMES_KEPT = 400


def restart_began(root: Path) -> float:
    """When the restart that is under way began, from the marker the stopping server or the upgrade left; none when there is no recent one."""
    try:
        began = float(restarting(root).read_text())
    except (OSError, ValueError):
        return 0.0
    return began if time.time() - began < RESTART_FRESH else 0.0


def record_step(root: Path, step: str, seconds: float, cpu: float = 0.0, version: str = "") -> None:
    """One line of the file that keeps how long each step of an update took, wall and processor seconds, the newest few hundred."""
    file = folder(root) / STEP_TIMES
    try:
        kept = file.read_text().splitlines()[1 - STEP_TIMES_KEPT:] if file.is_file() else []
        kept.append(json.dumps({"at": round(time.time()), "version": version, "step": step, "seconds": round(seconds, 2), "cpu": round(cpu, 2)}))
        file.write_text("\n".join(kept) + "\n")
    except OSError:
        return


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


def started_file(root: Path) -> Path:
    return folder(root) / "started"


def mark_started(root: Path) -> None:
    STARTED[0] = time.time()
    write_text(started_file(root), str(STARTED[0]))


def server_started(root: Path) -> float:
    if STARTED[0]:
        return STARTED[0]
    try:
        return float(started_file(root).read_text())
    except (OSError, ValueError):
        return 0.0


def git_user_file(root: Path) -> Path:
    return folder(root) / "git-user"


def remember_git_user(root: Path) -> str:
    name = git_user_name(Path(root).parent)
    write_text(git_user_file(root), name)
    return name


def git_user(root: Path) -> str:
    try:
        file = git_user_file(root)
        if file.stat().st_mtime >= config_changed_at(Path(root).parent):
            return file.read_text()
    except OSError:
        pass
    return remember_git_user(root)


def warming(root: Path) -> bool:
    return time.time() - server_started(root) < WARM_UP


UPGRADE_MARK = "upgrading"
UPGRADE_LONGEST = 600


def upgrade_mark(root: Path) -> Path:
    return folder(root) / UPGRADE_MARK


def upgrade_step(root: Path) -> str:
    """The step the running upgrade says it is on."""
    try:
        return upgrade_mark(root).read_text().strip() if upgrading(root) else ""
    except OSError:
        return ""


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

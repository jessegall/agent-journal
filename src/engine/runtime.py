import os
import json
import threading
import time
from dataclasses import dataclass
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


STEPPING = threading.Lock()


def record_step(root: Path, step: str, seconds: float, cpu: float = 0.0, version: str = "") -> None:
    """One line of the file that keeps how long each step of an update took, wall and processor seconds, the newest few hundred."""
    file = folder(root) / STEP_TIMES
    try:
        with STEPPING:
            kept = file.read_text().splitlines()[1 - STEP_TIMES_KEPT:] if file.is_file() else []
            kept.append(json.dumps({"at": round(time.time()), "version": version, "step": step, "seconds": round(seconds, 2), "cpu": round(cpu, 2)}))
            write_text(file, "\n".join(kept) + "\n")
    except OSError:
        return


@dataclass(frozen=True)
class Step:
    """One recorded step of an update: what it was and how long it took."""

    step: str
    seconds: float

    @property
    def is_a_mark(self) -> bool:
        """Says whether its figure is the time since the server began rather than the step's own, as a start's marks are: they overlap, so they are never added up."""
        return self.step.startswith(("start:", "restart:"))

    def said(self) -> str:
        return f"{self.step} ({self.seconds:.1f}s)"


@dataclass(frozen=True)
class Update:
    """How long the last update took: the steps that ran one after another, the restart and warm-up they ended in, and the slowest of the steps."""

    installing: float
    restarting: float
    slowest: tuple[Step, ...]

    @property
    def seconds(self) -> float:
        return self.installing + self.restarting

    def said(self) -> str:
        """What the update took, in words for the user."""
        if not self.seconds:
            return ""
        took = (f"The update took {self.seconds:.0f} seconds: {self.installing:.0f} to install the files "
                f"and {self.restarting:.0f} for the server to restart and warm up.")
        if not self.slowest:
            return took
        return f"{took} The slowest steps were {', '.join(step.said() for step in self.slowest)}."


FIRST_STEP = "copy the new files"
SLOWEST_SAID = 3


def update_steps(root: Path) -> Update:
    """How long the update that just finished took, read from the step file: every step since it copied the new files, and the marks the start that followed wrote."""
    try:
        rows = [json.loads(line) for line in (folder(root) / STEP_TIMES).read_text().splitlines() if line]
    except (OSError, ValueError):
        return Update(0.0, 0.0, ())
    copied = [index for index, row in enumerate(rows) if row.get("step") == FIRST_STEP]
    if not copied:
        return Update(0.0, 0.0, ())
    steps = [Step(row.get("step", ""), row.get("seconds", 0.0)) for row in rows[copied[-1]:]]
    ran = [step for step in steps if not step.is_a_mark]
    marks = [step.seconds for step in steps if step.is_a_mark]
    slowest = sorted(ran, key=lambda step: step.seconds, reverse=True)[:SLOWEST_SAID]
    return Update(sum(step.seconds for step in ran), max(marks, default=0.0), tuple(slowest))


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


def booting_mark(root: Path) -> Path:
    return folder(root) / "booting"


def mark_booting(root: Path) -> None:
    """The server has begun to start: until it has warmed what the viewer first asks for, it says it is not ready."""
    write_text(booting_mark(root), str(os.getpid()))


def mark_booted(root: Path) -> None:
    booting_mark(root).unlink(missing_ok=True)
    boot_step_mark(root).unlink(missing_ok=True)


def boot_step_mark(root: Path) -> Path:
    return folder(root) / "booting-step"


def mark_boot_step(root: Path, step: str) -> None:
    """The step the start is on, for the cover to show; a plain write that never raises, so the mark cannot break the step it names."""
    try:
        boot_step_mark(root).write_text(step)
    except OSError:
        return


def boot_step(root: Path) -> str:
    try:
        return boot_step_mark(root).read_text().strip() if booting(root) else ""
    except OSError:
        return ""


def booting(root: Path) -> bool:
    return booting_mark(root).is_file()


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


def mark_upgrade(root: Path, step: str) -> None:
    """Says which step an upgrade is on, with the process running it, so a mark an upgrade was killed before clearing stops holding every agent back."""
    write_text(upgrade_mark(root), f"{os.getpid()}\n{step}")


def upgrade_held(root: Path) -> tuple[int, str]:
    """The process a mark names and the step it says it is on; a mark from before the process was named reads as nobody, and is judged on its age alone."""
    try:
        named, _, step = upgrade_mark(root).read_text().partition("\n")
    except OSError:
        return 0, ""
    return (int(named) if named.strip().isdigit() else 0), (step or named).strip()


def upgrade_step(root: Path) -> str:
    """The step the running upgrade says it is on."""
    return upgrade_held(root)[1] if upgrading(root) else ""


def upgrading(root: Path) -> bool:
    from engine.sessions import alive
    try:
        fresh = time.time() - upgrade_mark(root).stat().st_mtime < UPGRADE_LONGEST
    except OSError:
        return False
    held = upgrade_held(root)[0]
    return fresh and (held == 0 or alive(held))


TESTS_RUNNING = "tests-running"
TEST_OWNER = "AGENT_JOURNAL_TEST_OWNER"


def owner_gone() -> bool:
    """Whether the test that started this journal has ended: a journal a test starts is born with that test's process in its environment and stops with it, however it was started or restarted since; one with no such owner never is."""
    from engine.sessions import alive
    owner = os.environ.get(TEST_OWNER)
    return bool(owner) and not alive(owner)


def tests_running(root: Path) -> bool:
    from engine.sessions import alive
    try:
        return alive(int((folder(root) / TESTS_RUNNING).read_text()))
    except (OSError, ValueError):
        return False


def default_env(root: Path, prefer: str = "") -> str:
    return prefer or env(root)

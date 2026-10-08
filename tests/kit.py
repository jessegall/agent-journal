import os
import subprocess
import sys
import threading
import time
from contextlib import contextmanager
from dataclasses import dataclass, field
from pathlib import Path

from controllers.types import Agents, Nudges
from install import UNVERIFIED
from scripts.boot_guard import PROJECT
from tests import isolation
from engine.record import Record
from resources.base import AGENT, SYSTEM
from commands.cli import captured  # noqa: F401
from commands.cli import run  # noqa: F401
import commands.http  # noqa: F401
from commands.dispatch import dispatch  # noqa: F401
from commands.demo import demo_built  # noqa: F401
import commands.launch_update as launch_update  # noqa: F401
from commands.launch import asked_for  # noqa: F401
from commands.launch import asked_history  # noqa: F401
from commands.launch import asked_prompts  # noqa: F401
from commands.launch import asked_resume  # noqa: F401
from commands.launch import asked_slate  # noqa: F401
from commands.launch import defaults  # noqa: F401
from commands.queries import ended  # noqa: F401
from migrations.m0062_clean_slate_moved_into_its_file import run as clean_slate_moved  # noqa: F401
from features.plans.controller import Plans  # noqa: F401
from features.plugins.manifest import MANIFEST  # noqa: F401
from features.plugins.manifest import read  # noqa: F401
from features.tickets.controller import Tickets  # noqa: F401
from runner import engine as engine_module  # noqa: F401
from runner import engines  # noqa: F401
from runner.engine import Engine  # noqa: F401
from runner.gate import PAUSED  # noqa: F401
from runner.hooks import answer  # noqa: F401
from runner.hooks import handle  # noqa: F401


def report(record, status, event, session="claude-1", **more):
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(session)
    uses = int(row.data.get("uses") or 0) + (event == "PreToolUse")
    agents.saw(row.n, {"hook": event, "session": session, "cause": AGENT}, **{**row.data, "uses": uses, **more, "status": status, "event": event, "at": time.time()})


def tick(record, session="claude-1"):
    from runner.engine import emit_clock
    emit_clock(record, session)


def idle(record, **more):
    report(record, "working", "PreToolUse", **more)
    report(record, "idle", "Stop", **more)


def nudges(record):
    return [n.title for n in Nudges(record).all(completed=True)]


def nudges_with_briefs(record):
    return [(n.title, n.brief) for n in Nudges(record).all(completed=True)]


def git(where: Path, *args: str) -> str:
    return subprocess.run(["git", *args], cwd=where, check=True, capture_output=True, text=True, timeout=30).stdout.strip()


def commit(where: Path, name: str, text: str) -> str:
    (where / name).write_text(text)
    git(where, "add", name)
    git(where, "commit", "-q", "-m", f"write {name}")
    return git(where, "rev-parse", "HEAD")


@dataclass(frozen=True)
class Repo:
    record: Record
    project: Path


def project_on(branch: str) -> Repo:
    from tests.conftest import fresh
    record = fresh()
    record.root.mkdir(parents=True, exist_ok=True)
    project = record.root.resolve().parent
    git(project, "init", "-q", "-b", "main")
    git(project, "config", "user.email", "t@t")
    git(project, "config", "user.name", "t")
    (project / ".gitignore").write_text("/.journal\n/.claude/worktrees/\n")
    git(project, "add", ".gitignore")
    git(project, "commit", "-q", "-m", "start")
    git(project, "checkout", "-q", "-b", branch)
    commit(project, "shared.txt", "one\n")
    return Repo(record, project)


AUDITED = {"open": "opened", "os.scandir": "scanned", "os.listdir": "scanned"}
ACTIVE = threading.local()
INSTALLED = []


@dataclass
class Work:
    opened: list = field(default_factory=list)
    scanned: list = field(default_factory=list)


def recorded(event: str, args: tuple) -> None:
    work = getattr(ACTIVE, "work", None)
    if work is not None and event in AUDITED:
        getattr(work, AUDITED[event]).append(str(args[0]))


@contextmanager
def counted():
    if not INSTALLED:
        sys.addaudithook(recorded)
        INSTALLED.append(recorded)
    ACTIVE.work = Work()
    try:
        yield ACTIVE.work
    finally:
        ACTIVE.work = None


SOURCE = Path(__file__).resolve().parents[1] / "src"


def installed(place: Path, code: Path) -> Path:
    return install(place, code, {})


def installed_to_start(place: Path, code: Path) -> Path:
    """An install for a test that starts the build itself, so the installer does not start it once more to check it."""
    return install(place, code, {UNVERIFIED: "1"})


def install(place: Path, code: Path, env: dict) -> Path:
    for agent in (".claude", ".codex"):
        (place / PROJECT / agent).mkdir(parents=True)
    subprocess.run([sys.executable, str(code / "install.py"), "upgrade", str(place / PROJECT)],
                   env={**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1", **env}, capture_output=True, timeout=120, check=True)
    return place / PROJECT / ".journal"


def installed_once() -> Path:
    """The run's one install of this build, which tests read or copy and never change."""
    return isolation.shared("installed-once", lambda where: installed_to_start(where, SOURCE)) / PROJECT / ".journal"

from pathlib import Path

from agents.terminal import Launched, prompted as prompted_by_file
from supervisor import LAUNCHED
from controllers.types import Environments, Features
from engine import runtime
from engine.record import Record
from engine.seats import terminal_of
from engine.sessions import Sessions, alive
from engine.stop import ask_session
from providers import DEFAULT_PROVIDER, DRIVERS
from features.permission_prompts.skipping import prompted
from resources.base import SYSTEM
from resources.types import EnvironmentKind

QUIET = ("dev_faults",)


def start_agent_in(record, name: str, worktree: str, abstract: str, owner: str, prompt: str, kind: EnvironmentKind) -> str:
    prepared(record, name, abstract, owner, record.root.parent, kind)
    return launched(record, name, DEFAULT_PROVIDER, prompted_by_file(record.root, name, DRIVERS[DEFAULT_PROVIDER].within([], worktree), prompt), record.root.parent)


def prepared(record, name: str, abstract: str, owner: str, folder: Path, kind: EnvironmentKind) -> Record:
    environments = Environments(record, actor=SYSTEM)
    if not environments.rows.by_title(name):
        environments.create(name, abstract=abstract, owner=owner, launched_from=record.env, folder=str(folder), kind=kind)
    place = Record(record.root, name)
    prompted(place)
    for feature in QUIET:
        Features(place, actor=SYSTEM).switch(feature, False)
    return place


def launched(record, name: str, provider: str, args: list[str], cwd: Path) -> str:
    from agents.terminal import detached
    detached(record.root, cwd, name, provider, args)
    return name


def running(launched: Launched) -> bool:
    return not launched.pid or alive(launched.pid)


def running_in(record, environment: str) -> str:
    session = Sessions(record.root).holder(environment)
    if session:
        return session if running(Launched.read(record.root, terminal_of(record.root, session))) else ""
    return launched_in(record.root, environment)


def launched_in(root: Path, environment: str) -> str:
    """An agent launched into the environment counts from its launch, before its worker has seated its session."""
    for path in runtime.sessions(root).glob(f"*/{LAUNCHED}"):
        launched = Launched.read(root, path.parent.name)
        if launched.env == environment and launched.pid and alive(launched.pid):
            return path.parent.name
    return ""


def running_at(root: Path, folder: Path) -> bool:
    inside = folder.resolve()
    for path in runtime.sessions(root).glob(f"*/{LAUNCHED}"):
        launched = Launched.read(root, path.parent.name)
        if launched.pid and alive(launched.pid) and launched.cwd and Path(launched.cwd).resolve().is_relative_to(inside):
            return True
    return False


def driver_in(record, environment: str, provider: str):
    from providers import DRIVERS
    session = running_in(record, environment)
    return DRIVERS[provider](Record(record.root, environment), terminal_of(record.root, session) or session) if session else None


def tell_in(record, environment: str, provider: str, text: str) -> bool:
    driver = driver_in(record, environment, provider)
    return bool(driver) and driver.send(text, now=True, by=record.env)


def stop_in(record, environment: str) -> None:
    session = Sessions(record.root).holder(environment)
    if session:
        ask_session(record.root, terminal_of(record.root, session))

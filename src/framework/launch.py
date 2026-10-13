import time
import subprocess
from pathlib import Path

from agents.terminal import Launched, prompted as prompted_by_file
from resources.places import LAUNCHED
from controllers.types import Environments, Features
from engine import bus, runtime
from engine.record import Record
from engine.seats import terminal_of
from engine.sessions import Sessions, alive
from engine.stop import ask_session
from resources.base import DEFAULT_PROVIDER
from controllers.features import settle_prompts
from resources.base import SYSTEM
from resources.types import EnvironmentKind, NewEnvironment, Running
from serving import SERVED, Providers

def start_agent_in(record, name: str, worktree: str, abstract: str, owner: str, prompt: str, kind: EnvironmentKind) -> str:
    prepared(record, NewEnvironment(name, abstract, owner, record.root.parent, kind))
    return launched(record, name, DEFAULT_PROVIDER, prompted_by_file(record.root, name, SERVED.given(Providers).driver(DEFAULT_PROVIDER).within([], worktree), prompt), record.root.parent)


def prepared(record, wanted: NewEnvironment) -> Record:
    environments = Environments(record, actor=SYSTEM)
    if not environments.rows.by_title(wanted.name):
        environments.create(wanted.name, abstract=wanted.abstract, owner=wanted.owner, launched_from=record.env, folder=str(wanted.folder), kind=wanted.kind)
    place = Record(record.root, wanted.name)
    settle_prompts(place)
    Features(place, actor=SYSTEM).quieten()
    return place


def launched(record, name: str, provider: str, args: list[str], cwd: Path) -> str:
    from agents.terminal import detached
    detached(record.root, cwd, name, provider, args)
    return name


def running(launched: Launched) -> bool:
    return not launched.pid or alive(launched.pid)


def running_in(record, environment: str) -> str:
    session = Sessions(record.root).holder(environment)
    if session and running(Launched.read(record.root, terminal_of(record.root, session))):
        return session
    return launched_in(record.root, environment)


def launched_in(root: Path, environment: str) -> str:
    """An agent launched into the environment counts from its launch, before its worker has seated its session."""
    for path in runtime.sessions(root).glob(f"*/{LAUNCHED}"):
        launched = Launched.read(root, path.parent.name)
        if launched.env == environment and launched.pid and alive(launched.pid):
            return path.parent.name
    return ""


def driver_in(running: Running):
    root = running.record.root
    session = running_in(running.record, running.environment)
    return SERVED.given(Providers).driver(running.provider)(Record(root, running.environment), terminal_of(root, session) or session) if session else None


def tell_in(running: Running, text: str) -> bool:
    driver = driver_in(running)
    return bool(driver) and driver.send(text, now=True, by=running.record.env)


def tell_soon(running: Running, text: str) -> bool:
    """Whether an agent runs in the environment; if so the words are typed to it behind the answer, so the sender never waits on its screen."""
    driver = driver_in(running)
    if driver:
        bus.background(f"tell:{running.environment}:{time.monotonic()}", lambda: driver.send(text, now=True, by=running.record.env))
    return bool(driver)


def stop_in(record, environment: str) -> None:
    session = Sessions(record.root).holder(environment)
    if session:
        ask_session(record.root, terminal_of(record.root, session))


def apart(command: list[str], cwd: Path) -> None:
    """Starts a command in a session of its own with nothing attached to it, so it outlives the call that asked for it."""
    subprocess.Popen(command, cwd=cwd, start_new_session=True,
                     stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def apart_into(command: list[str], log: Path) -> int:
    """Starts a command in a session of its own writing into a log, and says which process it is, for anything that must be stopped later."""
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open("a") as written:
        return subprocess.Popen(command, start_new_session=True, stdin=subprocess.DEVNULL, stdout=written, stderr=written).pid

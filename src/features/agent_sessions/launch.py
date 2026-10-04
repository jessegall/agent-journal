from pathlib import Path

from controllers.types import Environments, Features
from engine.record import Record
from engine.seats import terminal_of
from engine.sessions import Sessions
from engine.stop import ask_session
from features.permission_prompts.feature import prompted
from resources.base import SYSTEM

QUIET = ("dev_faults",)
PROVIDER = "claude"


def start_agent_in(record, name: str, worktree: str, abstract: str, owner: str, prompt: str) -> str:
    from providers import DRIVERS
    driver = DRIVERS[PROVIDER]
    return start_in(record, name, abstract, owner, PROVIDER, driver.prompted(driver.within([], worktree), prompt), record.root.parent)


def start_in(record, name: str, abstract: str, owner: str, provider: str, args: list[str], cwd: Path) -> str:
    prepared(record, name, abstract, owner)
    return launched(record, name, provider, args, cwd)


def prepared(record, name: str, abstract: str, owner: str) -> Record:
    environments = Environments(record, actor=SYSTEM)
    if not environments._titled(name):
        environments.create(name, abstract=abstract, owner=owner, launched_from=record.env)
    place = Record(record.root, name)
    prompted(place)
    for feature in QUIET:
        Features(place, actor=SYSTEM).switch(feature, False)
    return place


def launched(record, name: str, provider: str, args: list[str], cwd: Path) -> str:
    from agents.terminal import detached
    detached(record.root, cwd, name, provider, args)
    return name


def driver_in(record, environment: str, provider: str):
    from providers import DRIVERS
    session = Sessions(record.root).holder(environment)
    return DRIVERS[provider](Record(record.root, environment), terminal_of(record.root, session)) if session else None


def tell_in(record, environment: str, provider: str, text: str) -> bool:
    driver = driver_in(record, environment, provider)
    return bool(driver) and driver.send(text, now=True, by=record.env)


def stop_in(record, environment: str) -> None:
    session = Sessions(record.root).holder(environment)
    if session:
        ask_session(record.root, terminal_of(record.root, session))

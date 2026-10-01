from pathlib import Path

from controllers.types import Environments, Features
from engine.record import Record
from features.permission_prompts.feature import prompted
from resources.base import SYSTEM

QUIET = ("dev_faults",)
PROVIDER = "claude"


def start_agent_in(record, name: str, worktree: str, abstract: str, owner: str, prompt: str) -> str:
    from providers import DRIVERS
    driver = DRIVERS[PROVIDER]
    return start_in(record, name, abstract, owner, PROVIDER, driver.prompted(driver.within([*driver.AUTO_ARGS], worktree), prompt), record.root.parent)


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

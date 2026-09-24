from controllers.types import Environments, Features
from engine.record import Record
from features.permission_prompts.feature import prompted
from resources.base import SYSTEM

QUIET = ("dev_faults",)
PROVIDER = "claude"


def start_agent_in(record, name: str, worktree: str, abstract: str, owner: str, prompt: str) -> str:
    from engine.terminal import detached
    from providers import DRIVERS
    environments = Environments(record, actor=SYSTEM)
    if not environments._titled(name):
        environments.create(name, abstract=abstract, owner=owner)
    place = Record(record.root, name)
    prompted(place)
    for feature in QUIET:
        Features(place, actor=SYSTEM).switch(feature, False)
    driver = DRIVERS[PROVIDER]
    detached(record.root, record.root.parent, name, PROVIDER, driver.prompted(driver.within([*driver.AUTO_ARGS], worktree), prompt))
    return name

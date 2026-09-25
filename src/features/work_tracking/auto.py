import time

from controllers.types import Environments, Works
from providers import DRIVERS
from resources.base import SYSTEM

AUTO = "work_tracking.auto"


OWNERS: dict = {}


def steered(record) -> str:
    key = (str(record.root), record.env)
    if key not in OWNERS:
        place = Environments(record, actor=SYSTEM)._titled(record.env)
        OWNERS[key] = str(place.owner) if place else ""
    return OWNERS[key]


def automatic(record) -> bool:
    from features import FEATURES
    return "work_tracking" in FEATURES and bool(FEATURES["work_tracking"].on(record, "auto"))


def passes_checkpoints(record) -> bool:
    return automatic(record) and not steered(record)


QUIET_FOR = 300.0
ASK_AGAIN = 300.0
STILL_THERE = "journal: you have been quiet for {minutes} minutes with work still open. Are you still working? Say where it stands, or carry on."


def still_there(record, quiet: float, state: str) -> str:
    if not automatic(record) or quiet < QUIET_FOR or state in ("idle", "stopped"):
        return ""
    waiting = [w for w in Works(record, actor=SYSTEM)._standing() if not w.parked]
    return STILL_THERE.format(minutes=int(quiet // 60)) if waiting else ""


class CheckIn:
    def __init__(self, agent):
        self.agent = agent
        self.asked_at = time.time()

    def tick(self) -> str:
        if time.time() - self.asked_at < ASK_AGAIN:
            return ""
        line = still_there(self.agent.record, self.agent.driver.quiet_for(), self.agent.state())
        if not line:
            return ""
        self.asked_at = time.time()
        self.agent.driver.send(line)
        return "asked whether it is still working"


def launch_args(record, provider: str, args: list[str]) -> list[str]:
    from features.permission_prompts.feature import skipped
    driver = DRIVERS.get(provider)
    if not driver:
        return args
    if driver.SKIP_ARGS and set(driver.SKIP_ARGS) <= set(args) and not skipped(record):
        record.set_setting("permission_prompts", {**record.setting("permission_prompts", {}), "skip": True})
    return driver.launch_args(driver.skipping(args, skipped(record)), automatic(record))

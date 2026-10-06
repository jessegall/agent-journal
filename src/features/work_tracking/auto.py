import time

from controllers.types import Environments, Works
from providers import DRIVERS
from resources.base import SYSTEM
from resources.types import AT_REST

AUTO = "work_tracking.auto"


def steered(record) -> str:
    place = Environments(record, actor=SYSTEM).rows.by_title(record.env)
    return str(place.owner) if place else ""


def automatic(record) -> bool:
    from features import FEATURES
    return "work_tracking" in FEATURES and bool(FEATURES["work_tracking"].on(record, "auto"))


def passes_checkpoints(record) -> bool:
    return automatic(record) and not steered(record)


QUIET_FOR = 300.0
ASK_AGAIN = 300.0
STILL_THERE = "journal: you have been quiet for {minutes} minutes with work still open. Are you still working? Say where it stands, or carry on."


def still_there(record, quiet: float, state: str) -> str:
    if not automatic(record) or quiet < QUIET_FOR or state in AT_REST:
        return ""
    waiting = [w for w in Works(record, actor=SYSTEM).rows.standing() if not w.parked]
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

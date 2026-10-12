import time

from controllers.features import automatic  # noqa: F401  the feature's own callers name it here
from controllers.types import Environments, Works
from resources.base import SYSTEM
from resources.types import STOPPED

AUTO = "work_tracking.auto"


def steered(record) -> str:
    place = Environments(record, actor=SYSTEM).rows.by_title(record.env)
    return str(place.owner) if place else ""


def chosen_or_steered(chosen: bool, record, key: str) -> bool:
    """Auto mode is on when it is chosen, or when the environment is steered by a row that owns it."""
    return chosen or (key == "auto" and bool(steered(record)))





def passes_checkpoints(record) -> bool:
    return automatic(record) and not steered(record)


QUIET_FOR = 60.0
ASK_AGAIN = 300.0
STILL_THERE = ("journal: work {n}, {title}, is still open{parked} and nothing has happened for {minutes} minutes. "
               "Carry on with it, end it, or say plainly what it waits on.")
PARKED = ", parked because {why},"


def still_open(record) -> list:
    """Every work the agent has not finished, parked or not: a parked one is named too, because what it was parked for has usually passed."""
    return [w for w in Works(record, actor=SYSTEM).rows.standing() if not w.awaiting]


def still_there(record, quiet: float, state: str) -> str:
    if not automatic(record) or quiet < QUIET_FOR or state == STOPPED:
        return ""
    open_work = still_open(record)
    if not open_work:
        return ""
    work = open_work[0]
    return STILL_THERE.format(n=work.n, title=work.title, minutes=int(quiet // 60),
                              parked=PARKED.format(why=work.parked) if work.parked else "")


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

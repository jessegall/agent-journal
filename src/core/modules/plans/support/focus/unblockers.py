from dataclasses import dataclass

from core.modules.plans.support.focus.unblocker import Unblocker
from core.modules.plans.support.focus.waiting_line import WaitingLine


@dataclass(frozen=True)
class Unblockers:
    """What the unfinished tasks of one plan wait on, for one asking agent: the tasks it can take now, and a line
    for each task it cannot."""

    candidates: tuple[Unblocker, ...] = ()
    waiting: tuple[WaitingLine, ...] = ()

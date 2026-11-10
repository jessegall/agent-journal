from dataclasses import dataclass

from core.modules.plans.support.focus.unblocker import Unblocker
from core.modules.plans.support.focus.waiting_line import WaitingLine

MOST_SHOWN_WAITS = 5


@dataclass(frozen=True)
class Unblockers:
    """What the unfinished tasks of one plan wait on, for one asking agent: the tasks it can take now, and a line
    for each task it cannot."""

    candidates: tuple[Unblocker, ...] = ()
    waiting: tuple[WaitingLine, ...] = ()

    def task_ids(self) -> frozenset[int]:
        return frozenset([*(candidate.task_id for candidate in self.candidates), *(line.task_id for line in self.waiting)])

    def waits_text(self) -> str:
        shown = [f"task {line.task_id}, {line.text}" for line in self.waiting[:MOST_SHOWN_WAITS]]
        if len(self.waiting) > MOST_SHOWN_WAITS:
            shown.append(f"and {len(self.waiting) - MOST_SHOWN_WAITS} more")
        return "; ".join(shown)

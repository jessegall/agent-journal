from dataclasses import dataclass
from typing import Self


@dataclass(frozen=True)
class WaitEnds:
    """Where the waits of one task end: the tasks at the end that wait on nothing, whether the waits run in a
    circle, and whether a chain was longer than the walk follows."""

    task_ids: frozenset[int] = frozenset()
    has_circle: bool = False
    has_long_chain: bool = False

    def joined(self, ends: Self) -> Self:
        return type(self)(self.task_ids | ends.task_ids, self.has_circle or ends.has_circle, self.has_long_chain or ends.has_long_chain)

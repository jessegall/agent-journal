from collections import defaultdict
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Self

from core.modules.plans.models.enums.waiting_reason import WaitingReason
from core.modules.plans.support.focus.unblocker import Unblocker
from core.modules.plans.support.focus.unblocker_facts import UnblockerFacts
from core.modules.plans.support.focus.unblockers import Unblockers
from core.modules.plans.support.focus.wait_graph import LONGEST_CHAIN, WaitGraph
from core.modules.plans.support.focus.waiting_line import WaitingLine
from core.modules.tasks.models.task import Task

CIRCLE_TEXT = "which waits in a circle of tasks"
LONG_CHAIN_TEXT = f"whose chain of waits is longer than {LONGEST_CHAIN} tasks"


@dataclass(frozen=True)
class PlanWaitWalk:
    """Where the waits of the unfinished tasks of one plan end: for each task at an end, the plan tasks that
    wait on it, and a line for each wait that runs in a circle or is too long to follow."""

    waiting_tasks: Mapping[int, frozenset[int]]
    chain_lines: Mapping[int, WaitingLine]

    @classmethod
    def walked(cls, unfinished_ids: Sequence[int], graph: WaitGraph) -> Self:
        waiting_tasks: dict[int, set[int]] = defaultdict(set)
        chain_lines: dict[int, WaitingLine] = {}
        for task_id in unfinished_ids:
            for dependency_id in graph.dependencies(task_id):
                ends = graph.ends(dependency_id)
                if ends.has_circle:
                    chain_lines[dependency_id] = WaitingLine(dependency_id, WaitingReason.CIRCLE, CIRCLE_TEXT)
                    continue
                if ends.has_long_chain:
                    chain_lines[dependency_id] = WaitingLine(dependency_id, WaitingReason.LONG_CHAIN, LONG_CHAIN_TEXT)
                for end_id in ends.task_ids:
                    waiting_tasks[end_id].add(task_id)
        return cls({end_id: frozenset(task_ids) for end_id, task_ids in waiting_tasks.items()}, chain_lines)

    def unblockers(self, end_tasks: Mapping[int, Task], facts: UnblockerFacts) -> Unblockers:
        lines = dict(self.chain_lines)
        candidates = []
        for end_id in sorted(self.waiting_tasks):
            line = facts.waiting_line(end_tasks[end_id])
            if line is None:
                candidates.append(Unblocker(end_id, len(self.waiting_tasks[end_id])))
            else:
                lines[end_id] = line
        return Unblockers(tuple(candidates), tuple(lines[task_id] for task_id in sorted(lines)))

from collections.abc import Mapping, Sequence

from core.modules.plans.support.focus.wait_ends import WaitEnds

LONGEST_CHAIN = 10


class WaitGraph:
    """The open waits between tasks, held in memory: for each task, the open tasks it waits on. It follows the
    waits of a task to their ends, at most LONGEST_CHAIN tasks deep, and stops on a circle."""

    def __init__(self, waits: Mapping[int, Sequence[int]]) -> None:
        self.waits = waits

    def dependencies(self, task_id: int) -> Sequence[int]:
        return self.waits.get(task_id, ())

    def ends(self, task_id: int) -> WaitEnds:
        return self.chain_ends(task_id, tuple([task_id]))

    def chain_ends(self, task_id: int, path: tuple[int, ...]) -> WaitEnds:
        if len(path) > LONGEST_CHAIN:
            return WaitEnds(has_long_chain=True)
        dependencies = self.dependencies(task_id)
        if not dependencies:
            return WaitEnds(frozenset([task_id]))
        ends = WaitEnds()
        for dependency_id in dependencies:
            ends = ends.joined(WaitEnds(has_circle=True) if dependency_id in path else self.chain_ends(dependency_id, (*path, dependency_id)))
        return ends

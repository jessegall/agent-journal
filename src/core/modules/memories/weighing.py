from collections.abc import Sequence

from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.modules.memories.mark_tracker import MarkTracker
from core.modules.memories.rules.weigh_first import WeighFirst


class Weighing(Overlay):
    """While an agent has an open memory mark, its writes and stops wait until it weighs, makes, corrects or removes
    a memory, or skips with a reason."""

    name = "memories.weighing"
    exclusive = True
    rules = [WeighFirst]

    def __init__(self, marks: MarkTracker) -> None:
        self.marks = marks

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        return [OpenRow("memory_mark", mark.id, mark.opened_at) for mark in self.marks.open_marks(agent_id)]

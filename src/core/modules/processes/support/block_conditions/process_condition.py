from collections.abc import Sequence

from engine.container.container import Container
from engine.driver.block_condition import BlockCondition
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.models.process import Process


class ProcessCondition(BlockCondition):
    """A condition on one run, named by its number; its target is that run. The runs of a batch of blocks are
    read together."""

    @classmethod
    def prepare(cls, texts: Sequence[str], container: Container) -> None:
        container.get(EventRows).prepare(Process, [int(text) for text in texts])

    def has_target(self, container: Container) -> bool:
        return container.get(EventRows).find(Process, int(self.text)) is not None

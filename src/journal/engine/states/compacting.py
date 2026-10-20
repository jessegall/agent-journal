from dataclasses import dataclass

from journal.engine.base_state import BaseState


@dataclass(frozen=True)
class Compacting(BaseState):
    """The context is being compacted: every tool is held until the compaction ends, which pops it."""

    name = "compacting"
    title = "Compacting"

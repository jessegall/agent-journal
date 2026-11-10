from dataclasses import dataclass

from engine.model.model import Model
from engine.row.page import Page
from core.modules.memories.support.memory_holder_row import MemoryHolderRow


@dataclass(frozen=True)
class MemoryPage:
    """A page of memories and the agents named by its rows."""

    page: Page[Model]
    agents: tuple[MemoryHolderRow, ...]

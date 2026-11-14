from engine.chat.dock_declaration import DockDeclaration
from core.modules.memories.models.enums.memory_dock_type import MemoryDockType


class MemoryDock(DockDeclaration):
    """The dock of MemoryDockType.MEMORY."""

    type = MemoryDockType.MEMORY
    icon = "bulb"
    title = "{row_title}"
    body = "memory-dock.js"
    most = 6
    reads = ["memory show"]

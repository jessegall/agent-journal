from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.memories.models.enums.memory_state import MemoryState


class MemoryLifecycle(Lifecycle):
    states = MemoryState
    initial = [MemoryState.ACTIVE]
    editable = [MemoryState.ACTIVE]
    deletable = [MemoryState.REMOVED]

    remove = Move("remove", [MemoryState.ACTIVE], MemoryState.REMOVED)
    restore = Move("restore", [MemoryState.REMOVED], MemoryState.ACTIVE)

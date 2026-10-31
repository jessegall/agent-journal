from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.memories.memory import Memory
from core.modules.memories.memory_type_choice import MemoryTypeChoice


class TypeOn(Guard):
    """A memory is made only of a type switched on where it belongs."""

    name = "memories.type-on"
    event = "memory.create"

    def __init__(self, choice: MemoryTypeChoice) -> None:
        self.choice = choice

    def check(self, change: Change[Model]) -> None:
        memory = change.row
        if isinstance(memory, Memory) and not self.choice.on(memory.type, memory.environment_id):
            raise Refusal(f"the memory type {memory.type} is switched off here", "journal memory-type list names the types, and the user switches one on")

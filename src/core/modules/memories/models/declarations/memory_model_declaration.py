from engine.module.model_declaration import ModelDeclaration
from core.modules.memories.commands.remove_memory.remove_memory import RemoveMemory
from core.modules.memories.models.memory import Memory


class MemoryModelDeclaration(ModelDeclaration):
    """How the module declares Memory."""

    model = Memory
    commands = [RemoveMemory]
    excluded_subcommands = ["make", "list"]

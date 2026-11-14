from engine.module.model_declaration import ModelDeclaration
from core.modules.memories.models.memory_mark import MemoryMark


class MemoryMarkModelDeclaration(ModelDeclaration):
    """How the module declares MemoryMark."""

    model = MemoryMark
    excluded_subcommands = ["make", "edit", "delete", "weigh", "skip"]

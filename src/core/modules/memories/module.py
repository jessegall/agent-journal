from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.memories.memory import Memory
from core.modules.memories.memory_giving import MemoryGiving
from core.modules.memories.memory_keyword import MemoryKeyword
from core.modules.memories.memory_mark import MemoryMark
from core.modules.memories.memory_type import MemoryType
from core.modules.memories.memory_type_switch import MemoryTypeSwitch
from core.modules.memories.migrations.m001_memories import MemoriesTables


class MemoriesModule(Module):
    """Adds memories: what the journal gives back to an agent, typed, weighed and fading, with the keywords that
    bring one back and the context marks that ask the agent to weigh them."""

    name = "journal.core.memories"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.drivers"]
    models = [ModelDeclaration(Memory), ModelDeclaration(MemoryType), ModelDeclaration(MemoryTypeSwitch), ModelDeclaration(MemoryKeyword),
              ModelDeclaration(MemoryGiving), ModelDeclaration(MemoryMark)]
    migrations = [MemoriesTables]

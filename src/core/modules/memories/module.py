from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.memories.guards.agent_scope_guard import AgentScopeGuard
from core.modules.memories.guards.keyword_scope import KeywordScope
from core.modules.memories.guards.switches_by_user import SwitchesByUser
from core.modules.memories.guards.type_makers import TypeMakers
from core.modules.memories.guards.type_on import TypeOn
from core.modules.memories.guards.types_by_user import TypesByUser
from core.modules.memories.guards.weight_only_rises import WeightOnlyRises
from core.modules.memories.compaction_fader import CompactionFader
from core.modules.memories.task_memory_remover import TaskMemoryRemover
from core.modules.memories.memory import Memory
from core.modules.memories.memory_fade_handler import MemoryFadeHandler
from core.modules.memories.memory_context_subcommand import MemoryContextSubcommand
from core.modules.memories.memory_faded_subcommand import MemoryFadedSubcommand
from core.modules.memories.memory_make_handler import MemoryMakeHandler
from core.modules.memories.memory_make_subcommand import MemoryMakeSubcommand
from core.modules.memories.memory_read_handler import MemoryReadHandler
from core.modules.memories.memory_remove import MemoryRemove
from core.modules.memories.memory_read_subcommand import MemoryReadSubcommand
from core.modules.memories.memory_weigh_handler import MemoryWeighHandler
from core.modules.memories.memory_weigh_subcommand import MemoryWeighSubcommand
from core.modules.memories.memory_giving import MemoryGiving
from core.modules.memories.memory_in_context import MemoryInContext
from core.modules.memories.memory_keyword import MemoryKeyword
from core.modules.memories.memory_mark import MemoryMark
from core.modules.memories.memory_type import MemoryType
from core.modules.memories.memory_type_switch import MemoryTypeSwitch
from core.modules.memories.memory_word import MemoryWord
from core.modules.memories.migrations.m001_memories import MemoriesTables
from core.modules.memories.standing_memory import StandingMemory


class MemoriesModule(Module):
    """Adds memories: what the journal gives back to an agent, typed, weighed and fading, with the keywords that
    bring one back and the context marks that ask the agent to weigh them."""

    name = "journal.core.memories"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.drivers"]
    models = [ModelDeclaration(Memory, commands=[MemoryRemove], excluded_subcommands=["make"]), ModelDeclaration(MemoryType), ModelDeclaration(MemoryTypeSwitch), ModelDeclaration(MemoryKeyword),
              ModelDeclaration(MemoryGiving), ModelDeclaration(MemoryMark)]
    migrations = [MemoriesTables]
    views = [StandingMemory, MemoryInContext, MemoryWord]
    guards = [TypeMakers, TypeOn, AgentScopeGuard, WeightOnlyRises, TypesByUser, SwitchesByUser, KeywordScope]
    handlers = [MemoryMakeHandler, MemoryWeighHandler, MemoryReadHandler, MemoryFadeHandler]
    listeners = [CompactionFader, TaskMemoryRemover]
    subcommands = [MemoryMakeSubcommand, MemoryWeighSubcommand, MemoryReadSubcommand, MemoryContextSubcommand, MemoryFadedSubcommand]

from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.memories.guards.agent_scope_guard import AgentScopeGuard
from core.modules.memories.guards.keyword_scope import KeywordScope
from core.modules.memories.guards.switch_change_guard import SwitchChangeGuard
from core.modules.memories.guards.type_makers import TypeMakers
from core.modules.memories.guards.type_availability import TypeAvailability
from core.modules.memories.guards.type_change_guard import TypeChangeGuard
from core.modules.memories.guards.agent_weight_guard import AgentWeightGuard
from core.modules.memories.compaction_fader import CompactionFader
from core.modules.memories.task_memory_remover import TaskMemoryRemover
from core.modules.memories.memory import Memory
from core.modules.memories.memory_fade_handler import MemoryFadeHandler
from core.modules.memories.memory_give_handler import MemoryGiveHandler
from core.modules.memories.mark_closer import MarkCloser
from core.modules.memories.memory_mark_open_handler import MemoryMarkOpenHandler
from core.modules.memories.memory_skip_handler import MemorySkipHandler
from core.modules.memories.memory_skip_subcommand import MemorySkipSubcommand
from core.modules.memories.rules.open_mark import OpenMark
from core.modules.memories.weighing import Weighing
from core.modules.memories.rules.start_delivery import StartDelivery
from core.modules.memories.rules.keyword_delivery import KeywordDelivery
from core.modules.memories.rules.due_delivery import DueDelivery
from core.modules.memories.memory_context_subcommand import MemoryContextSubcommand
from core.modules.memories.memory_faded_subcommand import MemoryFadedSubcommand
from core.modules.memories.memory_make_handler import MemoryMakeHandler
from core.modules.memories.memory_make_subcommand import MemoryMakeSubcommand
from core.modules.memories.memory_read_handler import MemoryReadHandler
from core.modules.memories.memory_remove import MemoryRemove
from core.modules.memories.memory_read_subcommand import MemoryReadSubcommand
from core.modules.memories.memory_weigh_handler import MemoryWeighHandler
from core.modules.memories.memory_weigh_subcommand import MemoryWeighSubcommand
from core.modules.memories.memory_delivery import MemoryDelivery
from core.modules.memories.context_memory import ContextMemory
from core.modules.memories.memory_keyword import MemoryKeyword
from core.modules.memories.memory_mark import MemoryMark
from core.modules.memories.memory_type import MemoryType
from core.modules.memories.memory_type_switch import MemoryTypeSwitch
from core.modules.memories.keyword_memory import KeywordMemory
from core.modules.memories.migrations.m001_memories import MemoriesTables
from core.modules.memories.active_memory import ActiveMemory


class MemoriesModule(Module):
    """Adds memories: what the journal gives back to an agent, typed, weighed and fading, with the keywords that
    bring one back and the context marks that ask the agent to weigh them."""

    name = "journal.core.memories"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.settings",
                    "journal.core.drivers"]
    models = [ModelDeclaration(Memory, commands=[MemoryRemove], excluded_subcommands=["make"]), ModelDeclaration(MemoryType), ModelDeclaration(MemoryTypeSwitch), ModelDeclaration(MemoryKeyword),
              ModelDeclaration(MemoryDelivery, excluded_subcommands=["make", "edit", "delete"]),
              ModelDeclaration(MemoryMark, excluded_subcommands=["make", "edit", "delete", "weigh", "skip"])]
    migrations = [MemoriesTables]
    views = [ActiveMemory, ContextMemory, KeywordMemory]
    guards = [TypeMakers, TypeAvailability, AgentScopeGuard, AgentWeightGuard, TypeChangeGuard, SwitchChangeGuard, KeywordScope]
    handlers = [MemoryMakeHandler, MemoryWeighHandler, MemoryReadHandler, MemoryFadeHandler, MemoryGiveHandler, MemoryMarkOpenHandler, MemorySkipHandler]
    driver_rules = [StartDelivery, KeywordDelivery, DueDelivery, OpenMark]
    overlays = [Weighing]
    listeners = [CompactionFader, TaskMemoryRemover, MarkCloser]
    subcommands = [MemoryMakeSubcommand, MemoryWeighSubcommand, MemoryReadSubcommand, MemoryContextSubcommand, MemoryFadedSubcommand, MemorySkipSubcommand]

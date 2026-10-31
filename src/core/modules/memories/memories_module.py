from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.memories.guards.agent_scope_guard import AgentScopeGuard
from core.modules.memories.guards.keyword_scope_guard import KeywordScopeGuard
from core.modules.memories.guards.switch_change_guard import SwitchChangeGuard
from core.modules.memories.guards.type_makers_guard import TypeMakersGuard
from core.modules.memories.guards.type_availability_guard import TypeAvailabilityGuard
from core.modules.memories.guards.type_change_guard import TypeChangeGuard
from core.modules.memories.guards.agent_weight_guard import AgentWeightGuard
from core.modules.memories.listeners.compaction_mark_listener import CompactionMarkListener
from core.modules.memories.listeners.memory_faded_mark_listener import MemoryFadedMarkListener
from core.modules.memories.listeners.memory_given_mark_listener import MemoryGivenMarkListener
from core.modules.memories.listeners.reminder_acknowledged_mark_listener import ReminderAcknowledgedMarkListener
from core.modules.memories.listeners.memory_made_mark_listener import MemoryMadeMarkListener
from core.modules.memories.listeners.memory_removed_mark_listener import MemoryRemovedMarkListener
from core.modules.memories.listeners.memory_weighed_mark_listener import MemoryWeighedMarkListener
from core.modules.memories.listeners.compaction_fader_listener import CompactionFaderListener
from core.modules.memories.listeners.task_memory_remover_listener import TaskMemoryRemoverListener
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.fade_memories_handler import FadeMemoriesHandler
from core.modules.memories.commands.give_memories_handler import GiveMemoriesHandler
from core.modules.memories.listeners.mark_closer_listener import MarkCloserListener
from core.modules.memories.commands.open_memory_mark_handler import OpenMemoryMarkHandler
from core.modules.memories.commands.skip_memory_mark_handler import SkipMemoryMarkHandler
from core.modules.memories.commands.skip_memory_mark_subcommand import SkipMemoryMarkSubcommand
from core.modules.memories.rules.open_mark_rule import OpenMarkRule
from core.modules.memories.overlays.weighing_overlay import WeighingOverlay
from core.modules.memories.rules.start_delivery_rule import StartDeliveryRule
from core.modules.memories.rules.keyword_delivery_rule import KeywordDeliveryRule
from core.modules.memories.rules.due_delivery_rule import DueDeliveryRule
from core.modules.memories.commands.memory_context_subcommand import MemoryContextSubcommand
from core.modules.memories.commands.memory_faded_subcommand import MemoryFadedSubcommand
from core.modules.memories.commands.make_memory_handler import MakeMemoryHandler
from core.modules.memories.commands.make_memory_subcommand import MakeMemorySubcommand
from core.modules.memories.commands.read_memory_handler import ReadMemoryHandler
from core.modules.memories.commands.remove_memory import RemoveMemory
from core.modules.memories.commands.read_memory_subcommand import ReadMemorySubcommand
from core.modules.memories.commands.weigh_memories_handler import WeighMemoriesHandler
from core.modules.memories.commands.weigh_memories_subcommand import WeighMemoriesSubcommand
from core.modules.memories.models.memory_delivery import MemoryDelivery
from core.modules.memories.models.context_memory import ContextMemory
from core.modules.memories.models.memory_keyword import MemoryKeyword
from core.modules.memories.models.memory_mark import MemoryMark
from core.modules.memories.models.memory_type import MemoryType
from core.modules.memories.models.memory_type_switch import MemoryTypeSwitch
from core.modules.memories.models.keyword_memory import KeywordMemory
from core.modules.memories.migrations.m001_memories import MemoriesTablesMigration
from core.modules.memories.models.active_memory import ActiveMemory
from core.modules.memories.support.memory_marks import MEMORY_DOCKS, MEMORY_MARKS


class MemoriesModule(Module):
    """Adds memories: what the journal gives back to an agent, typed, weighed and fading, with the
    keywords that bring one back and the context marks that ask the agent to weigh them."""

    name = "journal.core.memories"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.settings", "journal.core.chat", "journal.core.docking",
                    "journal.core.drivers"]
    models = [ModelDeclaration(Memory, commands=[RemoveMemory], excluded_subcommands=["make"]), ModelDeclaration(MemoryType), ModelDeclaration(MemoryTypeSwitch), ModelDeclaration(MemoryKeyword),
              ModelDeclaration(MemoryDelivery, excluded_subcommands=["make", "edit", "delete"]),
              ModelDeclaration(MemoryMark, excluded_subcommands=["make", "edit", "delete", "weigh", "skip"])]
    migrations = [MemoriesTablesMigration]
    views = [ActiveMemory, ContextMemory, KeywordMemory]
    guards = [TypeMakersGuard, TypeAvailabilityGuard, AgentScopeGuard, AgentWeightGuard, TypeChangeGuard, SwitchChangeGuard, KeywordScopeGuard]
    handlers = [MakeMemoryHandler, WeighMemoriesHandler, ReadMemoryHandler, FadeMemoriesHandler, GiveMemoriesHandler, OpenMemoryMarkHandler, SkipMemoryMarkHandler]
    driver_rules = [StartDeliveryRule, KeywordDeliveryRule, DueDeliveryRule, OpenMarkRule]
    overlays = [WeighingOverlay]
    listeners = [CompactionFaderListener, TaskMemoryRemoverListener, MarkCloserListener, MemoryMadeMarkListener, MemoryWeighedMarkListener,
                 MemoryRemovedMarkListener, MemoryFadedMarkListener, MemoryGivenMarkListener, CompactionMarkListener,
                 ReminderAcknowledgedMarkListener]
    subcommands = [MakeMemorySubcommand, WeighMemoriesSubcommand, ReadMemorySubcommand, MemoryContextSubcommand, MemoryFadedSubcommand, SkipMemoryMarkSubcommand]
    marks = MEMORY_MARKS
    docks = MEMORY_DOCKS

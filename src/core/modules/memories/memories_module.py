from core.modules.memories.states.memory_mark_states import MemoryMarkStates
from core.modules.memories.lines.open_mark_lines import OpenMarkLines
from core.modules.memories.lines.start_delivery_lines import StartDeliveryLines
from core.modules.memories.lines.keyword_delivery_lines import KeywordDeliveryLines
from core.modules.memories.effects.open_mark_effect import OpenMarkEffect
from core.modules.memories.effects.give_memories_effect import GiveMemoriesEffect
from core.modules.memories.windows.extensions.agents_memories_extension import AgentsMemoriesExtension
from core.modules.memories.windows.extensions.helpers_memories_extension import HelpersMemoriesExtension
from core.modules.memories.models.declarations.memory_model_declaration import MemoryModelDeclaration
from core.modules.memories.models.declarations.memory_delivery_model_declaration import MemoryDeliveryModelDeclaration
from core.modules.memories.models.declarations.memory_mark_model_declaration import MemoryMarkModelDeclaration
from core.modules.memories.docks.memories_docks import MEMORIES_DOCKS
from core.modules.memories.skills.declarations.memories_skills import MEMORIES_SKILLS
from core.modules.memories.windows.memories_windows import MEMORIES_WINDOWS
from core.modules.memories.commands.memory_agents.memory_agents_subcommand import MemoryAgentsSubcommand
from core.modules.memories.commands.memory_list.memory_list_subcommand import MemoryListSubcommand
from core.modules.memories.migrations.m009_memory_holder_index import MemoryHolderIndexMigration
from core.modules.memories.models.memory_holder import MemoryHolder
from core.modules.memories.migrations.m007_memory_session import MemorySessionMigration
from core.modules.memories.migrations.m008_memory_removed_index import MemoryRemovedIndexMigration
from core.modules.memories.migrations.m005_memory_scope_index import MemoryScopeIndexMigration
from core.modules.memories.migrations.m006_memory_owner import MemoryOwnerMigration
from core.modules.memories.support.memory_agent_messages import MEMORY_AGENT_MESSAGES
from engine.module.model_declaration import ModelDeclaration
from core.modules.memories.commands.memory_counts.memory_counts_subcommand import MemoryCountsSubcommand
from core.modules.memories.commands.memory_page.memory_page_subcommand import MemoryPageSubcommand
from engine.module.module import Module
from core.modules.memories.guards.agent_scope_guard import AgentScopeGuard
from core.modules.memories.guards.keyword_scope_guard import KeywordScopeGuard
from core.modules.memories.guards.agent_weight_guard import AgentWeightGuard
from core.modules.memories.listeners.compaction_mark_listener import CompactionMarkListener
from core.modules.memories.listeners.memory_faded_mark_listener import MemoryFadedMarkListener
from core.modules.memories.listeners.memory_given_mark_listener import MemoryGivenMarkListener
from core.modules.memories.listeners.start_memories_listener import StartMemoriesListener
from core.modules.memories.listeners.memory_edited_mark_listener import MemoryEditedMarkListener
from core.modules.memories.listeners.memory_made_mark_listener import MemoryMadeMarkListener
from core.modules.memories.listeners.memory_removed_mark_listener import MemoryRemovedMarkListener
from core.modules.memories.listeners.memory_weighed_mark_listener import MemoryWeighedMarkListener
from core.modules.memories.listeners.compaction_fader_listener import CompactionFaderListener
from core.modules.memories.listeners.task_memory_remover_listener import TaskMemoryRemoverListener
from core.modules.memories.upgrade.memories_move import MemoriesMove
from core.modules.memories.commands.fade_memories.fade_memories_handler import FadeMemoriesHandler
from core.modules.memories.commands.give_memories.give_memories_handler import GiveMemoriesHandler
from core.modules.memories.commands.open_memory_mark.open_memory_mark_handler import OpenMemoryMarkHandler
from core.modules.memories.commands.skip_memory_mark.skip_memory_mark_handler import SkipMemoryMarkHandler
from core.modules.memories.commands.skip_memory_mark.skip_memory_mark_subcommand import SkipMemoryMarkSubcommand
from core.modules.memories.commands.memory_context.memory_context_subcommand import MemoryContextSubcommand
from core.modules.memories.commands.memory_faded.memory_faded_subcommand import MemoryFadedSubcommand
from core.modules.memories.commands.make_memory.make_memory_handler import MakeMemoryHandler
from core.modules.memories.commands.make_memory.make_memory_subcommand import MakeMemorySubcommand
from core.modules.memories.commands.read_memory.read_memory_handler import ReadMemoryHandler
from core.modules.memories.commands.read_memory.read_memory_subcommand import ReadMemorySubcommand
from core.modules.memories.commands.weigh_memories.weigh_memories_handler import WeighMemoriesHandler
from core.modules.memories.commands.weigh_memories.weigh_memories_subcommand import WeighMemoriesSubcommand
from core.modules.memories.models.context_memory import ContextMemory
from core.modules.memories.models.memory_keyword import MemoryKeyword
from core.modules.memories.models.keyword_memory import KeywordMemory
from core.modules.memories.migrations.m001_memories import MemoriesTablesMigration
from core.modules.memories.migrations.m002_memory_types_drop_agent_writable import MemoryTypesDropAgentWritableMigration
from core.modules.memories.migrations.m003_remove_faded_memories import RemoveFadedMemoriesMigration
from core.modules.memories.migrations.m004_memory_types_drop_fades import MemoryTypesDropFadesMigration
from core.modules.memories.models.active_memory import ActiveMemory
from core.modules.memories.marks.memory_mark import MemoryMark
from core.modules.memories.marks.memory_reminder_mark import MemoryReminderMark
from core.modules.memories.marks.memory_compaction_mark import MemoryCompactionMark
from core.modules.memories.support.memory_settings import MEMORY_SETTINGS
from core.modules.memories.seeders.memories_seeder import MemoriesSeeder
from core.modules.memories.support.block_conditions.memories_weighed import MemoriesWeighed
from core.modules.memories.inspectors.memory_inspector import MemoryInspector


class MemoriesModule(Module):
    """Adds memories: what the journal gives back to an agent, weighed and fading, with the
    keywords that bring one back and the context marks that ask the agent to weigh them."""

    name = "journal.core.memories"
    agent_messages = MEMORY_AGENT_MESSAGES
    requires_engine = ">=5,<6"
    block_conditions = [MemoriesWeighed]
    settings = MEMORY_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.settings", "journal.core.chat", "journal.core.docking",
                    "journal.core.drivers", "journal.core.documents"]
    skills = MEMORIES_SKILLS
    models = [MemoryModelDeclaration, ModelDeclaration(MemoryKeyword), MemoryDeliveryModelDeclaration, MemoryMarkModelDeclaration]
    migrations = [MemoryHolderIndexMigration, MemoryRemovedIndexMigration, MemorySessionMigration, MemoryOwnerMigration, MemoryScopeIndexMigration, MemoriesTablesMigration, MemoryTypesDropAgentWritableMigration, RemoveFadedMemoriesMigration, MemoryTypesDropFadesMigration]
    moves = [MemoriesMove]
    views = [ActiveMemory, ContextMemory, KeywordMemory, MemoryHolder]
    guards = [AgentScopeGuard, AgentWeightGuard, KeywordScopeGuard]
    handlers = [MakeMemoryHandler, WeighMemoriesHandler, ReadMemoryHandler, FadeMemoriesHandler, GiveMemoriesHandler, OpenMemoryMarkHandler, SkipMemoryMarkHandler]
    states = [MemoryMarkStates]
    lines = [OpenMarkLines, StartDeliveryLines, KeywordDeliveryLines]
    effects = [OpenMarkEffect, GiveMemoriesEffect]
    listeners = [StartMemoriesListener, CompactionFaderListener, TaskMemoryRemoverListener, MemoryMadeMarkListener, MemoryEditedMarkListener, MemoryWeighedMarkListener,
                 MemoryRemovedMarkListener, MemoryFadedMarkListener, MemoryGivenMarkListener, CompactionMarkListener]
    subcommands = [MemoryListSubcommand, MemoryAgentsSubcommand, MemoryCountsSubcommand, MemoryPageSubcommand, MakeMemorySubcommand, WeighMemoriesSubcommand, ReadMemorySubcommand, MemoryContextSubcommand, MemoryFadedSubcommand, SkipMemoryMarkSubcommand]
    marks = [MemoryMark, MemoryReminderMark, MemoryCompactionMark]
    docks = MEMORIES_DOCKS
    windows = MEMORIES_WINDOWS
    window_extensions = [AgentsMemoriesExtension, HelpersMemoriesExtension]
    inspectors = [MemoryInspector]
    seeders = [MemoriesSeeder]

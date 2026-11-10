from core.modules.memories.commands.memory_agents.memory_agents_subcommand import MemoryAgentsSubcommand
from core.modules.memories.commands.memory_list.memory_list_subcommand import MemoryListSubcommand
from core.modules.memories.migrations.m009_memory_holder_index import MemoryHolderIndexMigration
from core.modules.memories.models.memory_holder import MemoryHolder
from core.modules.memories.migrations.m007_memory_session import MemorySessionMigration
from core.modules.memories.migrations.m008_memory_removed_index import MemoryRemovedIndexMigration
from core.modules.memories.migrations.m005_memory_scope_index import MemoryScopeIndexMigration
from core.modules.memories.migrations.m006_memory_owner import MemoryOwnerMigration
from engine.skill.skill_declaration import SkillDeclaration
from core.modules.memories.support.memory_nudges import MEMORY_NUDGES
from engine.module.model_declaration import ModelDeclaration
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_icon import WindowIcon
from engine.viewer.window_loading import WindowLoading
from core.modules.memories.commands.memory_counts.memory_counts_subcommand import MemoryCountsSubcommand
from core.modules.memories.commands.memory_page.memory_page_subcommand import MemoryPageSubcommand
from engine.viewer.window_key import WindowKey
from engine.viewer.key_loading import KeyLoading
from engine.viewer.window_place import WindowPlace
from engine.module.module import Module
from engine.viewer.window_search import WindowSearch
from core.modules.memories.support.memory_searcher import MemorySearcher
from core.modules.memories.guards.agent_scope_guard import AgentScopeGuard
from core.modules.memories.guards.keyword_scope_guard import KeywordScopeGuard
from core.modules.memories.guards.agent_weight_guard import AgentWeightGuard
from core.modules.memories.listeners.compaction_mark_listener import CompactionMarkListener
from core.modules.memories.listeners.memory_faded_mark_listener import MemoryFadedMarkListener
from core.modules.memories.listeners.memory_given_mark_listener import MemoryGivenMarkListener
from core.modules.memories.listeners.start_memories_listener import StartMemoriesListener
from core.modules.memories.listeners.memory_made_mark_listener import MemoryMadeMarkListener
from core.modules.memories.listeners.memory_removed_mark_listener import MemoryRemovedMarkListener
from core.modules.memories.listeners.memory_weighed_mark_listener import MemoryWeighedMarkListener
from core.modules.memories.listeners.compaction_fader_listener import CompactionFaderListener
from core.modules.memories.listeners.task_memory_remover_listener import TaskMemoryRemoverListener
from core.modules.memories.models.memory import Memory
from core.modules.memories.upgrade.memories_move import MemoriesMove
from core.modules.memories.commands.fade_memories.fade_memories_handler import FadeMemoriesHandler
from core.modules.memories.commands.give_memories.give_memories_handler import GiveMemoriesHandler
from core.modules.memories.listeners.mark_closer_listener import MarkCloserListener
from core.modules.memories.commands.open_memory_mark.open_memory_mark_handler import OpenMemoryMarkHandler
from core.modules.memories.commands.skip_memory_mark.skip_memory_mark_handler import SkipMemoryMarkHandler
from core.modules.memories.commands.skip_memory_mark.skip_memory_mark_subcommand import SkipMemoryMarkSubcommand
from core.modules.memories.rules.open_mark_rule import OpenMarkRule
from core.modules.memories.overlays.weighing_overlay import WeighingOverlay
from core.modules.memories.rules.start_delivery_rule import StartDeliveryRule
from core.modules.memories.rules.keyword_delivery_rule import KeywordDeliveryRule
from core.modules.memories.commands.memory_context.memory_context_subcommand import MemoryContextSubcommand
from core.modules.memories.commands.memory_faded.memory_faded_subcommand import MemoryFadedSubcommand
from core.modules.memories.commands.make_memory.make_memory_handler import MakeMemoryHandler
from core.modules.memories.commands.make_memory.make_memory_subcommand import MakeMemorySubcommand
from core.modules.memories.commands.read_memory.read_memory_handler import ReadMemoryHandler
from core.modules.memories.commands.remove_memory.remove_memory import RemoveMemory
from core.modules.memories.commands.read_memory.read_memory_subcommand import ReadMemorySubcommand
from core.modules.memories.commands.weigh_memories.weigh_memories_handler import WeighMemoriesHandler
from core.modules.memories.commands.weigh_memories.weigh_memories_subcommand import WeighMemoriesSubcommand
from core.modules.memories.models.memory_delivery import MemoryDelivery
from core.modules.memories.models.context_memory import ContextMemory
from core.modules.memories.models.memory_keyword import MemoryKeyword
from core.modules.memories.models.memory_mark import MemoryMark
from core.modules.memories.models.keyword_memory import KeywordMemory
from core.modules.memories.migrations.m001_memories import MemoriesTablesMigration
from core.modules.memories.migrations.m002_memory_types_drop_agent_writable import MemoryTypesDropAgentWritableMigration
from core.modules.memories.migrations.m003_remove_faded_memories import RemoveFadedMemoriesMigration
from core.modules.memories.migrations.m004_memory_types_drop_fades import MemoryTypesDropFadesMigration
from core.modules.memories.models.active_memory import ActiveMemory
from core.modules.memories.support.memory_marks import MEMORY_DOCKS, MEMORY_MARKS
from core.modules.memories.support.memory_settings import MEMORY_SETTINGS
from core.modules.memories.seeders.memories_seeder import MemoriesSeeder
from core.modules.memories.support.block_conditions.memories_weighed import MemoriesWeighed
from core.modules.memories.support.skeletons import MEMORIES_MEMORIES_SKELETON
from core.modules.memories.support.memory_inspector import MEMORY_INSPECTOR
from engine.viewer.skeleton_part import SkeletonPart


class MemoriesModule(Module):
    """Adds memories: what the journal gives back to an agent, weighed and fading, with the
    keywords that bring one back and the context marks that ask the agent to weigh them."""

    name = "journal.core.memories"
    nudges = MEMORY_NUDGES
    requires_core = ">=5,<6"
    block_conditions = [MemoriesWeighed]
    settings = MEMORY_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.settings", "journal.core.chat", "journal.core.docking",
                    "journal.core.drivers", "journal.core.documents"]
    skills = [SkillDeclaration("journal-memory", "Keep what matters beyond the context window with weighted memories; read it before the first memory command of a session, or when the context reaches a mark", keywords=("memory", "memories", "remember"), commands=["memory"])]
    models = [ModelDeclaration(Memory, commands=[RemoveMemory], excluded_subcommands=["make", "list"]), ModelDeclaration(MemoryKeyword),
              ModelDeclaration(MemoryDelivery, excluded_subcommands=["make", "edit", "delete"]),
              ModelDeclaration(MemoryMark, excluded_subcommands=["make", "edit", "delete", "weigh", "skip"])]
    migrations = [MemoryHolderIndexMigration, MemoryRemovedIndexMigration, MemorySessionMigration, MemoryOwnerMigration, MemoryScopeIndexMigration, MemoriesTablesMigration, MemoryTypesDropAgentWritableMigration, RemoveFadedMemoriesMigration, MemoryTypesDropFadesMigration]
    moves = [MemoriesMove]
    views = [ActiveMemory, ContextMemory, KeywordMemory, MemoryHolder]
    guards = [AgentScopeGuard, AgentWeightGuard, KeywordScopeGuard]
    handlers = [MakeMemoryHandler, WeighMemoriesHandler, ReadMemoryHandler, FadeMemoriesHandler, GiveMemoriesHandler, OpenMemoryMarkHandler, SkipMemoryMarkHandler]
    driver_rules = [StartDeliveryRule, KeywordDeliveryRule, OpenMarkRule]
    overlays = [WeighingOverlay]
    listeners = [StartMemoriesListener, CompactionFaderListener, TaskMemoryRemoverListener, MarkCloserListener, MemoryMadeMarkListener, MemoryWeighedMarkListener,
                 MemoryRemovedMarkListener, MemoryFadedMarkListener, MemoryGivenMarkListener, CompactionMarkListener]
    subcommands = [MemoryListSubcommand, MemoryAgentsSubcommand, MemoryCountsSubcommand, MemoryPageSubcommand, MakeMemorySubcommand, WeighMemoriesSubcommand, ReadMemorySubcommand, MemoryContextSubcommand, MemoryFadedSubcommand, SkipMemoryMarkSubcommand]
    marks = MEMORY_MARKS
    docks = MEMORY_DOCKS
    windows = [WindowDeclaration("memories.memories", "Memories", "memories.js", WindowLoading.COMPONENT, skeleton=MEMORIES_MEMORIES_SKELETON, search=WindowSearch(MemorySearcher, "Search the memories"), place=WindowPlace.PAGE, group="project", icon=WindowIcon.FILED, reads=["memory list", "memory agents", "memory counts", "memory page", "agent show"], keys=[
        WindowKey("counts", "memory counts", events=["memory.*"]),
        WindowKey("memories", "memory page", arguments=["agent", "environment", "state", "search", "order", "limit"], switches=["main-agent", "other-agents", "removed"], events=["memory.*"], loading=KeyLoading.REQUESTED),
        WindowKey("working", "memory agents", arguments=["environment", "access", "name", "limit"], switches=["working"], events=["agent.*", "memory.*"], loading=KeyLoading.REQUESTED),
        WindowKey("ended", "memory agents", arguments=["environment", "access", "name", "limit"], switches=["ended"], events=["agent.*", "memory.*"], loading=KeyLoading.REQUESTED),
        WindowKey("selected", "agent show {id}", events=["agent.*"], loading=KeyLoading.REQUESTED),
    ], runs=["memory make"], events=["memory.*", "agent.*"]),
               WindowDeclaration("memories.memory-facts", "Keywords", "memory-facts.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.FILED, skeleton=[SkeletonPart.line()],
                                 reads=["memory-keyword list"], runs=["memory-keyword make", "memory-keyword delete"], events=["memory_keyword.*"],
                                 keys=[WindowKey("keywords.*", "memory-keyword list --memory {id}", loading=KeyLoading.REQUESTED)])]
    inspectors = [MEMORY_INSPECTOR]
    seeders = [MemoriesSeeder]

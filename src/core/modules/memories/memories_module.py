from core.modules.memories.declarations.memories_dependencies import MEMORIES_DEPENDENCIES
from core.modules.memories.declarations.memories_models import MEMORIES_MODELS
from core.modules.memories.declarations.memories_migrations import MEMORIES_MIGRATIONS
from core.modules.memories.declarations.memories_handlers import MEMORIES_HANDLERS
from core.modules.memories.declarations.memories_listeners import MEMORIES_LISTENERS
from core.modules.memories.declarations.memories_subcommands import MEMORIES_SUBCOMMANDS
from core.modules.memories.states.memory_mark_states import MemoryMarkStates
from core.modules.memories.lines.open_mark_lines import OpenMarkLines
from core.modules.memories.lines.start_delivery_lines import StartDeliveryLines
from core.modules.memories.lines.keyword_delivery_lines import KeywordDeliveryLines
from core.modules.memories.effects.open_mark_effect import OpenMarkEffect
from core.modules.memories.effects.give_memories_effect import GiveMemoriesEffect
from core.modules.memories.windows.extensions.agents_memories_extension import AgentsMemoriesExtension
from core.modules.memories.windows.extensions.helpers_memories_extension import HelpersMemoriesExtension
from core.modules.memories.docks.memories_docks import MEMORIES_DOCKS
from core.modules.memories.skills.declarations.memories_skills import MEMORIES_SKILLS
from core.modules.memories.windows.memories_windows import MEMORIES_WINDOWS
from core.modules.memories.models.memory_holder import MemoryHolder
from core.modules.memories.support.memory_agent_messages import MEMORY_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.memories.guards.agent_scope_guard import AgentScopeGuard
from core.modules.memories.guards.keyword_scope_guard import KeywordScopeGuard
from core.modules.memories.guards.agent_weight_guard import AgentWeightGuard
from core.modules.memories.upgrade.memories_move import MemoriesMove
from core.modules.memories.models.context_memory import ContextMemory
from core.modules.memories.models.keyword_memory import KeywordMemory
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
    requires_engine = ">=7,<8"
    block_conditions = [MemoriesWeighed]
    settings = MEMORY_SETTINGS
    dependencies = MEMORIES_DEPENDENCIES
    skills = MEMORIES_SKILLS
    models = MEMORIES_MODELS
    migrations = MEMORIES_MIGRATIONS
    moves = [MemoriesMove]
    views = [ActiveMemory, ContextMemory, KeywordMemory, MemoryHolder]
    guards = [AgentScopeGuard, AgentWeightGuard, KeywordScopeGuard]
    handlers = MEMORIES_HANDLERS
    states = [MemoryMarkStates]
    lines = [OpenMarkLines, StartDeliveryLines, KeywordDeliveryLines]
    effects = [OpenMarkEffect, GiveMemoriesEffect]
    listeners = MEMORIES_LISTENERS
    subcommands = MEMORIES_SUBCOMMANDS
    marks = [MemoryMark, MemoryReminderMark, MemoryCompactionMark]
    docks = MEMORIES_DOCKS
    windows = MEMORIES_WINDOWS
    window_extensions = [AgentsMemoriesExtension, HelpersMemoriesExtension]
    inspectors = [MemoryInspector]
    seeders = [MemoriesSeeder]

from core.modules.agents.declarations.agents_models import AGENTS_MODELS
from core.modules.agents.declarations.agents_migrations import AGENTS_MIGRATIONS
from core.modules.agents.declarations.agents_tick_handlers import AGENTS_TICK_HANDLERS
from core.modules.agents.declarations.agents_handlers import AGENTS_HANDLERS
from core.modules.agents.declarations.agents_subcommands import AGENTS_SUBCOMMANDS
from core.modules.agents.declarations.agents_bindings import AGENTS_BINDINGS
from core.modules.agents.declarations.agents_listeners import AGENTS_LISTENERS
from core.modules.agents.effects.unused_launcher_effect import UnusedLauncherEffect
from core.modules.agents.listeners.agent_lifecycle_step_listener import AgentLifecycleStepListener
from core.modules.agents.policies.program_settings_policy import ProgramSettingsPolicy
from core.modules.agents.windows.agents_windows import AGENTS_WINDOWS
from core.modules.agents.guards.agent_chat_guard import AgentChatGuard
from core.modules.agents.guards.agent_name_guard import AgentNameGuard
from core.modules.agents.guards.number_guard import NumberGuard
from core.modules.agents.guards.retired_delete_guard import RetiredDeleteGuard
from core.modules.agents.guards.retired_row_guard import RetiredRowGuard
from core.modules.agents.agent_messages.program_settings_ban_message import ProgramSettingsBanMessage
from core.modules.agents.upgrade.agents_move import AgentsMove
from core.modules.agents.marks.subagent_mark import SubagentMark
from core.modules.agents.marks.agent_menu_mark import AgentMenuMark
from core.modules.agents.marks.agent_launcher_mark import AgentLauncherMark
from core.modules.agents.marks.program_settings_mark import ProgramSettingsMark
from core.modules.agents.inspectors.agent_inspector import AgentInspector
from engine.module.module import Module
from core.modules.agents.agent_messages.agent_start_failed_message import AgentStartFailedMessage
from core.modules.agents.support.report_agent_messages import REPORT_AGENT_MESSAGES
from core.modules.agents.seeders.agents_seeder import AgentsSeeder




class AgentsModule(Module):
    """Adds agents, one per session of an agent program, each an actor with the same number."""

    name = "journal.core.agents"
    effects = [UnusedLauncherEffect]
    policies = [ProgramSettingsPolicy]
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat"]
    models = AGENTS_MODELS
    moves = [AgentsMove]
    migrations = AGENTS_MIGRATIONS
    agent_messages = [AgentStartFailedMessage, *REPORT_AGENT_MESSAGES, ProgramSettingsBanMessage]
    guards = [AgentNameGuard, NumberGuard, RetiredRowGuard, RetiredDeleteGuard, AgentChatGuard]
    tick_handlers = AGENTS_TICK_HANDLERS
    handlers = AGENTS_HANDLERS
    subcommands = AGENTS_SUBCOMMANDS
    bindings = AGENTS_BINDINGS
    windows = AGENTS_WINDOWS
    inspectors = [AgentInspector]
    listeners = AGENTS_LISTENERS
    agent_listeners = [AgentLifecycleStepListener]
    marks = [SubagentMark, AgentMenuMark, AgentLauncherMark, ProgramSettingsMark]
    seeders = [AgentsSeeder]

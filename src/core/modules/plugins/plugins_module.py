from core.modules.plugins.declarations.plugins_dependencies import PLUGINS_DEPENDENCIES
from core.modules.plugins.declarations.plugins_models import PLUGINS_MODELS
from core.modules.plugins.declarations.plugins_migrations import PLUGINS_MIGRATIONS
from core.modules.plugins.declarations.plugins_handlers import PLUGINS_HANDLERS
from core.modules.plugins.declarations.plugins_bindings import PLUGINS_BINDINGS
from core.modules.plugins.declarations.plugins_tick_handlers import PLUGINS_TICK_HANDLERS
from core.modules.plugins.declarations.plugins_listeners import PLUGINS_LISTENERS
from core.modules.plugins.declarations.plugins_subcommands import PLUGINS_SUBCOMMANDS
from core.modules.plugins.policies.plugin_program_policy import PluginProgramPolicy
from core.modules.plugins.policies.plugin_policy import PluginPolicy
from core.modules.plugins.lines.plugin_lines import PluginLines
from core.modules.plugins.effects.plugin_effect import PluginEffect
from core.modules.plugins.windows.plugins_windows import PLUGINS_WINDOWS
from core.modules.plugins.settings.plugins_setting_values import PluginsSettingValues
from core.modules.plugins.skills.declarations.plugins_skills import PLUGINS_SKILLS
from core.modules.plugins.guards.plugin_event_guard import PluginEventGuard
from core.modules.plugins.support.plugin_event_names import PLAIN_EVENTS
from core.modules.plugins.support.plugin_agent_messages import PLUGIN_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.plugins.marks.plugin_health_mark import PluginHealthMark
from core.modules.plugins.marks.plugin_card_mark import PluginCardMark
from core.modules.plugins.upgrade.plugins_move import PluginsMove


class PluginsModule(Module):
    """Adds plugins: programs the user installs into the journal, switches on or off and configures, which
    an agent may only propose."""

    name = "journal.core.plugins"
    effects = [PluginEffect]
    lines = [PluginLines]
    policies = [PluginProgramPolicy, PluginPolicy]
    agent_messages = PLUGIN_AGENT_MESSAGES
    seed_reason = "a plugin is a program the user installs, which a demo has none of"
    requires_engine = ">=5,<6"
    dependencies = PLUGINS_DEPENDENCIES
    skills = PLUGINS_SKILLS
    models = PLUGINS_MODELS
    moves = [PluginsMove]
    windows = PLUGINS_WINDOWS
    migrations = PLUGINS_MIGRATIONS
    handlers = PLUGINS_HANDLERS
    settings = [PluginsSettingValues]
    bindings = PLUGINS_BINDINGS
    declared_plugin_events = [*PLAIN_EVENTS.values(), "tool_starting", "command_starting", "file_edited"]
    marks = [PluginHealthMark, PluginCardMark]
    tick_handlers = PLUGINS_TICK_HANDLERS
    guards = [PluginEventGuard]
    listeners = PLUGINS_LISTENERS
    subcommands = PLUGINS_SUBCOMMANDS

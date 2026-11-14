from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.enums.state_tier import StateTier
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.rules.plugin_rule import PluginRule


class PluginsEnabled(AgentState):
    """A plugin is switched on in the project: the rule that delivers hooks to plugins is asked in its own place only
    then. The oldest enabled plugin opens it, read as the rule reads the plugins, so they share the read."""

    name = "plugins.enabled"
    tier = StateTier.IN_PLACE
    role_group = RoleGroup.PLUGIN
    rules = [PluginRule]

    def __init__(self, plugins: PluginQuery) -> None:
        self.plugins = plugins

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return [OpenRow(Plugin.model_name, plugin.id, plugin.creation_timestamp()) for plugin in self.plugins.enabled_plugins()[:1]]

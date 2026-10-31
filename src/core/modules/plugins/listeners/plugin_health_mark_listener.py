from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.plugins.models.enums.plugin_mark_type import PluginMarkType
from core.modules.plugins.models.enums.plugin_mark_variant import PluginMarkVariant
from core.modules.plugins.models.plugin import Plugin


class PluginHealthMarkListener(MarkListener):
    """When a plugin starts failing the chat says so with its last fault, and says it again in place once the
    plugin answers."""

    name = "plugins.health-mark"
    event = "plugin.update"
    module_name = "journal.core.plugins"

    def handle(self, event: LoggedEvent) -> None:
        if "failing" not in event.data:
            return
        plugin = self.queries.query(Plugin).find(event.row_id)
        if plugin.failing:
            self.show(event, PluginMarkType.HEALTH, PluginMarkVariant.FAILING, f"Plugin {plugin.name} is failing: {plugin.last_fault}", key=f"plugin-health:{plugin.id}")
            return
        self.show(event, PluginMarkType.HEALTH, PluginMarkVariant.HEALTHY, f"Plugin {plugin.name} answers again", key=f"plugin-health:{plugin.id}")

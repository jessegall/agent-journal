from engine.event.logged_event import LoggedEvent
from engine.scope.actor_scope import ActorScope
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.plugins.models.enums.plugin_mark_type import PluginMarkType
from core.modules.plugins.models.enums.plugin_mark_variant import PluginMarkVariant
from core.modules.plugins.models.plugin import Plugin
from engine.event.updated import Updated


class PluginHealthMarkListener(MarkListener[Updated[Plugin]]):
    """When a plugin starts failing the chat says so with its last fault, in a mark left open, and that mark says it
    answers again and ends once the plugin answers."""

    name = "plugins.health-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.core.plugins"

    def handle(self, event: Updated[Plugin], logged: LoggedEvent) -> None:
        if "failing" not in logged.data:
            return
        plugin = event.row
        if plugin.failing:
            self.show(logged, PluginMarkType.HEALTH, PluginMarkVariant.FAILING, f"Plugin {plugin.name} is failing: {plugin.last_fault}", key=f"plugin-health:{plugin.id}", ended=False)
            return
        self.show(logged, PluginMarkType.HEALTH, PluginMarkVariant.HEALTHY, f"Plugin {plugin.name} answers again", key=f"plugin-health:{plugin.id}")

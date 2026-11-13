from engine.event.created import Created
from engine.event.updated import Updated
from engine.command.bus import Bus
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from core.modules.plugins.commands.publish_plugin_readers.publish_plugin_readers import PublishPluginReaders
from core.modules.plugins.models.plugin import Plugin


class PluginReadersListener(SaveListener[Created[Plugin] | Updated[Plugin]]):
    """A plugin that is installed, upgraded or switched on is saved, and its readers follow it as its
    skills do."""

    name = "plugins.sync-readers"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Plugin] | Updated[Plugin], context: Context) -> None:
        self.bus.dispatch(PublishPluginReaders(event.row.name), context)

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.plugins.commands.publish_plugin_readers.publish_plugin_readers import PublishPluginReaders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginReadersBootListener(CommitListener[JournalBooting]):
    """As the journal starts, brings the readers of every plugin that is switched on to the readers it ships."""

    name = "plugins.boot-readers"

    def __init__(self, runnable: RunnablePlugins, bus: Bus) -> None:
        self.runnable, self.bus = runnable, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for runnable in self.runnable.running():
            self.bus.run(PublishPluginReaders(runnable.plugin.name), Actor.core(), cause_id=logged.id)

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.plugins.commands.update_plugin_readers.update_plugin_readers import UpdatePluginReaders


class PluginReadersPublishListener(CommitListener[JournalBooting]):
    """As the journal starts, puts back the readers of every running plugin."""

    name = "plugins.publish-readers"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        self.bus.run(UpdatePluginReaders(), Actor.core(), cause_id=logged.id)

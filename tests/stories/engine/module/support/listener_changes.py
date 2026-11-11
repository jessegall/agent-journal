from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.command.context import Context
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.save_listener import SaveListener
from engine.module.module import Module

PATH = "tests.stories.engine.module.support.listener_changes:ListenerChangesModule"


class OldListener(CommitListener[JournalBooting]):
    name = "listener-changes.old"

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        pass


class RenamedListener(OldListener):
    name = "listener-changes.renamed"


class SavedListener(SaveListener[JournalBooting]):
    name = OldListener.name

    def handle(self, event: JournalBooting, context: Context) -> None:
        pass


class KeptListener(OldListener):
    name = "listener-changes.kept"


class ListenerChangesModule(Module):
    name = "listener-changes"
    requires_core = ">=5,<6"
    listeners = [OldListener, KeptListener]

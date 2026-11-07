from core.base.change.journal_booting import JournalBooting
from core.base.change.logged_event import LoggedEvent
from core.base.command.context import Context
from core.base.listener.commit_listener import CommitListener
from core.base.listener.save_listener import SaveListener
from core.base.module.module import Module

PATH = "tests.stories.core.base.module.support.listener_changes:ListenerChangesModule"


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

from engine.file.file_access import FileAccess
from engine.event.logged_event import LoggedEvent
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener import CommitListener
from core.modules.drivers.support.driver_settings import HOOK_WAIT_SECONDS
from core.modules.settings.models.setting import Setting
from engine.event.changed import Changed
from engine.event.deleted import Deleted


class HookWaitFileListener(CommitListener[Changed[Setting]]):
    """Writes the hook wait a person sets to a file, since the Go hook reads it before it can ask the journal
    anything."""

    name = "drivers.hook-wait-file"

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def handle(self, event: Changed[Setting], logged: LoggedEvent) -> None:
        if event.row.key != HOOK_WAIT_SECONDS:
            return
        if isinstance(event, Deleted):
            self.home.hook_wait_file.unlink(missing_ok=True)
            return
        FileAccess.shared().write(self.home.hook_wait_file, f"{event.row.value}\n")

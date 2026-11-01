from core.base.change.logged_event import LoggedEvent
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.drivers.support.driver_settings import HOOK_WAIT_SECONDS
from core.modules.settings.models.setting import Setting


class HookWaitFileListener(CommitListener):
    """Writes the hook wait a person sets to a file, since the Go hook reads it before it can ask the journal
    anything."""

    name = "drivers.hook-wait-file"
    event = "setting.*"

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def handle(self, event: LoggedEvent) -> None:
        settings = self.queries.query(Setting).filter(key=HOOK_WAIT_SECONDS).newest().page(1, 1).rows
        if settings:
            self.home.hook_wait_file.write_text(f"{settings[0].value}\n")
        else:
            self.home.hook_wait_file.unlink(missing_ok=True)

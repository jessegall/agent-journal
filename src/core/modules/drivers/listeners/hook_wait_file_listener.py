from core.base.change.logged_event import LoggedEvent
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.drivers.support.driver_settings import HOOK_WAIT_SECONDS
from core.modules.settings.models.setting import Setting


class HookWaitFileListener(CommitListener):
    """Writes the hook wait a person sets to a file, since the Go hook reads it before it can ask the journal anything."""

    name = "drivers.hook-wait-file"
    event = "setting.*"

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def handle(self, event: LoggedEvent) -> None:
        setting = self.queries.query(Setting).find(event.row_id)
        if setting.key == HOOK_WAIT_SECONDS:
            self.home.hook_wait_file.write_text(f"{setting.value}\n")

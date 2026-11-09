from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.change.journal_booting import JournalBooting
from core.base.change.logged_event import LoggedEvent
from core.base.change.updated import Updated
from core.base.listener.commit_listener import CommitListener
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.journal_instruction_file import JournalInstructionFile


class JournalInstructionFileListener(CommitListener[JournalBooting | Created[Plugin] | Updated[Plugin] | Deleted[Plugin]]):
    """Writes JOURNAL.md as the journal starts and each time a plugin is installed, switched, upgraded or deleted."""

    name = "plugins.journal-instruction-file"

    def __init__(self, file: JournalInstructionFile) -> None:
        self.file = file

    def handle(self, event: JournalBooting | Created[Plugin] | Updated[Plugin] | Deleted[Plugin], logged: LoggedEvent) -> None:
        if not self.ignores_event(event):
            self.file.write()

    @staticmethod
    def ignores_event(event: JournalBooting | Created[Plugin] | Updated[Plugin] | Deleted[Plugin]) -> bool:
        return isinstance(event, Updated) and event.old_row is not None and event.old_row.enabled == event.row.enabled and event.old_row.files_digest == event.row.files_digest

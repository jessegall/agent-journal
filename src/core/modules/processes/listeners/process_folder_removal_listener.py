from engine.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_row_deleted import ProcessRowDeleted


class ProcessFolderRemovalListener(CommitListener[ProcessRowDeleted]):
    """Removes a deleted process's folder once it is final that the row is gone."""

    name = "processes.process-folder-removal"

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def handle(self, event: ProcessRowDeleted, logged: LoggedEvent) -> None:
        self.folder.remove(logged.row_id)

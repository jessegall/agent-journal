from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_group import ProcessGroup

ORPHAN_MOVE = "orphan"


class OrphanedProcessKillListener(SaveListener):
    """Kills the process group of a run that was marked orphaned, so nothing keeps running unread."""

    name = "processes.orphaned-process-kill"
    event = "process.*"

    def __init__(self, group: ProcessGroup, folder: OutputFolder) -> None:
        self.group, self.folder = group, folder

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if isinstance(process, Process) and change.move is not None and change.move.name == ORPHAN_MOVE:
            self.group.stop(process.pid or self.folder.pid(process.id))

from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_group import ProcessGroup
from core.base.change.changed import Changed
from core.base.command.context import Context

ORPHAN_MOVE = "orphan"


class OrphanedProcessKillListener(SaveListener[Changed[Process]]):
    """Kills the process group of a run that was marked orphaned, so nothing keeps running unread."""

    name = "processes.orphaned-process-kill"

    def __init__(self, group: ProcessGroup, folder: OutputFolder) -> None:
        self.group, self.folder = group, folder

    def handle(self, event: Changed[Process], context: Context) -> None:
        process = event.row
        if isinstance(process, Process) and event.move is not None and event.move.name == ORPHAN_MOVE:
            self.group.stop(process.pid or self.folder.pid(process.id), process.id)

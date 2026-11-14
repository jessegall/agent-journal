from engine.command.command import Command
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.output_folder import OutputFolder


class RunFolderEnds:
    """The commands that end a run from the end its folder holds, for a run whose end the server never heard of."""

    def __init__(self, parts: ProcessPartQuery, folder: OutputFolder) -> None:
        self.parts, self.folder = parts, folder

    def commands(self, process: Process) -> list[Command[object]]:
        code = self.folder.end(process.id)
        if code is None:
            return []
        byte_count, line_count = self.folder.sizes(process.id)
        return [*self.parts_ended(process), EndProcess(process.id, code, byte_count, line_count)]

    def parts_ended(self, process: Process) -> list[Command[object]]:
        rows = self.parts.run_parts(process.id)
        statuses = ((part, self.folder.status(process.id, part.position)) for part in rows if part.ended_at is None)
        return [EndProcessPart(process.id, part.position, status) for part, status in statuses if status is not None]

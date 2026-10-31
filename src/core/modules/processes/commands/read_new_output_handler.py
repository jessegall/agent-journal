from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.read_new_output import ReadNewOutput
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_step import ReaderStep

OPEN = (ProcessState.RUNNING, ProcessState.BACKGROUND)


class ReadNewOutputHandler(Handler[ReadNewOutput, Output]):
    """Keeps the reader's new lines in the output's lines file and what it found in the output's fields and the
    run's progress."""

    command = ReadNewOutput

    def __init__(self, outputs: OutputQuery, processes: ProcessQuery, step: ReaderStep, folder: OutputFolder, repository: Repository) -> None:
        self.outputs, self.processes, self.step, self.folder, self.repository = outputs, processes, step, folder, repository

    def handle(self, command: ReadNewOutput, context: Context) -> Output:
        kept = self.outputs.process(command.process_id).page(1, 1).rows
        if not kept:
            raise Refusal(f"process {command.process_id} keeps no output", "a short run keeps none")
        process = self.processes.find(command.process_id)
        advance = self.step.advance(process, kept[0], command.is_final)
        if advance is None:
            return kept[0]
        if advance.replaces:
            self.folder.replace_reader_lines(process.id, advance.lines)
        else:
            self.folder.append_reader_lines(process.id, advance.lines)
        if advance.progress != process.progress and process.state in OPEN:
            self.repository.save(replace(process, progress=advance.progress), context)
        return self.repository.save(replace(kept[0], read_offset=advance.read_offset, read_lines=advance.read_lines, reader_lines=len(self.folder.reader_lines(process.id)),
                                            reader_summary=advance.summary, progress=advance.progress), context)

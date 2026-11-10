from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.listener.event_rows import EventRows
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_advance import ReaderAdvance
from core.modules.processes.support.reader_step import ReaderStep

OPEN = (ProcessState.RUNNING, ProcessState.BACKGROUND)


class ReadNewOutputHandler(Handler[ReadNewOutput, Output]):
    """Keeps the reader's new lines in the output's lines file and what it found in the output's fields and
    the run's progress."""

    command = ReadNewOutput
    runs_once = True

    def __init__(self, outputs: OutputQuery, rows: EventRows, step: ReaderStep, folder: OutputFolder, repository: Repository) -> None:
        self.outputs, self.rows, self.step, self.folder, self.repository = outputs, rows, step, folder, repository

    def handle(self, command: ReadNewOutput, context: Context) -> Output:
        output = self.output(command)
        process = self.rows.required(Process, command.process_id)
        advance = self.advance(command, process, output)
        if advance is None:
            return output
        if advance.progress != process.progress and process.state in OPEN:
            self.repository.update(process, context, progress=advance.progress)
        if command.prepared is not None:
            count = len(advance.lines) if advance.replaces else len(self.folder.reader_lines(process.id)) + len(advance.lines)
            saved = self.save_output(output, advance, count, context)
            self.write_lines(process.id, advance)
        else:
            self.write_lines(process.id, advance)
            saved = self.save_output(output, advance, len(self.folder.reader_lines(process.id)), context)
        if advance.progress_count_read:
            self.folder.mark_progress_count_read(process.id)
        if advance.test_count and not self.folder.has_progress_count(process.id):
            self.folder.mark_progress_count(process.id)
        return saved

    def write_lines(self, process_id: int, advance: ReaderAdvance) -> None:
        if advance.replaces:
            self.folder.replace_reader_lines(process_id, advance.lines)
            return
        self.folder.append_reader_lines(process_id, advance.lines)

    def save_output(self, output: Output, advance: ReaderAdvance, count: int, context: Context) -> Output:
        return self.repository.update(output, context, read_offset=advance.read_offset, displayed_offset=advance.received_offset, read_lines=advance.read_lines, reader_lines=count,
                                      reader_summary=advance.summary, progress=advance.progress, steps_passed=advance.steps_passed, steps_failed=advance.steps_failed,
                                      test_count=advance.test_count)

    def output(self, command: ReadNewOutput) -> Output:
        if command.prepared is not None:
            return command.prepared.output
        output = self.outputs.process_output(command.process_id)
        if output is None:
            raise Refusal(f"process {command.process_id} keeps no output", "a short run keeps none")
        return output

    def advance(self, command: ReadNewOutput, process: Process, output: Output) -> ReaderAdvance | None:
        if command.prepared is not None and command.prepared.output.displayed_offset == output.displayed_offset:
            return command.prepared.advance
        return self.step.advance(process, output, command.is_final)

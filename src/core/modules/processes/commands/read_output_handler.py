from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.output_lines import OutputLines
from core.modules.processes.commands.read_output import ReadOutput
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_access import OutputAccess
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection

FLAGS = "--summary, --all, --lines, --tail or --reader"
HOW_ENDED = {ProcessState.RUNNING: "is running", ProcessState.BACKGROUND: "is running", ProcessState.STOPPED: "was stopped", ProcessState.LOST: "was lost"}


class ReadOutputHandler(Handler[ReadOutput, OutputLines]):
    """Reads an output in the way asked, one of five, and notes when it was read."""

    command = ReadOutput

    def __init__(self, access: OutputAccess, folder: OutputFolder, outputs: OutputQuery, readers: ReaderQuery, run: ReaderRun, repository: Repository) -> None:
        self.access, self.folder, self.outputs, self.readers, self.run, self.repository = access, folder, outputs, readers, run, repository

    def handle(self, command: ReadOutput, context: Context) -> OutputLines:
        chosen = [flag for flag, given in (("summary", command.summary), ("all", command.all), ("lines", command.lines), ("tail", command.tail), ("reader", command.reader)) if given]
        if len(chosen) != 1:
            raise Refusal(f"output {command.process_id} is read with one of {FLAGS}", f"journal output read {command.process_id} --summary")
        process = self.access.process(context.actor, command.process_id)
        kept = self.outputs.process(process.id).page(1, 1).rows
        if kept and kept[0].state is OutputState.PRUNED:
            return OutputLines((f"output {process.id} was pruned",))
        text = "".join(self.folder.output(process.id, position) for position in range(1, len(self.folder.part_texts(process.id)) + 1))
        lines = tuple(getattr(self, chosen[0])(process, text, command))
        if kept:
            self.repository.save(replace(kept[0], read_at=context.timestamp), context)
        return OutputLines(lines)

    def all(self, process: Process, text: str, command: ReadOutput) -> list[str]:
        return text.splitlines()

    def tail(self, process: Process, text: str, command: ReadOutput) -> list[str]:
        return text.splitlines()[-command.tail:]

    def lines(self, process: Process, text: str, command: ReadOutput) -> list[str]:
        first, _, last = str(command.lines).partition("-")
        if not first.isdigit() or not (last or first).isdigit():
            raise Refusal(f"--lines takes a range such as 2-5, not {command.lines}", f"journal output read {process.id} --lines 2-5")
        start, end = int(first), int(last or first)
        return [f"{number}: {line}" for number, line in enumerate(text.splitlines(), 1) if start <= number <= end]

    def reader(self, process: Process, text: str, command: ReadOutput) -> list[str]:
        found = self.readers.named(command.reader).page(1, 1).rows
        if not found:
            raise Refusal(f"there is no reader {command.reader}", "journal reader list shows them")
        return self.run.lines(found[0], text, process.state.value)

    def summary(self, process: Process, text: str, command: ReadOutput) -> list[str]:
        size = f"{len(text.splitlines())} lines, {len(text)} characters"
        ended = HOW_ENDED.get(process.state, f"{process.state.value} with exit code {process.exit_code}")
        reader = ReaderSelection.of(tuple(self.readers.all_rows()), process)
        lines = self.run.lines(reader, text, process.state.value) if reader is not None else []
        summary = self.run.summary(reader, text) if reader is not None else ""
        return [f"output {process.id} {ended}: {size}", *lines, *([f"summary: {summary}"] if summary else [])]

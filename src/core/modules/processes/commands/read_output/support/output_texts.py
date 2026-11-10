from engine.actor.actor import Actor
from engine.errors.refusal import Refusal
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_access import OutputAccess
from core.modules.processes.support.output_folder import OutputFolder


FLAGS = "--summary, --all, --lines, --tail or --reader"


class OutputTexts:
    """What an output shows in the way asked, one of five: the summary, all of it, a range of its lines, its
    tail or the lines a reader picks; it changes nothing."""

    def __init__(self, access: OutputAccess, folder: OutputFolder, outputs: OutputQuery, readers: ReaderQuery) -> None:
        self.access, self.folder, self.outputs, self.readers = access, folder, outputs, readers

    def lines(self, actor: Actor, command: ReadOutput) -> list[str]:
        read_options = {"summary": command.summary, "all": command.all, "lines": command.lines, "tail": command.tail, "reader": command.reader}
        wanted = [option for option, value in read_options.items() if value]
        if len(wanted) != 1:
            raise Refusal(f"output {command.process_id} is read with one of {FLAGS}", f"journal output read {command.process_id} --summary")
        process = self.access.process(actor, command.process_id)
        kept = self.outputs.process_output(process.id)
        if kept is not None and kept.state is OutputState.PRUNED:
            return [f"output {process.id} was pruned"]
        shown = {"summary": self.summary, "all": self.full_lines, "lines": self.range, "tail": self.tail, "reader": self.reader_lines}
        return shown[wanted[0]](process, command)

    def is_complete(self, process_id: int) -> bool:
        return self.folder.cut_bytes(process_id) == 0

    def full_lines(self, process: Process, command: ReadOutput) -> list[str]:
        return self.folder.all_output(process.id).splitlines()

    def tail(self, process: Process, command: ReadOutput) -> list[str]:
        return self.folder.last_lines(process.id, command.tail)

    def range(self, process: Process, command: ReadOutput) -> list[str]:
        first, _, last = command.lines.partition("-")
        if not first.isdigit() or not (last or first).isdigit():
            raise Refusal(f"--lines takes a range such as 2-5, not {command.lines}", f"journal output read {process.id} --lines 2-5")
        return [f"{number}: {line}" for number, line in self.folder.numbered_lines(process.id, int(first), int(last or first))]

    def reader_lines(self, process: Process, command: ReadOutput) -> list[str]:
        reader = self.readers.with_name(command.reader).first()
        if reader is None:
            raise Refusal(f"there is no reader {command.reader}", "journal reader list shows them")
        kept = self.outputs.process_output(process.id)
        if kept is None or kept.reader_id != reader.id:
            raise Refusal(f"output {process.id} is read by the reader chosen when it started, not by {command.reader}", f"journal output read {process.id} --all")
        return self.folder.reader_lines(process.id)

    def summary(self, process: Process, command: ReadOutput) -> list[str]:
        outcome = process.ending_phrase()
        kept = self.outputs.process_output(process.id)
        bytes_kept, lines_kept = (kept.byte_count, kept.line_count) if kept is not None and kept.ended_at is not None else self.folder.sizes(process.id)
        size = f"{lines_kept} lines, {bytes_kept} bytes"
        lines_read = self.folder.reader_lines(process.id) if kept is not None else []
        digest = kept.reader_summary if kept is not None else ""
        count_error = self.folder.count_error(process.id) if process.state is ProcessState.STOPPED else []
        return [f"output {process.id} {outcome}: {size}", *lines_read, *self.digest_line(digest), *count_error]

    @staticmethod
    def digest_line(digest: str) -> list[str]:
        return [f"summary: {digest}"] if digest else []

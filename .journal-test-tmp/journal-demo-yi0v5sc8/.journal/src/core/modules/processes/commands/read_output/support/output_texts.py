from core.base.actor import Actor
from core.base.refusal import Refusal
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_access import OutputAccess
from core.modules.processes.support.output_folder import OutputFolder


FLAGS = "--summary, --all, --lines, --tail or --reader"
ENDING_PHRASES = {ProcessState.RUNNING: "is running", ProcessState.BACKGROUND: "is running", ProcessState.STOPPED: "was stopped", ProcessState.ORPHANED: "was lost"}


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
        kept = self.outputs.process(process.id).limited(1)
        if kept and kept[0].state is OutputState.PRUNED:
            return [f"output {process.id} was pruned"]
        shown = {"summary": self.summary, "all": self.full_lines, "lines": self.range, "tail": self.tail, "reader": self.reader_lines}
        return shown[wanted[0]](process, command)

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
        matching = self.readers.with_name(command.reader).limited(1)
        if not matching:
            raise Refusal(f"there is no reader {command.reader}", "journal reader list shows them")
        kept = self.outputs.process(process.id).limited(1)
        if not kept or kept[0].reader_id != matching[0].id:
            raise Refusal(f"output {process.id} is read by the reader chosen when it started, not by {command.reader}", f"journal output read {process.id} --all")
        return self.folder.reader_lines(process.id)

    def summary(self, process: Process, command: ReadOutput) -> list[str]:
        outcome = ENDING_PHRASES.get(process.state, f"{process.state.value} with exit code {process.exit_code}")
        if process.expired_at is not None:
            outcome = "timed out"
        kept = self.outputs.process(process.id).limited(1)
        bytes_kept, lines_kept = (kept[0].byte_count, kept[0].line_count) if kept and kept[0].ended_at is not None else self.folder.sizes(process.id)
        size = f"{lines_kept} lines, {bytes_kept} bytes"
        lines_read = self.folder.reader_lines(process.id) if kept else []
        digest = kept[0].reader_summary if kept else ""
        return [f"output {process.id} {outcome}: {size}", *lines_read, *self.digest_line(digest)]

    @staticmethod
    def digest_line(digest: str) -> list[str]:
        return [f"summary: {digest}"] if digest else []

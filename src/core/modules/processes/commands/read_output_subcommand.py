from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.commands.output_lines import OutputLines
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.output import Output as OutputRow
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_access import OutputAccess
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection

FLAGS = "--summary, --all, --lines, --tail or --reader"
HOW_ENDED = {ProcessState.RUNNING: "is running", ProcessState.BACKGROUND: "is running", ProcessState.STOPPED: "was stopped", ProcessState.LOST: "was lost"}


class ReadOutputSubcommand(ReadSubcommand[OutputLines]):
    """`journal output read <n> --summary|--all|--lines A-B|--tail K|--reader <name>`: reads what a run printed, by one of five ways."""

    cli_name = "output"
    name = "read"

    def __init__(self, access: OutputAccess, folder: OutputFolder, outputs: OutputQuery, readers: ReaderQuery, run: ReaderRun) -> None:
        self.access, self.folder, self.outputs, self.readers, self.run = access, folder, outputs, readers, run

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--summary", action="store_true")
        parser.add_argument("--all", action="store_true")
        parser.add_argument("--lines")
        parser.add_argument("--tail", type=int)
        parser.add_argument("--reader")

    def read(self, arguments: Namespace, caller: Caller) -> OutputLines:
        chosen = [flag for flag, given in (("summary", arguments.summary), ("all", arguments.all), ("lines", arguments.lines), ("tail", arguments.tail), ("reader", arguments.reader)) if given]
        if len(chosen) != 1:
            raise Refusal(f"output {arguments.process_id} is read with one of {FLAGS}", f"journal output read {arguments.process_id} --summary")
        process = self.access.process(caller, arguments.process_id)
        kept = self.outputs.process(process.id).page(1, 1).rows
        if kept and kept[0].state is OutputState.PRUNED:
            return OutputLines((f"output {process.id} was pruned",))
        text = "".join(self.folder.output(process.id, position) for position in range(1, len(self.folder.part_texts(process.id)) + 1))
        return OutputLines(tuple(getattr(self, chosen[0])(process, text, arguments)))

    def all(self, process: Process, text: str, arguments: Namespace) -> list[str]:
        return text.splitlines()

    def tail(self, process: Process, text: str, arguments: Namespace) -> list[str]:
        return text.splitlines()[-arguments.tail:]

    def lines(self, process: Process, text: str, arguments: Namespace) -> list[str]:
        first, _, last = str(arguments.lines).partition("-")
        if not first.isdigit() or not (last or first).isdigit():
            raise Refusal(f"--lines takes a range such as 2-5, not {arguments.lines}", f"journal output read {process.id} --lines 2-5")
        start, end = int(first), int(last or first)
        return [f"{number}: {line}" for number, line in enumerate(text.splitlines(), 1) if start <= number <= end]

    def reader(self, process: Process, text: str, arguments: Namespace) -> list[str]:
        found = self.readers.named(arguments.reader).page(1, 1).rows
        if not found:
            raise Refusal(f"there is no reader {arguments.reader}", "journal reader list shows them")
        return self.run.lines(found[0], text, process.state.value)

    def summary(self, process: Process, text: str, arguments: Namespace) -> list[str]:
        size = f"{len(text.splitlines())} lines, {len(text)} characters"
        ended = HOW_ENDED.get(process.state, f"{process.state.value} with exit code {process.exit_code}")
        reader = ReaderSelection.of(tuple(self.readers.all_rows()), process)
        lines = self.run.lines(reader, text, process.state.value) if reader is not None else []
        summary = self.run.summary(reader, text) if reader is not None else ""
        return [f"output {process.id} {ended}: {size}", *lines, *([f"summary: {summary}"] if summary else [])]

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OutputLines):
            output.write("\n".join(value.lines), {"lines": list(value.lines)})

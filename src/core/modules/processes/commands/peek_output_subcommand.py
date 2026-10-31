from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.commands.output_lines import OutputLines
from core.modules.processes.commands.output_lines_writing import OutputLinesWriting
from core.modules.processes.commands.read_output import ReadOutput
from core.modules.processes.commands.output_texts import OutputTexts


class PeekOutputSubcommand(OutputLinesWriting, ReadSubcommand[OutputLines]):
    """`journal output peek <n> --summary|--all|--lines A-B|--tail K|--reader <name>`: shows what a run printed
    as `output read` does, without noting it as read; the windows read it."""

    cli_name = "output"
    name = "peek"

    def __init__(self, texts: OutputTexts) -> None:
        self.texts = texts

    def arguments(self, parser: ArgumentParser) -> None:
        OutputLines.add_flags(parser)

    def read(self, arguments: Namespace, caller: Caller) -> OutputLines:
        return OutputLines(self.texts.lines(caller.actor, ReadOutput(arguments.process_id, arguments.summary, arguments.all, arguments.lines, arguments.tail, arguments.reader)))

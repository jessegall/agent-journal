from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.add_reader import AddReader
from core.modules.processes.models.reader import Reader


class AddReaderSubcommand(Subcommand[AddReader, Reader]):
    """`journal reader add <name> --commands <pattern> --lines <pattern>|--script <path>`: adds a reader of
    outputs, or changes the fields given of the one with that name."""

    cli_name = "reader"
    name = "add"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("reader_name")
        for flag in ("commands", "lines", "script", "progress", "finished", "failed", "summary", "topic", "title"):
            parser.add_argument(f"--{flag}", default="")

    def command(self, arguments: Namespace, caller: Caller) -> AddReader:
        return AddReader(arguments.reader_name, arguments.commands, arguments.lines, arguments.script, arguments.progress, arguments.finished, arguments.failed,
                         arguments.summary, arguments.topic, arguments.title)

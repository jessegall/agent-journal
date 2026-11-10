from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.title_output.title_output import TitleOutput
from core.modules.processes.models.output import Output


class TitleOutputSubcommand(Subcommand[TitleOutput, Output]):
    """`journal output title <n> "<what it does>"`: names what a run does, for its card and its mark."""

    cli_name = "output"
    name = "title"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> TitleOutput:
        return TitleOutput(arguments.process_id, arguments.title)

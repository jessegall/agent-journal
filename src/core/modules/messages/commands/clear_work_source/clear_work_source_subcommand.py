from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.commands.clear_work_source.clear_work_source import ClearWorkSource


class ClearWorkSourceSubcommand(Subcommand[ClearWorkSource, None]):
    """Clears the request used for later work."""

    cli_name = "message"
    name = "clear-work-source"
    help = "Clear the active request. A later single read can select a request again."

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def command(self, arguments: Namespace, caller: Caller) -> ClearWorkSource:
        return ClearWorkSource()

    def write_output(self, value: object, output: Output) -> None:
        output.line("request selection: none (cleared)")

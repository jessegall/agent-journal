from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.commands.manage_program.manage_program import ManageProgram


class ManageProgramSubcommand(Subcommand[ManageProgram, int]):
    """Imports a program's project hooks before launch."""

    cli_name = "program"
    name = "manage"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")
        parser.add_argument("folder")

    def command(self, arguments: Namespace, caller: Caller) -> ManageProgram:
        return ManageProgram(arguments.program, arguments.folder)

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"managed hooks: {value}")

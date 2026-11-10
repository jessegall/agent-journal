from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.remove_instruction_import.remove_instruction_import import RemoveInstructionImport


class RemoveInstructionImportSubcommand(Subcommand[RemoveInstructionImport, str]):
    """`journal instruction-import remove <file> <imported>`: the line a person accepts on the approval card."""

    cli_name = "instruction-import"
    name = "remove"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("file")
        parser.add_argument("imported")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveInstructionImport:
        return RemoveInstructionImport(arguments.file, arguments.imported)

    def write_output(self, value: object, output: Output) -> None:
        output.line(str(value))

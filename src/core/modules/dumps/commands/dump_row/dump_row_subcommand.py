from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.base.command.command import Command
from core.modules.dumps.models.dump import Dump


class DumpRowSubcommand(Subcommand[Command[Dump], Dump]):
    """What `journal dump make` and `name` share: they print the dump's number and its title."""

    cli_name = "dump"

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Dump):
            output.line(f"dump {value.id}: {value.label}")

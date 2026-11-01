from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from tunnels.tunler.commands.update_tunler.update_tunler import UpdateTunler


class UpdateTunlerSubcommand(Subcommand[UpdateTunler, str]):
    """`journal tunler update`: updates the tunler program."""

    cli_name = "tunler"
    name = "update"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> UpdateTunler:
        return UpdateTunler()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, str):
            output.line(value)

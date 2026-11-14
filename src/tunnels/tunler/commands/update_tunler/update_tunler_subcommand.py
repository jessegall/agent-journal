from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from tunnels.tunler.commands.update_tunler.update_tunler import UpdateTunler


class UpdateTunlerSubcommand(Subcommand[UpdateTunler, str]):
    """`journal tunler update`: updates the tunler program."""

    cli_name = "tunler"
    name = "update"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> UpdateTunler:
        return UpdateTunler()

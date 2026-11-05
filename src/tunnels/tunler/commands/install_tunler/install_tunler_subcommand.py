from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from tunnels.tunler.commands.install_tunler.install_tunler import InstallTunler


class InstallTunlerSubcommand(Subcommand[InstallTunler, str]):
    """`journal tunler install <server>`: downloads tunler from a tunler server."""

    cli_name = "tunler"
    name = "install"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("server")

    def command(self, arguments: Namespace, caller: Caller) -> InstallTunler:
        return InstallTunler(arguments.server)

from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from tunnels.tunler.commands.logout_tunler.logout_tunler import LogoutTunler


class LogoutTunlerSubcommand(Subcommand[LogoutTunler, str]):
    """`journal tunler logout`: logs this machine out of tunler."""

    cli_name = "tunler"
    name = "logout"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> LogoutTunler:
        return LogoutTunler()

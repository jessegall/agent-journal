from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from tunnels.tunler.commands.log_out_tunler.log_out_tunler import LogOutTunler


class LogOutTunlerSubcommand(Subcommand[LogOutTunler, str]):
    """`journal tunler logout`: logs this machine out of tunler."""

    cli_name = "tunler"
    name = "logout"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> LogOutTunler:
        return LogOutTunler()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, str):
            output.line(value)

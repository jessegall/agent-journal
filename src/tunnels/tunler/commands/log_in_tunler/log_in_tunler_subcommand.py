from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from tunnels.tunler.commands.log_in_tunler.log_in_tunler import LogInTunler
from tunnels.tunler.support.tunler_login import TunlerLogin


class LogInTunlerSubcommand(Subcommand[LogInTunler, TunlerLogin]):
    """`journal tunler login <host> <username> <password> --master <password>`: the Tunler window's line for a login the user typed."""

    cli_name = "tunler"
    name = "login"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("host")
        parser.add_argument("username")
        parser.add_argument("password")
        parser.add_argument("--master")

    def command(self, arguments: Namespace, caller: Caller) -> LogInTunler:
        return LogInTunler(arguments.host, arguments.username, arguments.password, arguments.master)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TunlerLogin):
            output.write("logged in to tunler" if value.connected else value.error, value.json())

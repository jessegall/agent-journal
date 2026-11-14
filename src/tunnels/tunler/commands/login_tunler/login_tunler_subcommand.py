from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from tunnels.tunler.commands.login_tunler.login_tunler import LoginTunler
from tunnels.tunler.support.tunler_login import TunlerLogin


class LoginTunlerSubcommand(Subcommand[LoginTunler, TunlerLogin]):
    """`journal tunler login <host> <username> <password> --master <password>`: the Tunler window's line for a
    login the user typed."""

    cli_name = "tunler"
    name = "login"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("host")
        parser.add_argument("username")
        parser.add_argument("password")
        parser.add_argument("--master")

    def command(self, arguments: Namespace, caller: Caller) -> LoginTunler:
        return LoginTunler(arguments.host, arguments.username, arguments.password, arguments.master)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TunlerLogin):
            output.write("logged in to tunler" if value.connected else value.error, value.json())

from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.profiles.commands.remove_profile.remove_profile import RemoveProfile


class RemoveProfileSubcommand(Subcommand[RemoveProfile, str]):
    cli_name = "profile"
    name = "remove"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile_name")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveProfile:
        return RemoveProfile(arguments.profile_name)

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"remove profile {value}")

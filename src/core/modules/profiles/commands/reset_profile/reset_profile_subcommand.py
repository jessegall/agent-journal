from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.profiles.commands.reset_profile.reset_profile import ResetProfile


class ResetProfileSubcommand(Subcommand[ResetProfile, str]):
    cli_name = "profile"
    name = "reset"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile_name")

    def command(self, arguments: Namespace, caller: Caller) -> ResetProfile:
        return ResetProfile(arguments.profile_name)

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"reset profile {value}")

from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from core.modules.helpers.commands.start_helper.start_helper import StartHelper


class StartHelperSubcommand(Subcommand[StartHelper, Agent]):
    """`journal helper start <profile> --brief "<job>"`, with a program, a model and a name if wanted."""

    cli_name = "helper"
    name = "start"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile")
        parser.add_argument("--brief", required=True)
        parser.add_argument("--program", default="")
        parser.add_argument("--model", default="")
        parser.add_argument("--name", default="")

    def command(self, arguments: Namespace, caller: Caller) -> StartHelper:
        return StartHelper(arguments.profile, arguments.brief, arguments.program, arguments.model, arguments.name)

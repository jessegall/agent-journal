from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.helpers.commands.start_helper.start_helper import StartHelper


class StartHelperSubcommand(Subcommand[StartHelper, Agent]):
    """`journal helper start <profile> --brief "<job>"`, with a program, a model and a name if wanted."""

    cli_name = "helper"
    name = "start"
    outward = True

    def __init__(self, launcher: LauncherLink) -> None:
        self.launcher = launcher

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile")
        parser.add_argument("--brief", required=True)
        parser.add_argument("--program", default="")
        parser.add_argument("--model", default="")
        parser.add_argument("--name", default="")
        parser.add_argument("--plan", type=int, default=None, help="the plan this helper reviews")
        parser.add_argument("--fresh", default="", metavar="REASON", help="start a new helper though one is idle, and why")

    def command(self, arguments: Namespace, caller: Caller) -> StartHelper:
        return StartHelper(arguments.profile, arguments.brief, arguments.program, arguments.model, arguments.name, arguments.fresh, arguments.plan)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            line = "its report wakes you, so you may stop" if self.launcher.is_running else "keep working and read journal overview: its report arrives at your next hook"
            output.write(f"started agent:{value.id}: {line}", {"id": value.id})

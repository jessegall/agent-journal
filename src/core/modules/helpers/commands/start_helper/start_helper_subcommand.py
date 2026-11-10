from argparse import ArgumentParser, Namespace

from engine.enums.model_tier import ModelTier

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.support.helper_started import HelperStarted
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.helpers.commands.start_helper.start_helper import StartHelper


class StartHelperSubcommand(Subcommand[StartHelper, HelperStarted]):
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
        parser.add_argument("--tier", type=ModelTier.automatic, choices=[ModelTier.FAST, ModelTier.GENERAL, ModelTier.STRONGEST], default=None)
        parser.add_argument("--model", default="")
        parser.add_argument("--name", default="")
        parser.add_argument("--plan", type=int, default=None, help="the plan this helper reviews")
        parser.add_argument("--title", default="", help="a short title for the job, shown in the agent list")
        parser.add_argument("--fresh", default="", metavar="REASON", help="start a new helper though one is idle, and why")

    def command(self, arguments: Namespace, caller: Caller) -> StartHelper:
        return StartHelper(arguments.profile, arguments.brief, arguments.program, arguments.model, arguments.name, arguments.fresh, arguments.plan, arguments.tier, arguments.title)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, HelperStarted):
            line = "its report wakes you, so you may stop" if self.launcher.is_running else "keep working and read journal overview: its report arrives at your next hook"
            note = f", on {value.agent.program}: {value.note}" if value.note else ""
            output.write(f"started agent:{value.agent.number}{note}: {line}", {"id": value.agent.id, "program": value.agent.program, "note": value.note})

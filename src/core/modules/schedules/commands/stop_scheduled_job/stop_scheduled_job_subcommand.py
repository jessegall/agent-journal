from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job import StopScheduledJob
from core.modules.schedules.models.scheduled_job import ScheduledJob


class StopScheduledJobSubcommand(Subcommand[StopScheduledJob, ScheduledJob]):
    """`journal scheduled-job stop <id>`: tells the agent to delete a job it scheduled."""

    cli_name = "scheduled-job"
    name = "stop"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> StopScheduledJob:
        return StopScheduledJob(arguments.row_id)

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)

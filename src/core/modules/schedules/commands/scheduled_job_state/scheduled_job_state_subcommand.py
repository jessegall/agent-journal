from argparse import ArgumentParser, Namespace
from datetime import timedelta

from engine.caller.caller import Caller
from engine.time.clock import Clock
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.schedules.models.scheduled_job import ScheduledJob


RECURRING_LIFETIME_DAYS = 7


class ScheduledJobStateSubcommand(ReadSubcommand[RowList]):
    """`journal scheduled-job running --agent <id>`: the jobs an agent has scheduled that still run; a
    repeating job lapses seven days after it was made."""

    cli_name = "scheduled-job"
    name = "running"

    def __init__(self, queries: Queries, clock: Clock) -> None:
        self.queries, self.clock = queries, clock

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int, required=True)

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        oldest = self.clock.timestamp().value - timedelta(days=RECURRING_LIFETIME_DAYS)
        jobs = self.queries.query(ScheduledJob).filter(session_agent_id=arguments.agent).matching(IsNull("ended_at")).oldest().all_rows()
        return RowList([{"id": job.id, "job_id": job.job_id, "cron": job.cron, "prompt": job.prompt, "is_recurring": job.is_recurring, "stop_requested_at": job.stop_requested_at.text if job.stop_requested_at else None}
                        for job in jobs if not job.is_recurring or job.creation_timestamp().value > oldest])

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RowList):
            output.write("\n".join(f"{row['job_id']} {row['cron']}: {row['prompt']}" for row in value.rows) or "no scheduled jobs", value.json())

from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.plan_event_row import PlanEventRow
from core.modules.plans.support.plan_event import PlanEvent
from core.modules.plans.support.plan_timeline import PlanTimeline

PAGE_EVENT_COUNT = 50


class PlanTimelineSubcommand(ReadSubcommand[PlanTimeline]):
    """`journal plan timeline <n> [--page <p>]`: when each of the plan's tasks was made, logged and ended, newest
    first, fifty events to a page."""

    cli_name = "plan"
    name = "timeline"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> PlanTimeline:
        page = self.queries.query(PlanEventRow).filter(plan_id=arguments.plan_id).descending("time", "event_key").page(arguments.page, PAGE_EVENT_COUNT)
        return PlanTimeline(arguments.plan_id, tuple(PlanEvent(row.time, row.event_type, row.task_id, row.title, row.text) for row in page.rows), page.total)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanTimeline):
            output.write("\n".join(f"{event.time}  {event.event_type}  task {event.task_id}  {event.text}" for event in value.events) or "nothing yet", value.json())

from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.plan_event import PlanEvent
from core.modules.plans.support.plan_timeline import PlanTimeline
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog


class PlanTimelineSubcommand(ReadSubcommand[PlanTimeline]):
    """`journal plan timeline <n>`: when each of the plan's tasks was made, logged and ended, newest first."""

    cli_name = "plan"
    name = "timeline"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanTimeline:
        places = tuple(self.queries.query(PlanTask).filter(plan_id=arguments.plan_id).all_rows())
        tasks = {task.id: task for task in self.queries.query(Task).find_many([place.task_id for place in places])}
        logs = self.queries.query(TaskLog).matching(Among("task_id", tuple(tasks))).all_rows() if tasks else ()
        events = [*(event for task in tasks.values() for event in self.task_events(task)),
                   *(PlanEvent(log.creation_timestamp().text, "logged", log.task_id, tasks[log.task_id].title, log.line) for log in logs)]
        return PlanTimeline(arguments.plan_id, tuple(sorted(events, key=lambda event: event.time, reverse=True)))

    def task_events(self, task: Task) -> list[PlanEvent]:
        made = PlanEvent(task.creation_timestamp().text, "made", task.id, task.title)
        if task.closed_at is None:
            return [made]
        cancelled = task.state is TaskState.CANCELLED
        return [made, PlanEvent(task.closed_at.text, "cancelled" if cancelled else "completed", task.id, task.title, task.reason if cancelled else task.outcome)]

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanTimeline):
            output.write("\n".join(f"{event.time}  {event.event_type}  task {event.task_id}  {event.text}" for event in value.events) or "nothing yet", value.json())

from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.task_place import TaskPlace


class PlanPlaceSubcommand(ReadSubcommand[TaskPlace]):
    """`journal plan place <task>`: the plan and the phase that hold a task, or nothing when it is in no plan.
    """

    cli_name = "plan"
    name = "place"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TaskPlace:
        place = self.queries.query(PlanTask).filter(task_id=arguments.task_id).first()
        if place is None:
            return TaskPlace()
        phases = list(self.queries.query(Phase).filter(plan_id=place.plan_id).ordered("position").all_rows())
        number = next(index for index, phase in enumerate(phases, 1) if phase.id == place.phase_id)
        return TaskPlace(place.plan_id, self.queries.query(Plan).find(place.plan_id).title, number, len(phases), phases[number - 1].title)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskPlace):
            output.write(f"plan {value.plan_id}, phase {value.phase_number} of {value.phase_total}" if value.plan_id else "in no plan", value.json())

from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.plan_outline import OutlinePhase, OutlineTask, PlanOutline
from core.modules.tasks.models.task import Task


class PlanOutlineSubcommand(ReadSubcommand[PlanOutline]):
    """`journal plan outline <plan>`: the plan's phases, each with its tasks, in one answer."""

    cli_name = "plan"
    name = "outline"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanOutline:
        places = tuple(self.queries.query(PlanTask).filter(plan_id=arguments.plan_id).ordered("phase_position", "position").all_rows())
        tasks = {task.id: task for task in self.queries.query(Task).find_many([place.task_id for place in places])}
        phases = tuple(self.queries.query(Phase).filter(plan_id=arguments.plan_id).ordered("position").all_rows())
        return PlanOutline(arguments.plan_id, tuple(OutlinePhase(phase.id, phase.title, phase.goal, tuple(OutlineTask(place.task_id, tasks[place.task_id].title, place.state.value) for place in places if place.phase_id == phase.id))
                                                    for phase in phases))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanOutline):
            output.write("\n".join(f"{phase.title}: {len(phase.tasks)} tasks" for phase in value.phases), value.json())

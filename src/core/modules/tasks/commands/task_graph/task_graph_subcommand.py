from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tasks.commands.task_graph.task_graph import TaskGraph
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.models.task_edge import TaskEdge

UNFINISHED_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED, TaskState.TESTING)


class TaskGraphSubcommand(ReadSubcommand[TaskGraph]):
    """`journal task graph`: what waits on what among the unfinished tasks of this environment."""

    cli_name = "task"
    name = "graph"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> TaskGraph:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the graph is shown for one environment", "name it with --environment")
        tasks = {task.id: task for task in self.queries.query(TaskCard).filter(environment_id=environment_id).matching(Among("state", UNFINISHED_STATES)).all_rows()}
        edges = tuple(edge for edge in self.queries.query(TaskEdge).all_rows() if edge.task_id in tasks and edge.waits_on_id in tasks)
        linked = {task_id for edge in edges for task_id in (edge.task_id, edge.waits_on_id)}
        return TaskGraph(tuple(tasks[task_id] for task_id in sorted(linked)), edges)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskGraph):
            output.write("\n".join(f"{edge.task_id} waits on {edge.waits_on_id}" for edge in value.edges) or "no task waits on another", value.json())

from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tasks.commands.support.task_graph import TaskGraph
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES
from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.models.task_edge import TaskEdge

GRAPH_REASON = "The graph draws every wait between unfinished tasks of one environment, and only the tasks that have one."


class TaskGraphSubcommand(ReadSubcommand[TaskGraph]):
    """`journal task graph`: what waits on what among the unfinished tasks of this environment."""

    cli_name = "task"
    name = "graph"
    environment_refusal = "the graph is shown for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> TaskGraph:
        waits = tuple(self.queries.query(TaskEdge).full_table(GRAPH_REASON).all_rows())
        task_ids = sorted({task_id for edge in waits for task_id in (edge.task_id, edge.blocker_id)})
        tasks = {task.id: task for task in self.queries.query(TaskCard).matching(Among("id", task_ids)).matching(Among("state", UNFINISHED_STATES)).full_table(GRAPH_REASON).all_rows()}
        edges = tuple(edge for edge in waits if edge.task_id in tasks and edge.blocker_id in tasks)
        linked = {task_id for edge in edges for task_id in (edge.task_id, edge.blocker_id)}
        return TaskGraph(tuple(tasks[task_id] for task_id in sorted(linked)), edges)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskGraph):
            output.write("\n".join(f"{edge.task_id} waits on {edge.blocker_id}" for edge in value.edges) or "no task waits on another", value.json())

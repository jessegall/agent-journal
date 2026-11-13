from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.driver.nudger import Nudger
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_EXPECTED

EXPECTED_REASON = "every task that waited on the moved one may be taken now"

EXPECTED_SOURCE = "workers.committed-task-awaited"


class BlockingTaskListener(SaveListener[Moved[Task]]):
    """When a worker commits a task another worker's task waits on, the committing worker is told once that the
    other waits until the task is merged, and how to share it sooner."""

    name = "workers.committed-task-awaited"
    moves = tuple([TaskLifecycle.test])
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, assignments: Assignments, nudger: Nudger, numbers: RowNumbers, rows: EventRows) -> None:
        self.queries, self.assignments, self.nudger, self.numbers, self.rows = queries, assignments, nudger, numbers, rows

    def handle(self, event: Moved[Task], context: Context) -> None:
        waiting_ids = tuple(dependency.task_id for dependency in self.queries.query(OpenDependency).filter(dependency_id=event.row.id).every_row(EXPECTED_REASON))
        if not waiting_ids:
            return
        holder_id = self.assignments.actor(event.row)
        if holder_id is None:
            return
        self.assignments.keep_rows(Task, waiting_ids)
        waiting_tasks = self.rows.required_index(Task, waiting_ids).values()
        waiting_actors = {actor for actor in (self.assignments.actor(task) for task in waiting_tasks) if actor is not None and actor != holder_id}
        for waiting_id in sorted(waiting_actors):
            self.nudger.send(holder_id, WORKER_TASK_EXPECTED, EXPECTED_SOURCE, context, worker=self.numbers.number(AGENT_MODEL_NAME, waiting_id), task=event.row.id)

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
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_AWAITED

AWAITED_SOURCE = "workers.committed-task-awaited"


class AwaitedTaskListener(SaveListener[Moved[Task]]):
    """When a worker commits a task another worker's task waits on, the committing worker is told once that the
    other waits until the task is merged, and how to share it sooner."""

    name = "workers.committed-task-awaited"
    moves = tuple([TaskLifecycle.test])
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, assignments: Assignments, nudger: Nudger, numbers: RowNumbers) -> None:
        self.queries, self.assignments, self.nudger, self.numbers = queries, assignments, nudger, numbers

    def handle(self, event: Moved[Task], context: Context) -> None:
        holder_id = self.assignments.actor(event.row)
        waiting_ids = tuple(dependency.task_id for dependency in self.queries.query(OpenDependency).filter(dependency_id=event.row.id).all_rows())
        if holder_id is None or not waiting_ids:
            return
        self.assignments.keep_rows(Task, waiting_ids)
        waiting_tasks = self.queries.query(Task).matching(Among("id", waiting_ids)).all_rows()
        waiting_actors = {actor for actor in (self.assignments.actor(task) for task in waiting_tasks) if actor is not None and actor != holder_id}
        for waiting_id in sorted(waiting_actors):
            self.nudger.send(holder_id, WORKER_TASK_AWAITED, AWAITED_SOURCE, context, worker=self.numbers.number(AGENT_MODEL_NAME, waiting_id), task=event.row.id)

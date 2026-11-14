import json

from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worker_assignment import WorkerAssignment


class WorkerAssignmentMarkListener(MarkListener[Created[WorkerAssignment]]):
    """Shows the tasks given to a worker in one chat mark."""

    name = "workers.assignment-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Created[WorkerAssignment], logged: LoggedEvent) -> None:
        assignment = event.row
        worker = self.event_rows.required(Agent, assignment.worker_id)
        ids = json.loads(assignment.task_ids)
        rows = self.event_rows.required_index(Task, ids)
        tasks = [rows[task_id] for task_id in ids]
        name = worker.display_name
        given = f"task {tasks[0].id}" if len(tasks) == 1 else f"{len(tasks)} tasks"
        detail = "\n".join(f"Task {task.id}: {task.title}" for task in tasks)
        self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.ASSIGNED, f"{name} was given {given}", None, AGENTS_TABLE, worker.id, detail=detail)

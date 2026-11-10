import json
from collections.abc import Sequence

from engine.command.context import Context
from engine.repository.repository import Repository
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worker_assignment import WorkerAssignment


class WorkerAssignments:
    """Records the tasks given to a worker in one assignment."""

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def record(self, worker_id: int, tasks: Sequence[Task], context: Context) -> None:
        self.repository.save(WorkerAssignment(worker_id=worker_id, creator_id=context.actor.id, task_ids=json.dumps([task.id for task in tasks])), context)

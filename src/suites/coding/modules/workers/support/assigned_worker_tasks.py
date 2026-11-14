from collections.abc import Sequence

from engine.errors.refusal import Refusal
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.assignee_label import AssigneeLabel

UNFINISHED_STATES = (TaskState.OPEN, TaskState.BLOCKED, TaskState.STARTED)


class AssignedWorkerTasks:
    """Refuses to send a task that is assigned to a worker that is not retired, unless that worker is the one it
    is sent to; task assign moves it instead."""

    def __init__(self, assignments: Assignments, labels: AssigneeLabel) -> None:
        self.assignments, self.labels = assignments, labels

    def check(self, tasks: Sequence[Task], receiving_worker_id: int | None = None) -> None:
        assigned = self.assignments.row_actor_ids(Task, [task.id for task in tasks])
        for task in tasks:
            owner_id = next((actor_id for actor_id in assigned[task.id] if actor_id != receiving_worker_id and self.is_working_worker(actor_id)), None)
            if owner_id is not None and task.state in UNFINISHED_STATES:
                raise Refusal(f"task {task.id} is held by {self.labels.text(owner_id)}", f"journal task assign {task.id} --to <worker> moves it")

    def is_working_worker(self, actor_id: int) -> bool:
        agent = self.assignments.agent_row(actor_id)
        return agent is not None and not agent.is_main and agent.retired_at is None

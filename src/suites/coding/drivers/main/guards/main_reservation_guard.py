from core.base.agent_role import AgentRole
from core.base.change.moved import Moved
from core.base.change.updated import Updated
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions


class MainReservationGuard(Guard[Updated[Task] | Moved[Task]]):
    """A main agent that writes no code cannot have a task reserved for it; the task goes to a worker."""

    name = "coding.main-reserves-no-task-without-code"
    moves = tuple([TaskLifecycle.release])

    def __init__(self, rows: EventRows, options: CodingMainOptions) -> None:
        self.rows, self.options = rows, options

    def check(self, event: Updated[Task] | Moved[Task], context: Context) -> None:
        task = event.row
        if task.delegated_to is None or task.delegated_to == event.old_row.delegated_to or task.delegated_to == task.holder_id:
            return
        if self.rows.required(Agent, task.delegated_to).role == AgentRole.MAIN and not self.options.options().writes_code:
            raise Refusal(f"task {task.id} goes to a worker", "the main agent writes no code here; leave it open for a worker")

from engine.enums.agent_role import AgentRole
from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.listener.rows.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.assignments.models.assignment import Assignment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions


class ReservationWithoutCodeGuard(Guard[Created[Assignment]]):
    """A main agent that writes no code cannot be given a task it does not hold; the task goes to a worker."""

    name = "coding.main-reserves-no-task-without-code"

    def __init__(self, rows: EventRows, options: CodingMainOptions) -> None:
        self.rows, self.options = rows, options

    def check(self, event: Created[Assignment], context: Context) -> None:
        assignment = event.row
        if assignment.subject_model != Task.model_name:
            return
        task = self.rows.required(Task, assignment.subject_id)
        if assignment.actor_id == task.holder_id:
            return
        agent = self.rows.find(Agent, assignment.actor_id)
        if agent is None or agent.role != AgentRole.MAIN:
            return
        if not self.options.options().writes_code:
            raise Refusal(f"task {task.id} goes to a worker", "the main agent writes no code here; leave it open for a worker")

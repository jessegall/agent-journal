from core.modules.tasks.queries.task_query import TaskQuery

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.tasks.commands.unassign_agent_tasks.unassign_agent_tasks import UnassignAgentTasks
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits
from core.modules.assignments.support.assignments import Assignments

UNASSIGNED_TASKS_REASON = "Every open or started task of the stopped agent is left without an assignee."


class UnassignAgentTasksHandler(Handler[UnassignAgentTasks, None]):
    """Leaves the open and started tasks assigned to the agent without an assignee; those in testing stay with the
    agent until their work is taken in."""

    command = UnassignAgentTasks

    def __init__(self, queries: Queries, waits: DependencyWaits, assignments: Assignments) -> None:
        self.queries, self.waits, self.assignments = queries, waits, assignments

    def handle(self, command: UnassignAgentTasks, context: Context) -> None:
        tasks = tuple(self.queries.query(Task).matching(TaskQuery.assignee(command.agent_id)).matching(Among("state", (TaskState.OPEN, TaskState.STARTED))).oldest().every_row(UNASSIGNED_TASKS_REASON))
        self.assignments.unassign_rows(tasks, context)
        self.waits.update_tasks([task.id for task in tasks], context)

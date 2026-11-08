from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_assignees import TaskAssignees


class AssignTaskHandler(Handler[AssignTask, Task]):
    """Moves an open or started task to another agent after the suite checks the assignment, and reserves it
    for that agent unless the command asks for no reservation."""

    command = AssignTask

    def __init__(self, queries: Queries, repository: Repository, assignees: TaskAssignees) -> None:
        self.queries, self.repository, self.assignees = queries, repository, assignees

    def handle(self, command: AssignTask, context: Context) -> Task:
        task = self.queries.query(Task).find(command.task_id)
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended", "journal agent list shows who is running")
        self.assignees.check(agent)
        delegated_to = agent.id if command.reserved else None
        if task.state is TaskState.OPEN:
            return self.repository.save(replace(task, delegated_to=delegated_to), context)
        if task.state is not TaskState.STARTED:
            raise Refusal(f"task {task.id} is {task.state.value}: only an open or started task moves")
        if task.holder_id == agent.id:
            raise Refusal(f"task {task.id} is with agent {agent.id}: nothing to move")
        self.assignees.check_reassignment(task)
        return self.repository.save(replace(task.release(context.timestamp, context.actor, f"assigned to agent {agent.id}"), delegated_to=delegated_to), context)

from dataclasses import replace

from core.base.agent_role import AgentRole
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class AssignTaskHandler(Handler[AssignTask, Task]):
    """Moves a task to another agent. A queued task just moves; a started one goes back to open for that
    agent, and a worker that held it goes on with its next task, so a worker's last task goes back with the
    worker."""

    command = AssignTask

    def __init__(self, queries: Queries, tasks: TaskQuery, repository: Repository) -> None:
        self.queries, self.tasks, self.repository = queries, tasks, repository

    def handle(self, command: AssignTask, context: Context) -> Task:
        task = self.queries.query(Task).find(command.task_id)
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended", "journal agent list shows who is running")
        delegated_to = None if agent.role is AgentRole.MAIN else agent.id
        if task.state is TaskState.OPEN:
            return self.repository.save(replace(task, delegated_to=delegated_to), context)
        if task.state is not TaskState.STARTED:
            raise Refusal(f"task {task.id} is {task.state.value}: only an open or started task moves")
        if task.holder_id == agent.id:
            raise Refusal(f"task {task.id} is with agent {agent.id}: nothing to move")
        if task.delegated_to == task.holder_id and task.holder_id is not None and self.tasks.next_delegated(task.holder_id) is None:
            raise Refusal(f"task {task.id} is the last of worker {task.holder_id}", f"journal worker release {task.holder_id} \"<why>\" takes it back")
        return self.repository.save(replace(task.release(context.timestamp, context.actor, f"assigned to agent {agent.id}"), delegated_to=delegated_to), context)

from dataclasses import replace

from core.base.agent_role import AgentRole
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.base.listener.event_rows import EventRows
from core.base.listener.save_listener import SaveListener
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class StartedReservedTaskListener(SaveListener[Moved[Task]]):
    """A main agent that starts a task reserved for it holds it from then on, as it holds any task it starts,
    so the reservation ends."""

    name = "tasks.started-reserved-task"
    moves = tuple([TaskLifecycle.start])
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        if task.delegated_to is None or task.delegated_to != task.holder_id:
            return
        if self.rows.required(Agent, task.delegated_to).role == AgentRole.MAIN:
            self.repository.save(replace(task, move=None, delegated_to=None), context)

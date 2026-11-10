from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.change.moved import Moved
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class ReservedTaskGuard(Guard[Moved[Task]]):
    """A task reserved for a running main agent is started only by that agent or a person."""

    name = "tasks.reserved-task"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        if context.actor.type is not ActorType.AGENT or task.delegated_to is None or task.delegated_to == context.actor.id:
            return
        reserving_agent = self.rows.required(Agent, task.delegated_to)
        if reserving_agent.role == AgentRole.MAIN and reserving_agent.ended_at is None:
            raise Refusal(f"task {task.id} is reserved for agent {reserving_agent.id}", f"journal task assign {task.id} --to <agent> moves it")

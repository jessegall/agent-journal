from core.modules.assignments.support.assignments import Assignments
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.event.moved import Moved
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.agents.support.agent_label import AgentLabel


class ReservedTaskGuard(Guard[Moved[Task]]):
    """A task reserved for a running main agent is started only by that agent or a user."""

    name = "tasks.reserved-task"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def check(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        if context.actor.type is not ActorType.AGENT:
            return
        reserving_agent = self.assignments.agent(task)
        if reserving_agent is None or reserving_agent.id == context.actor.id:
            return
        if reserving_agent.role == AgentRole.MAIN and reserving_agent.ended_at is None:
            raise Refusal(f"task {task.id} is reserved for {AgentLabel.from_agent(reserving_agent).text}", f"journal task assign {task.id} --to <agent> moves it")

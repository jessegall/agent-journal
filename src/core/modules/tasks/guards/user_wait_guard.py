from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.query.queries import Queries
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.tasks.support.task_opener import USER_TARGET
from core.modules.tasks.support.task_waits import TaskWaits
from engine.event.moved import Moved
from engine.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.agents.models.agent import Agent


class UserWaitGuard(Guard[Moved[Task]]):
    """A person or the main agent reviews a task's wait before reopening it."""

    name = "tasks.user-wait"
    moves = tuple([TaskLifecycle.unblock])

    def __init__(self, waits: TaskWaits, queries: Queries) -> None:
        self.waits, self.queries = waits, queries

    def check(self, event: Moved[Task], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        if self.queries.query(Agent).find(context.actor.id).role == AgentRole.MAIN:
            return
        if any(wait.target == USER_TARGET for wait in self.waits.pending_task(event.row.id)):
            raise Refusal(f"task {event.row.id} needs its main agent to review the wait", "its wait reason records what is needed")

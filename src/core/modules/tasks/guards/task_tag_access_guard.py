from engine.enums.access import Access
from engine.enums.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.support.task_creation import TaskCreation
from core.modules.tasks.models.task_tag import TaskTag


class TaskTagAccessGuard(Guard[Changed[TaskTag]]):
    """A read-only agent tags only while making a task."""

    name = "tasks.tag-access"
    is_safety = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Changed[TaskTag], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or isinstance(context.command, TaskCreation):
            return
        agent = self.queries.query(Agent).find(context.actor.id)
        if agent.access == Access.READ:
            raise Refusal("a read-only helper tags only when making a task", "ask the main agent to change existing tags")

from core.base.access import Access
from core.base.actor_type import ActorType
from core.base.change.updated import Updated
from core.base.command.context import Context
from core.base.command.edit_command import EditCommand
from core.base.guard.guard import Guard
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task


class TaskEditAccessGuard(Guard[Updated[Task]]):
    """A read-only agent edits only tasks it created."""

    name = "tasks.edit-access"
    is_safety = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Updated[Task], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or not isinstance(context.command, EditCommand):
            return
        agent = self.queries.query(Agent).find(context.actor.id)
        if agent.access == Access.READ and "complexity" in event.fields:
            raise Refusal("a read-only agent sets complexity only when making a task", "ask the main agent to change the score")
        if agent.access == Access.READ and event.old_row is not None and event.old_row.creator_id != agent.id:
            raise Refusal("a read-only agent edits only tasks it created", "ask the task's creator to edit it")

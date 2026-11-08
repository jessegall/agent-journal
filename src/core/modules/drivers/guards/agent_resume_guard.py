from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.query.queries import Queries
from core.base.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.models.agent import Agent


class AgentResumeGuard(Guard[Changed[Agent]]):
    """A paused agent is resumed by a person: when the agent itself or one of its helpers clears the pause, a person is asked,
    and the command that asked is what Accept runs, marked as approved, so nothing asks again."""

    name = "drivers.person-resumes"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Changed[Agent], context: Context) -> None:
        if isinstance(event, (Created, Deleted)) or context.approval_id is not None:
            return
        if event.old_row.paused_at is None or event.row.paused_at is not None:
            return
        helpers = self.queries.query(Agent).filter(parent_id=event.row.id).all_rows()
        if context.actor.id in (event.row.id, *(helper.id for helper in helpers)):
            raise UserApprovalRefusal(f"Resume the paused agent {event.row.id}?", command=context.command)

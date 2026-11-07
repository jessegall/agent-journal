from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from core.modules.approvals.models.approval_request import ApprovalRequest


class ApprovalDecisionGuard(Guard[Changed[ApprovalRequest]]):
    """Every path that decides an approval request requires a person or a source listener."""

    name = "approvals.person-decides"
    is_safety = True

    def check(self, event: Changed[ApprovalRequest], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or isinstance(event, Created):
            return
        if isinstance(event, Deleted) or event.row.state != event.old_row.state:
            raise Refusal("an agent cannot decide an approval request")

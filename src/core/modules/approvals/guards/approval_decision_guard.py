from engine.enums.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.commands.answer_agent_approval.answer_agent_approval import AnswerAgentApproval


class ApprovalDecisionGuard(Guard[Changed[ApprovalRequest]]):
    """Every path that decides an approval request requires a person or a source listener."""

    name = "approvals.person-decides"
    is_safety = True

    def check(self, event: Changed[ApprovalRequest], context: Context) -> None:
        old_row = event.old_row
        if context.actor.type is not ActorType.AGENT or old_row is None:
            return
        if isinstance(context.command, AnswerAgentApproval) and old_row.recipient_agent_id == context.actor.id:
            return
        if isinstance(event, Deleted) or event.row.state != old_row.state:
            raise Refusal("an agent cannot decide an approval request")

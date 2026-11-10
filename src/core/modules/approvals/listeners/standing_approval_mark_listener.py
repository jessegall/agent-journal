from engine.event.logged_event import LoggedEvent
from engine.event.changed import Changed
from engine.scope.actor_scope import ActorScope
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_mark_type import ApprovalMarkType
from core.modules.approvals.models.enums.approval_mark_variant import ApprovalMarkVariant
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.standing_approval import StandingApproval
from core.modules.chat.listeners.mark_listener import MarkListener


class StandingApprovalMarkListener(MarkListener[Changed[ApprovalRequest]]):
    """When a standing yes accepts a request, the chat keeps a small mark naming that standing yes, with a
    click that opens the request."""

    name = "approvals.standing-mark"
    module_name = "journal.core.approvals"
    disabled_scopes = [ActorScope]

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        if event.old_row is None or request.standing_id is None or request.state is not ApprovalState.ACCEPTED or event.old_row.state is ApprovalState.ACCEPTED:
            return
        standing = self.queries.query(StandingApproval).find(request.standing_id)
        self.show(logged, ApprovalMarkType.STANDING, ApprovalMarkVariant.ACCEPTED_STANDING,
                  f"Standing yes {standing.id} accepted approval {request.id}: {standing.text}",
                  row_model="approval", row_id=request.id, key=f"standing-approval:{request.id}")

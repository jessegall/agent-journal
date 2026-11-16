from engine.event.logged_event import LoggedEvent
from engine.event.changed import Changed
from engine.scope.actor_scope import ActorScope
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_mark_type import ApprovalMarkType
from core.modules.approvals.models.enums.approval_mark_variant import ApprovalMarkVariant
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.saved_approval import SavedApproval
from core.modules.chat.listeners.mark_listener import MarkListener


class SavedApprovalMarkListener(MarkListener[Changed[ApprovalRequest]]):
    """When a saved yes accepts a request, the chat keeps a small mark naming that saved yes, with a
    click that opens the request."""

    name = "approvals.saved-mark"
    module_name = "journal.core.approvals"
    disabled_scopes = [ActorScope]

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        if event.old_row is None or request.saved_approval_id is None or request.state is not ApprovalState.ACCEPTED or event.old_row.state is ApprovalState.ACCEPTED:
            return
        saved = self.queries.query(SavedApproval).find(request.saved_approval_id)
        self.show(logged, ApprovalMarkType.SAVED, ApprovalMarkVariant.ACCEPTED_SAVED,
                  f"Saved yes {saved.id} accepted approval {request.id}: {saved.text}",
                  row_model="approval", row_id=request.id, key=f"saved-approval:{request.id}")

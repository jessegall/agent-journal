from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.approvals.models.enums.approval_state import ApprovalState


class ApprovalLifecycle(Lifecycle):
    states = ApprovalState
    initial = [ApprovalState.OPEN]
    editable = [ApprovalState.OPEN, ApprovalState.RUNNING]
    deletable = [ApprovalState.ACCEPTED, ApprovalState.REFUSED, ApprovalState.CLOSED]

    begin = Move("begin", [ApprovalState.OPEN], ApprovalState.RUNNING)
    accept = Move("accept", [ApprovalState.RUNNING], ApprovalState.ACCEPTED)
    refuse = Move("refuse", [ApprovalState.RUNNING], ApprovalState.REFUSED)
    retry = Move("retry", [ApprovalState.RUNNING], ApprovalState.OPEN)
    close = Move("close", [ApprovalState.OPEN], ApprovalState.CLOSED)

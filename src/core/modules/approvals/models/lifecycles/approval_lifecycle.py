from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from core.modules.approvals.models.enums.approval_state import ApprovalState


class ApprovalLifecycle(Lifecycle):
    states = ApprovalState
    initial = [ApprovalState.OPEN]
    editable = [ApprovalState.OPEN, ApprovalState.RUNNING]
    deletable = [ApprovalState.ACCEPTED, ApprovalState.REFUSED, ApprovalState.CLOSED, ApprovalState.FAILED]

    begin = Move("begin", [ApprovalState.OPEN], ApprovalState.RUNNING)
    accept = Move("accept", [ApprovalState.RUNNING], ApprovalState.ACCEPTED)
    refuse = Move("refuse", [ApprovalState.RUNNING], ApprovalState.REFUSED)
    fail = Move("fail", [ApprovalState.RUNNING], ApprovalState.FAILED)
    retry = Move("retry", [ApprovalState.RUNNING], ApprovalState.OPEN)
    recover = Move("recover", [ApprovalState.RUNNING], ApprovalState.OPEN)
    close = Move("close", [ApprovalState.OPEN], ApprovalState.CLOSED)

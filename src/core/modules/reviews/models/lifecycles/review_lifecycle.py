from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.reviews.models.enums.review_state import ReviewState


class ReviewLifecycle(Lifecycle):
    states = ReviewState
    initial = [ReviewState.QUEUED]
    editable = (ReviewState.QUEUED, ReviewState.REVIEWING)
    deletable = ()

    assign = Move("assign", [ReviewState.QUEUED], ReviewState.REVIEWING)
    approve = Move("approve", [ReviewState.REVIEWING], ReviewState.APPROVED)
    send_back = Move("send_back", [ReviewState.REVIEWING], ReviewState.SENT_BACK)
    leave_undecided = Move("leave_undecided", [ReviewState.REVIEWING], ReviewState.UNDECIDED)
    abandon = Move("abandon", (ReviewState.QUEUED, ReviewState.REVIEWING), ReviewState.ABANDONED)

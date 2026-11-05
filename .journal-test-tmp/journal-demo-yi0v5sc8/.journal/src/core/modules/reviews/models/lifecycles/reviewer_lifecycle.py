from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.reviews.models.enums.reviewer_state import ReviewerState


class ReviewerLifecycle(Lifecycle):
    states = ReviewerState
    initial = [ReviewerState.IDLE]
    editable = (ReviewerState.IDLE, ReviewerState.REVIEWING)
    deletable = ()

    start = Move("start", [ReviewerState.IDLE], ReviewerState.REVIEWING)
    finish = Move("finish", [ReviewerState.REVIEWING], ReviewerState.IDLE)
    end = Move("end", (ReviewerState.IDLE, ReviewerState.REVIEWING), ReviewerState.ENDED)
    retire = Move("retire", [ReviewerState.IDLE], ReviewerState.RETIRED)

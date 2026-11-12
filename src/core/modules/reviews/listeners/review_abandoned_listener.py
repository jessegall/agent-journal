from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from core.modules.assignments.support.assignments import Assignments
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle
from core.modules.reviews.models.review import Review


class ReviewAbandonedListener(SaveListener[Moved[Review]]):
    """An abandoned review is nobody's to review any more, also when its reviewer ended: it loses its
    assignment."""

    name = "reviews.review-abandoned"
    moves = tuple([ReviewLifecycle.abandon])

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def handle(self, event: Moved[Review], context: Context) -> None:
        self.assignments.unassign(event.row, context)

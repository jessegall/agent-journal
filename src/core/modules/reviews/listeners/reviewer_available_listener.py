from engine.change.created import Created
from engine.change.moved import Moved
from engine.command.context import Context
from engine.command.bus import Bus
from engine.listener.save_listener import SaveListener
from core.modules.reviews.commands.assign_next_review.assign_next_review import AssignNextReview
from core.modules.reviews.models.lifecycles.reviewer_lifecycle import ReviewerLifecycle
from core.modules.reviews.models.reviewer import Reviewer


class ReviewerAvailableListener(SaveListener[Created[Reviewer] | Moved[Reviewer]]):
    """A reviewer that is made or finishes its review starts the oldest queued review at once."""

    name = "reviews.reviewer-available"
    moves = tuple([ReviewerLifecycle.finish])

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Reviewer] | Moved[Reviewer], context: Context) -> None:
        self.bus.dispatch(AssignNextReview(), context)

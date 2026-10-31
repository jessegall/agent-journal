from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.reviews.commands.assign_next_review import AssignNextReview
from core.modules.reviews.models.reviewer import Reviewer

IDLE_EVENTS = ("reviewer.create", "reviewer.finish")


class ReviewerAvailableListener(SaveListener):
    """A reviewer that is made or finishes its review starts the oldest queued review at once."""

    name = "reviews.reviewer-available"
    event = "reviewer.*"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, change: Change[Model]) -> None:
        reviewer = change.row
        if isinstance(reviewer, Reviewer) and change.event in IDLE_EVENTS:
            self.bus.dispatch(AssignNextReview(reviewer.environment_id), change.context)

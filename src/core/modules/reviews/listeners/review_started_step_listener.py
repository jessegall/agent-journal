from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.reviews.commands.make_review_step import MakeReviewStep
from core.modules.reviews.listeners.reviewer_ended_listener import MODULE_NAME
from core.modules.reviews.models.review import Review


class ReviewStartedStepListener(CommitListener):
    """When a reviewer starts a review, its steps start with a line saying so."""

    name = "reviews.review-started-step"
    event = "review.assign"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: LoggedEvent) -> None:
        review = self.queries.query(Review).find(event.row_id)
        self.bus.run(MakeReviewStep(review.id, f"Started reviewing {review.subject_model} {review.subject_id}"), self.actors.actor(MODULE_NAME),
                     cause_id=event.id, environment_id=event.environment_id)

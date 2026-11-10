from core.base.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.reviews.commands.make_review_step.make_review_step import MakeReviewStep
from core.modules.reviews.listeners.reviewer_ended_listener import MODULE_NAME
from core.modules.reviews.models.review import Review
from core.base.change.moved import Moved
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle


class ReviewStartedStepListener(CommitListener[Moved[Review]]):
    """When a reviewer starts a review, its steps start with a line saying so."""

    name = "reviews.review-started-step"
    moves = tuple([ReviewLifecycle.assign])

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: Moved[Review], logged: LoggedEvent) -> None:
        review = event.row
        self.bus.run(MakeReviewStep(review.id, f"Started reviewing {review.subject_model} {review.subject_id}"), self.actors.actor(MODULE_NAME),
                     cause_id=logged.id)

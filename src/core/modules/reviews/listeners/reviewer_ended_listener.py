from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.modules.reviews.commands.abandon_review import AbandonReview
from core.modules.reviews.commands.end_reviewer import EndReviewer
from core.modules.reviews.queries.review_query import ReviewQuery
from core.modules.reviews.queries.reviewer_query import ReviewerQuery

MODULE_NAME = "journal.core.reviews"


class ReviewerEndedListener(CommitListener):
    """When the session of a reviewer ends, the reviewer ends and a review it was still reviewing is abandoned, which gives the work back to the agent that asked."""

    name = "reviews.reviewer-ended"
    event = "agent.update"

    def __init__(self, bus: Bus, actors: ModuleActors, reviewers: ReviewerQuery, reviews: ReviewQuery) -> None:
        self.bus, self.actors, self.reviewers, self.reviews = bus, actors, reviewers, reviews

    def handle(self, event: LoggedEvent) -> None:
        ended = event.data.get("ended_at")
        if ended is None or ended[1] is None or not self.reviewers.filter(id=event.row_id).out().exists():
            return
        actor = self.actors.actor(MODULE_NAME)
        for review in tuple(self.reviews.of_reviewer(event.row_id).reviewing().all_rows()):
            self.bus.run(AbandonReview(review.id), actor, cause_id=event.id, environment_id=event.environment_id)
        self.bus.run(EndReviewer(event.row_id), actor, cause_id=event.id, environment_id=event.environment_id)

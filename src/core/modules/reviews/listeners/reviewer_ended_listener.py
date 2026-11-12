from core.modules.agents.events.agent_ended import AgentEnded
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from core.modules.reviews.commands.abandon_review.abandon_review import AbandonReview
from core.modules.reviews.commands.end_reviewer.end_reviewer import EndReviewer
from core.modules.reviews.queries.review_query import ReviewQuery
from core.modules.reviews.queries.reviewer_query import ReviewerQuery

ABANDONED_REASON = "an ended reviewer abandons every review it was working on"

MODULE_NAME = "journal.core.reviews"


class ReviewerEndedListener(CommitListener[AgentEnded]):
    """When the session of a reviewer ends, the reviewer ends and a review it was still reviewing is
    abandoned, which gives the work back to the agent that asked."""

    name = "reviews.reviewer-ended"

    def __init__(self, bus: Bus, actors: ModuleActors, reviewers: ReviewerQuery, reviews: ReviewQuery) -> None:
        self.bus, self.actors, self.reviewers, self.reviews = bus, actors, reviewers, reviews

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        reviewer_id = event.row.id
        if not self.reviewers.filter(id=reviewer_id).active().exists():
            return
        actor = self.actors.actor(MODULE_NAME)
        for review in tuple(self.reviews.reviewer(reviewer_id).reviewing().every_row(ABANDONED_REASON)):
            self.bus.run(AbandonReview(review.id), actor, cause_id=logged.id)
        self.bus.run(EndReviewer(reviewer_id), actor, cause_id=logged.id)

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.reviews.commands.retire_reviewer.retire_reviewer import RetireReviewer
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.queries.reviewer_query import ReviewerQuery


class RetireReviewerHandler(Handler[RetireReviewer, Reviewer]):
    """Retires the newest idle reviewer, then ends its agent session."""

    command = RetireReviewer

    def __init__(self, reviewers: ReviewerQuery, bus: Bus, repository: Repository) -> None:
        self.reviewers, self.bus, self.repository = reviewers, bus, repository

    def handle(self, command: RetireReviewer, context: Context) -> Reviewer:
        if context.environment_id is None:
            raise Refusal("a reviewer is retired in an environment", "name one with --environment")
        idle = self.reviewers.idle().newest().first()
        if idle is None:
            raise Refusal("no reviewer is idle", "a reviewer is retired once it has finished its review; journal reviewer list shows them")
        retired = self.repository.save(idle.retire(context.timestamp, context.actor), context)
        self.bus.dispatch(EndAgent(retired.id), context)
        return retired

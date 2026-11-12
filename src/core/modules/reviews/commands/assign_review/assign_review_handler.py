from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.assignments.support.assignments import Assignments
from core.modules.reviews.commands.assign_review.assign_review import AssignReview
from core.modules.reviews.models.review import Review


class AssignReviewHandler(Handler[AssignReview, Review]):
    """Moves a queued review to reviewing and gives it to its reviewer, whose assignment is the review's one
    record of who reviews it."""

    command = AssignReview

    def __init__(self, queries: Queries, repository: Repository, assignments: Assignments) -> None:
        self.queries, self.repository, self.assignments = queries, repository, assignments

    def handle(self, command: AssignReview, context: Context) -> Review:
        review = self.queries.query(Review).find(command.row_id)
        moved = self.repository.save_change(review, review.assign(context.timestamp, context.actor), context)
        self.assignments.assign(moved, command.reviewer_id, context, cascade=False)
        return moved

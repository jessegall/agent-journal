from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.reviews.commands.record_review import RecordReview
from core.modules.reviews.models.enums.point_verdict import PointVerdict
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.reviews.models.review import Review
from core.modules.reviews.models.review_point import ReviewPoint
from core.modules.reviews.queries.review_query import ReviewQuery
from core.modules.reviews.support.review_report import ReviewReport


class RecordReviewHandler(Handler[RecordReview, Review]):
    """Reads a reviewer's report, moves the review it answers to approved, sent back or undecided, and saves the points the report names."""

    command = RecordReview

    def __init__(self, reviews: ReviewQuery, repository: Repository) -> None:
        self.reviews, self.repository = reviews, repository

    def handle(self, command: RecordReview, context: Context) -> Review:
        review = self.answered(command, context)
        if review.state != ReviewState.REVIEWING:
            raise Refusal(f"review {review.id} is already {review.state.replace('_', ' ')}", "a review takes one report; ask the agent that requested it for a new review")
        report = ReviewReport(command.report)
        moved = self.repository.save(self.moved(review, report, context), context)
        named = {point.number: point for point in reversed(report.points()) if point.number <= review.point_count}
        for number in sorted(named):
            point = named[number]
            self.repository.save(ReviewPoint(review_id=review.id, creator_id=context.actor.id, number=number, verdict=point.verdict, reason=point.reason), context)
        return moved

    def answered(self, command: RecordReview, context: Context) -> Review:
        if command.review_id is not None:
            return self.reviews.find(command.review_id)
        own = self.reviews.filter(reviewer_id=context.actor.id).newest().page(1, 1).rows
        if own:
            return own[0]
        reviewing = self.reviews.filter(environment_id=context.environment_id, state=ReviewState.REVIEWING).oldest().page(1, 1).rows
        if reviewing:
            return reviewing[0]
        raise Refusal("no review is waiting for a report", "a reviewer reports on the review it was given")

    def moved(self, review: Review, report: ReviewReport, context: Context) -> Review:
        if report.judged(PointVerdict.SHORT):
            return review.send_back(context.timestamp, context.actor, report.text)
        if report.is_approved(review.point_count):
            return review.approve(context.timestamp, context.actor, report.text)
        return review.leave_undecided(context.timestamp, context.actor, report.text)

from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.reviews.models.review import Review
from core.modules.reviews.queries.review_query import ReviewQuery


class OneOpenReviewPerSubjectGuard(Guard):
    """Refuses a review of a row that already has an unfinished review."""

    name = "reviews.one-open-review-per-subject"
    event = "review.create"

    def __init__(self, reviews: ReviewQuery) -> None:
        self.reviews = reviews

    def check(self, change: Change[Model]) -> None:
        review = change.row
        if not isinstance(review, Review):
            return
        open_review = next(self.reviews.subject(review.subject_model, review.subject_id).unfinished().oldest().all_rows(1), None)
        if open_review:
            raise Refusal(f"{review.subject_model} {review.subject_id} already has an unfinished review, review {open_review.id}",
                          f"wait for review {open_review.id} to be reported, or end it with journal review abandon {open_review.id}")

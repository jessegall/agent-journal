from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.plans.models.checkpoint_review import CheckpointReview


class CheckpointReviewReportListener(SaveListener[Changed[HelperJob]]):
    """The job of a checkpoint's reviewer ends with its report: the report is saved on the checkpoint's review."""

    name = "plans.checkpoint-review-report"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Changed[HelperJob], context: Context) -> None:
        job = event.row
        if job.ended_at is None or job.helper_id is None:
            return
        review = self.queries.query(CheckpointReview).filter(reviewer_id=job.helper_id).first()
        if review is not None:
            self.repository.save(review.reported(job.returned), context)

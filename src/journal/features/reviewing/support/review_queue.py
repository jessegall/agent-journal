import time

from journal.features.reviewing.support.review_brief import ReviewBrief
from journal.features.reviewing.support.review_steps import ReviewSteps
from journal.features.reviewing.support.reviewer_dispatch import ReviewerDispatch
from journal.features.workers.support.worker_reports import WorkerReports
from journal.features.workers.workers_options import WorkersOptions
from journal.models.reviewer import Reviewer
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.repositories.reviewers import Reviewers
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.time_source import TimeSource


class ReviewQueue:
    """The reviews waiting for a reviewer, in the order their workers clocked out, handed out by the journal and never the agent: each idle reviewer takes the next, a queue with no reviewer at all gets its first, and with the journal dispatching the next tasks a queue longer than the idle reviewers gets more, up to the most out; a reviewer that cannot be sent hands its worker's work back to the agent at once."""

    def __init__(self, workers: Workers, reviewers: Reviewers, tasks: Tasks, reports: WorkerReports, brief: ReviewBrief, dispatch: ReviewerDispatch, steps: ReviewSteps, settings: SettingRows, time_source: TimeSource) -> None:
        self.time_source, self.settings = time_source, settings
        self.workers, self.reviewers, self.tasks, self.reports = workers, reviewers, tasks, reports
        self.brief, self.dispatch, self.steps = brief, dispatch, steps

    def assigned(self, environment_id: int) -> None:
        for worker, reviewer in zip(self.workers.queued_reviews(), self.free_reviewers(environment_id)):
            self.assign_review(worker, reviewer)

    def free_reviewers(self, environment_id: int) -> list[Reviewer]:
        waiting = len(self.workers.queued_reviews())
        if not waiting:
            return self.reviewers.idle()
        if not self.reviewers.active():
            return [self.dispatch.added(environment_id)]
        idle = self.reviewers.idle()
        return [*idle, *(self.dispatch.added(environment_id) for _ in range(self.added_count(waiting - len(idle))))]

    def added_count(self, unserved: int) -> int:
        if not self.settings.option(WorkersOptions.AUTO_DISPATCH):
            return 0
        return max(0, min(unserved, self.settings.integer(WorkersOptions.REVIEWER_LIMIT) - len(self.reviewers.active())))

    def assign_review(self, worker: Worker, reviewer: Reviewer) -> None:
        task = self.tasks.find(self.tasks.holder_task_ids(Ref.build(worker))[0])
        claimed = self.workers.save(worker.review_claimed(), Actor.system())
        try:
            reviewing = self.dispatch.sent(reviewer, claimed, self.brief.text(claimed, task, self.reports.last(claimed)))
        except Exception:
            self.workers.save(self.workers.find(claimed.id).review_failed(self.time_source.seconds(), task.id), Actor.system())
            raise
        self.steps.started(reviewing, claimed.mention())

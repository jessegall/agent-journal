from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.ticked import Ticked
from journal.events.feature_data import FeatureData
from journal.events.rows.worker_review_failed import WorkerReviewFailed
from journal.events.rows.worker_review_undecided import WorkerReviewUndecided
from journal.engine.nudge import Nudge
from journal.features.reviewing.reviewing_nudges import ReviewingNudges
from journal.features.reviewing.reviewing_part import ReviewingPart
from journal.features.workers.support.worker_news import WorkerNews


class ReviewingConduct(Conduct):
    """The reviewing feature's conduct toward the agent that sent a worker, in every state: a reviewer's report that leaves a point undecided is informed with each point, unless the orchestrator's worker news gathers it, since only then is the work the agent's to decide, a reviewer that ended without one hands the work back for the agent's own check, and at a stop and on the tick the reviews waiting for a reviewer are named, so the agent can add one."""

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        return self.none(*waiting_lines(event.data))

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return self.none(*waiting_lines(event.data))

    def on_worker_review_undecided(self, event: WorkerReviewUndecided, settings: Settings) -> Transition:
        if event.worker.is_other_dispatcher(event.session) or WorkerNews.is_gathered(settings):
            return self.none()
        return self.none(ReviewingNudges.REVIEW_UNDECIDED.create(reviewer=event.reviewer, n=event.worker.id, task=event.task, report=event.report))

    def on_worker_review_failed(self, event: WorkerReviewFailed, settings: Settings) -> Transition:
        if event.worker.is_other_dispatcher(event.session) or WorkerNews.is_gathered(settings):
            return self.none()
        return self.none(ReviewingNudges.REVIEW_FAILED.create(n=event.worker.id, task=event.task))


def waiting_lines(data: FeatureData) -> tuple[Nudge, ...]:
    reviewing = data.part(ReviewingPart)
    return (ReviewingNudges.REVIEWS_WAITING.create(waiting=reviewing.waiting_reviews, reviewers=reviewing.reviewers),) if reviewing.waiting_reviews else ()

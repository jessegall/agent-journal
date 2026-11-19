from journal.engine.job import Job
from journal.features.reviewing.support.review_routing import ReviewRouting
from journal.models.worker import DELIVERY_MOVE
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.repositories.workers import Workers
from journal.support.actor import Actor

# how long clocked-out work waits on the agent before the journal hands it to its reviewer
WAITING_SECONDS = 600
QUEUED_NOTE = "the journal queued this work for review: it clocked out without one and waited on the agent"


class ReviewBacklog(Job):
    """Every minute, with the review routing on, work that clocked out with no review and has waited on the agent ten minutes
    or more joins the review queue, so a reviewer checks it and the agent only decides: work that clocked out while the
    routing was off, or before a restart, otherwise waits until the agent gets to it, and on the hosted journal 17 workers
    waited 7 to 17 hours that way, their tasks held (19 Nov). Work a reviewer already reported on is left to the agent."""

    interval_seconds = 60.0

    def __init__(self, environments: Environments, scope: Scope, routing: ReviewRouting, workers: Workers) -> None:
        self.environments, self.scope, self.routing, self.workers = environments, scope, routing, workers

    def tick(self, time: float) -> None:
        for environment in self.environments.rows():
            with self.scope.environment(environment.row_id):
                if self.routing.is_enabled():
                    self.queued(time)

    def queued(self, time: float) -> None:
        for worker in self.workers.unreviewed_deliveries():
            steps = worker.moves.steps
            if steps and steps[-1][0] == DELIVERY_MOVE and time - worker.delivery_time() >= WAITING_SECONDS:
                self.workers.save(worker.review_requested(time, QUEUED_NOTE), Actor.system())

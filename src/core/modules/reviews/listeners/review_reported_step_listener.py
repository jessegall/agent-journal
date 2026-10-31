from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.reviews.commands.make_review_step import MakeReviewStep
from core.modules.reviews.listeners.reviewer_ended_listener import MODULE_NAME
from core.modules.reviews.models.enums.point_finding import PointFinding
from core.modules.reviews.models.enums.step_outcome import StepOutcome
from core.modules.reviews.models.review_point import ReviewPoint

REPORTING_EVENTS = ("review.approve", "review.reject", "review.leave_undecided")
OUTCOMES = {PointFinding.PASSED: StepOutcome.PASSED, PointFinding.SHORT: StepOutcome.FAILED, PointFinding.UNDECIDED: StepOutcome.NONE}
HANDOFF = "Handed the report to the agent that asked"


class ReviewReportedStepListener(CommitListener):
    """When a reviewer reports, its steps show one line per point, then a line handing the report to the agent
    that asked."""

    name = "reviews.review-reported-step"
    event = "review.*"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in REPORTING_EVENTS:
            return
        actor = self.actors.actor(MODULE_NAME)
        for point in tuple(self.queries.query(ReviewPoint).filter(review_id=event.row_id).ordered("number").all_rows()):
            reason = f": {point.reason}" if point.reason else ""
            self.bus.run(MakeReviewStep(event.row_id, f"{point.number} {point.finding}{reason}", OUTCOMES[point.finding]), actor, cause_id=event.id, environment_id=event.environment_id)
        self.bus.run(MakeReviewStep(event.row_id, HANDOFF), actor, cause_id=event.id, environment_id=event.environment_id)

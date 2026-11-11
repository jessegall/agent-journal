from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle
from engine.event.moved import Moved
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.reviews.commands.make_review_step.make_review_step import MakeReviewStep
from core.modules.reviews.listeners.reviewer_ended_listener import MODULE_NAME
from core.modules.reviews.models.enums.point_finding import PointFinding
from core.modules.reviews.models.enums.step_outcome import StepOutcome
from core.modules.reviews.models.review_point import ReviewPoint
from core.modules.reviews.models.review import Review

OUTCOMES = {PointFinding.PASSED: StepOutcome.PASSED, PointFinding.SHORT: StepOutcome.FAILED, PointFinding.UNDECIDED: StepOutcome.NONE}
HANDOFF = "Handed the report to the agent that asked"


class ReviewReportedStepListener(CommitListener[Moved[Review]]):
    """When a reviewer reports, its steps show one line per point, then a line handing the report to the agent
    that asked."""

    name = "reviews.review-reported-step"
    moves = (ReviewLifecycle.approve, ReviewLifecycle.reject, ReviewLifecycle.leave_undecided)

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: Moved[Review], logged: LoggedEvent) -> None:
        actor = self.actors.actor(MODULE_NAME)
        for point in tuple(self.queries.query(ReviewPoint).filter(review_id=logged.row_id).ordered("number").all_rows()):
            reason = f": {point.reason}" if point.reason else ""
            self.bus.run(MakeReviewStep(logged.row_id, f"{point.number} {point.finding}{reason}", OUTCOMES[point.finding]), actor, cause_id=logged.id)
        self.bus.run(MakeReviewStep(logged.row_id, HANDOFF), actor, cause_id=logged.id)

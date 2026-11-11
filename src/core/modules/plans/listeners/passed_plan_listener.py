from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from core.modules.plans.models.checkpoint_pass import CheckpointPass
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.finished_plans import FinishedPlans


class PassedPlanListener(CommitListener[Created[CheckpointPass]]):
    """A pass of the checkpoint at the end of a plan closes the plan as completed, once every task of it has
    ended."""

    name = "plans.passed-plan"

    def __init__(self, rows: EventRows, finished: FinishedPlans) -> None:
        self.rows, self.finished = rows, finished

    def handle(self, event: Created[CheckpointPass], logged: LoggedEvent) -> None:
        self.finished.end(self.rows.required(Plan, event.row.plan_id), logged.id)

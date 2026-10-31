from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal


class OrchestratorStartGuard(Guard):
    """An agent the orchestrator drives starts no task itself; every task goes to a worker."""

    name = "coding.orchestrator-starts-no-task"
    event = "task.start"

    def check(self, change: Change[Model]) -> None:
        raise Refusal(f"task {change.row.id} goes to a worker", "leave it open for a worker, or choose the builder with journal driver choose coding.builder")

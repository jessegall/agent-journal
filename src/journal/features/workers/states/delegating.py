from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.features.workers.states.delegation import Delegation


@dataclass(frozen=True)
class Delegating(Delegation):
    """A task in hand as the orchestrator: handed to a worker and its report reviewed, never done by the agent itself."""

    name = "delegating"
    title = "Delegating a task"

    def plan_state(self, **fields) -> BaseState:
        from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
        return OrchestratingPlan(**fields)

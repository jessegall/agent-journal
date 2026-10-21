from dataclasses import dataclass, replace

from journal.engine.base_state import BaseState
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.features.workers.states.orchestrating import orchestrate
from journal.features.tasks.states.working import Working


@dataclass(frozen=True)
class Delegating(Working):
    """A task in hand as the orchestrator: handed to a worker and its report reviewed, never done by the agent itself."""

    name = "delegating"
    title = "Delegating a task"

    def plan_state(self, **fields) -> BaseState:
        from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
        return OrchestratingPlan(**fields)

    def continue_nudge(self, time: float) -> Nudge:
        from journal.features.workers.feature import Workers
        return Workers.TASK_DELEGATION.create(name=self.named(), logged=self.logged_words(time))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        answer = super().on_stop(event, settings)
        tasks = event.data.of(Tasks)
        return replace(answer, nudges=(*answer.nudges, orchestrate(tasks))) if tasks.open_ids else answer

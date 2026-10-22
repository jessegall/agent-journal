from dataclasses import dataclass, replace

from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.features.plans.states.plans_working import PlansWorking
from journal.features.workers.states.orchestrating import orchestrate


@dataclass(frozen=True)
class Delegation(PlansWorking):
    """Work in hand as the orchestrator, a task or a plan's: told to hand it to a worker and review the report, and at a stop with tasks open told to orchestrate them."""

    def continue_nudge(self, time: float) -> Nudge:
        from journal.features.workers.feature import Workers
        return Workers.TASK_DELEGATION.create(name=self.label(), logged=self.logged_words(time))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        answer = super().on_stop(event, settings)
        tasks = event.data.part(Tasks)
        return replace(answer, nudges=(*answer.nudges, orchestrate(tasks))) if tasks.open_ids else answer

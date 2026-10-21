from dataclasses import dataclass, replace

from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.idle import Idle as Stop
from journal.features.workers.states.orchestrating import orchestrate
from journal.features.plans.states.following_plan import FollowingPlan


@dataclass(frozen=True)
class OrchestratingPlan(FollowingPlan):
    """Following a plan as the orchestrator: the task in hand is handed to a worker and its report reviewed, never done by the agent itself."""

    name = "orchestrating_plan"
    title = "Orchestrating a plan"

    def continue_nudge(self, time: float) -> Nudge:
        from journal.features.workers.feature import Workers
        return Workers.DELEGATE_THE_TASK.create(name=self.named(), logged=self.logged_words(time))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        answer = super().on_stop(event, settings)
        tasks = event.data.of(Tasks)
        return replace(answer, nudges=(*answer.nudges, orchestrate(tasks))) if tasks.open_ids else answer

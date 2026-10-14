from dataclasses import dataclass

from journal.features.tasks.states.working import Working
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle as AgentIdle


@dataclass(frozen=True)
class RunningSequence(Working):
    """Working through the steps of a sequence, one at a time; idle between steps is told the next step."""

    name = "running_sequence"
    sequence_id: int = 0
    step: int = 0

    def idle(self, event: AgentIdle) -> Transition: ...

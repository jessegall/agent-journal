from dataclasses import dataclass

from journal.engine.permission import Permission
from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle as AgentIdle


@dataclass(frozen=True)
class RunningSequence(Paused):
    """Working through the steps of a sequence, one at a time; stopping between steps is told the step in hand, and the last step goes back to what the agent was doing."""

    name = "running_sequence"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    sequence_id: int = 0
    step: int = 0
    text: str = ""

    def with_step(self, step: int, text: str) -> "RunningSequence":
        from dataclasses import replace
        return replace(self, step=step, text=text)

    def idle(self, event: AgentIdle) -> Transition:
        from journal.features.sequences.feature import Sequences
        return self.stay(Sequences.STEP.about(n=self.sequence_id, step=self.step + 1, text=self.text))

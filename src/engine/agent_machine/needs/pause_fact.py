from dataclasses import dataclass

from engine.agent_stack.states.pause_cause import PauseCause
from engine.agent_machine.needs.fact import Fact


@dataclass(frozen=True)
class PauseFact(Fact):
    """The agent or one of its ancestors is paused: Paused is on its stack while any cause holds."""

    causes: tuple[PauseCause, ...]

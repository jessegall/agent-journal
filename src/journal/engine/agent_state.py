from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.compacting import Compacting
from journal.events.agent.session_ended import SessionEnded
from journal.support.said import Said
from journal.engine.support.transition import Transition


@dataclass(frozen=True)
class AgentState(BaseState):
    """A state of the chart's engine, which keeps one flat state on the agent's row: its answers stay and go, and a push from the base state is a move until the stack is on the row."""

    def stay(self, *says: Said) -> Transition:
        return Transition(self, nudges=says)

    def go(self, to: "AgentState", *says: Said) -> Transition:
        return Transition(to, nudges=says)

    def refuse(self, why: Said) -> Transition:
        return Transition(self, held=why)

    def on_compaction(self, event: Compacting, settings: Settings) -> Transition:
        return self.stay()

    def on_session_ended(self, event: SessionEnded, settings: Settings) -> Transition:
        from journal.engine.states.ended import Ended
        return self.go(Ended())

import re
from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.events.agent.agent_event import AgentEvent
from journal.support.said import Said
from journal.engine.support.transition import Transition


@dataclass(frozen=True)
class AgentState(BaseState):
    """A state of the chart's engine: a method per agent event, named after it in snake_case, says what happens there; an event with no method changes nothing. Goes when every state hears through its on_ listeners."""

    def on(self, event: AgentEvent) -> Transition:
        method = getattr(self, self.method_for(type(event)), None)
        return method(event) if method else self.stay()

    @staticmethod
    def method_for(event: type[AgentEvent]) -> str:
        return re.sub(r"(?<!^)(?=[A-Z])", "_", event.__name__).lower()

    def stay(self, *says: Said) -> Transition:
        return Transition(self, nudges=says)

    def go(self, to: "AgentState", *says: Said) -> Transition:
        return Transition(to, nudges=says)

    def refuse(self, why: Said) -> Transition:
        return Transition(self, held=why)

    def session_ended(self, event: AgentEvent) -> Transition:
        from journal.engine.states.ended import Ended
        return self.go(Ended())

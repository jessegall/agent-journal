import re
from dataclasses import dataclass, fields
from typing import ClassVar

from journal.engine.permission import Permission
from journal.events.agent.agent_event import AgentEvent
from journal.features.said import Said


@dataclass(frozen=True)
class AgentState:
    """One state the agent can be in. A method per agent event, named after it in snake_case, says what happens there; an event with no method changes nothing. `allows` is what the agent may do while here."""

    name: ClassVar[str]
    title: ClassVar[str] = ""
    """The state in the user's words, as the pages name it."""
    allows: ClassVar[frozenset[Permission]] = frozenset()

    def on(self, event: AgentEvent) -> "Transition":
        """Finds the method named after the event's class and calls it; the default stays put and says nothing."""
        method = getattr(self, self.method_for(type(event)), None)
        return method(event) if method else self.stay()

    @staticmethod
    def method_for(event: type[AgentEvent]) -> str:
        return re.sub(r"(?<!^)(?=[A-Z])", "_", event.__name__).lower()

    def stay(self, *says: Said) -> "Transition":
        from journal.engine.transition import Transition
        return Transition(self, says)

    def go(self, to: "AgentState", *says: Said) -> "Transition":
        from journal.engine.transition import Transition
        return Transition(to, says)

    def refuse(self, why: Said) -> "Transition":
        from journal.engine.transition import Transition
        return Transition(self, (), why)

    def session_ended(self, event: AgentEvent) -> "Transition":
        from journal.engine.states.ended import Ended
        return self.go(Ended())

    def to_data(self) -> dict:
        return {field.name: getattr(self, field.name) for field in fields(self)}

    @classmethod
    def from_data(cls, data: dict) -> "AgentState":
        known = {field.name for field in fields(cls)}
        return cls(**{name: value for name, value in data.items() if name in known})

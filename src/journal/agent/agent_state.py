from dataclasses import dataclass
from typing import ClassVar

from journal.agent.permission import Permission
from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class AgentState:
    """One state the agent can be in. A method per agent event, named after it in snake_case, says what happens there; an event with no method changes nothing. `allows` is what the agent may do while here."""

    name: ClassVar[str]
    allows: ClassVar[frozenset[Permission]] = frozenset()

    def on(self, event: AgentEvent) -> "Transition":
        """Finds the method named after the event's class and calls it; the default stays put and says nothing."""
        ...

    def stay(self, *nudges: str) -> "Transition": ...

    def go(self, to: "AgentState", *nudges: str) -> "Transition": ...

    def refuse(self, why: str) -> "Transition": ...

    def to_data(self) -> dict: ...

    @classmethod
    def from_data(cls, data: dict) -> "AgentState": ...

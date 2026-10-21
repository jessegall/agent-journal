from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class Awaited(AgentEvent):
    """The agent said with journal await that it waits for something outside its hands."""

    answers_hook: ClassVar[bool] = False

    what: str
    ends_on: str = ""
    """The rows that end the wait, table:id each, comma-separated."""

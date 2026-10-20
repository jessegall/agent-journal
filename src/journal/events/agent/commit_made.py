from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class CommitMade(AgentEvent):
    """The agent made a commit, seen at the head after its command ran, by its sha."""

    answers_hook: ClassVar[bool] = False

    sha: str

from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent
from journal.models.open_task import OpenTask


@dataclass(frozen=True)
class CommitMade(AgentEvent):
    """The agent made a commit, seen at the head after its command ran, by its sha: the tasks its message closed, and the task open next when the close left one. What the states say of it rides the reply of the command that committed, so it is never typed."""

    answers_hook: ClassVar[bool] = True

    sha: str
    closed: tuple[int, ...] = ()
    next_open: OpenTask | None = None

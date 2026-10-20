from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class JournalStarted(AgentEvent):
    """The journal started the agent here and sent its start block: a new conversation, or one resumed; never a compaction or a clear."""

    answers_hook: ClassVar[bool] = False

    source: str
    """How the conversation began, as the provider names it: startup or resume."""

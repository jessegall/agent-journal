from dataclasses import dataclass

from journal.agent.agent_state import AgentState
from journal.agent.transition import Transition
from journal.events.agent.prompt_submitted import PromptSubmitted


@dataclass(frozen=True)
class Waiting(AgentState):
    """The agent asked something and waits for the answer. Idle is fine here, and the answer sends it back to work."""

    name = "waiting"
    question_id: int = 0
    resume: str = "working"

    def prompt_submitted(self, event: PromptSubmitted) -> Transition: ...

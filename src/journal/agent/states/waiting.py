from dataclasses import dataclass

from journal.agent.states.paused import Paused
from journal.agent.transition import Transition
from journal.events.agent.prompt_submitted import PromptSubmitted


@dataclass(frozen=True)
class Waiting(Paused):
    """The agent asked the user something. Idle is fine, and the answer takes it back."""

    name = "waiting"
    question_id: int = 0

    def prompt_submitted(self, event: PromptSubmitted) -> Transition: ...

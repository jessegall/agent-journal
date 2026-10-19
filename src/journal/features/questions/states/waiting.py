from dataclasses import dataclass

from journal.engine.states.paused import Paused


@dataclass(frozen=True)
class Waiting(Paused):
    """The agent asked the user something. Idle is fine, and the answer takes it back; a prompt from the user is the answer in other words."""

    name = "waiting"
    title = "Waiting on a question"
    question_id: int = 0

    def awaiting(self) -> tuple[str, str]:
        return f"your answer to question {self.question_id}", f"questions:{self.question_id}"


from dataclasses import dataclass

from controllers.questions import ANSWERED_BY
from controllers.types import Questions
from resources.text import clipped
from resources.base import SYSTEM, USER

SHOWN = 200
OWED = " - it asks something back, so reply to the user"


@dataclass(frozen=True)
class Answer:
    """What the user did to a question, in the words the agent is told: the option they picked or the text they wrote, and whether a reply is owed."""
    title: str
    text: str
    picked: bool
    dismissed: bool

    @classmethod
    def of(cls, question) -> "Answer":
        return cls(question.title, question.outcome.strip(), question.chosen > 0, bool(question.dismissed))

    @property
    def what(self) -> str:
        return f'picked "{self.text}"' if self.picked else f'wrote "{clipped(self.text, SHOWN)}"'

    @property
    def owed(self) -> str:
        return OWED if not self.picked and "?" in self.text else ""

    def line(self) -> str:
        if self.dismissed:
            return f'the user dismissed "{self.title}": no answer is owed'
        return f'the user answered "{self.title}": {self.what}{self.owed}'


def answers_added(numbers: list[int], record, **_) -> str:
    """What follows 'question N completed' in the line an agent is sent: the user's answer itself, never only that the row changed; an answer the agent gave itself adds nothing."""
    questions = Questions(record, actor=SYSTEM)
    answered = [questions.rows.peek(n) for n in numbers if questions.rows.exists(n)]
    return "; ".join(Answer.of(question).line() for question in answered if question.data.get(ANSWERED_BY) == USER)

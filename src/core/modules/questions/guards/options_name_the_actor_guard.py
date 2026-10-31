import re

from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.questions.models.question import Question

PERSONAL = re.compile(r"\b(I|I'll|I'm|I've|me|my|we|us|our|you|your)\b", re.IGNORECASE)


class OptionsNameTheActorGuard(Guard):
    """Refuses a question whose option says I, me, my, we, us, our, you or your instead of naming who acts: the
    agent or the user."""

    name = "questions.options-name-the-actor"
    event = "question.create"
    short_flag = "waive"

    def check(self, change: Change[Model]) -> None:
        question = change.row
        if not isinstance(question, Question):
            return
        unclear = [option for option in question.options if PERSONAL.search(option)]
        if unclear:
            raise Refusal(f"an option states who acts by name, never I, we or you: {'; '.join(unclear)}", "name who acts: the agent or the user")

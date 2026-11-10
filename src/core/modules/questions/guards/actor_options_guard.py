import re

from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.questions.models.question import Question
from core.base.change.created import Created
from engine.command.context import Context

PERSONAL = re.compile(r"\b(I|I'll|I'm|I've|me|my|we|us|our|you|your)\b", re.IGNORECASE)


class ActorOptionsGuard(Guard[Created[Question]]):
    """Refuses a question whose option says I, me, my, we, us, our, you or your instead of naming who acts:
    the agent or the user."""

    name = "questions.options-name-the-actor"
    short_flag = "waive"

    def check(self, event: Created[Question], context: Context) -> None:
        question = event.row
        unclear = [option for option in question.options if PERSONAL.search(option)]
        if unclear:
            raise Refusal(f"an option states who acts by name, never I, we or you: {'; '.join(unclear)}", "name who acts: the agent or the user")

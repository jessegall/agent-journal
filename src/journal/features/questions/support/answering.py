from datetime import datetime, timezone

from journal.support.cards import Cards
from journal.support.actor import Actor
from journal.models.question import Question
from journal.repositories.questions import Questions
from journal.support.refused import Refused
from journal.support.chat_mark import ChatMark


class Answering:
    """The one place a question is answered, from the command or the viewer: the row keeps the answer and the chat shows a card; the agents waiting on it are released by their Waiting state when the row's event reaches them."""

    def __init__(self, questions: Questions, cards: Cards) -> None:
        self.questions, self.cards = questions, cards

    def answer(self, question: Question, text: str, by: Actor) -> Question:
        if question.is_answered():
            raise Refused(f"question {question.id} is answered already")
        answered = self.questions.save(question.answered(text, datetime.now(timezone.utc).timestamp()), by)
        label = f"You answered question {answered.id}" if by.is_the_user() else f"Question {answered.id} answered by {by.named}"
        self.cards.show(answered.environment_id, "", label, "questions", "good", "", f"questions:{answered.id}", by=by, shows=ChatMark.QUESTIONS)
        return answered

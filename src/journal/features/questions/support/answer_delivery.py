from datetime import datetime, timezone
from journal.models.support.ref import Ref

from journal.chat.moment_cards import MomentCards
from journal.support.actor import Actor
from journal.models.question import Question
from journal.repositories.questions import Questions
from journal.support.rejection import Rejection
from journal.support.card_kind import CardKind


class AnswerDelivery:
    """The one place a question is answered, from the command or the viewer: the row keeps the answer and the chat shows a card; the agents waiting on it are released by their Waiting state when the row's event reaches them."""

    def __init__(self, questions: Questions, cards: MomentCards) -> None:
        self.questions, self.cards = questions, cards

    def answer(self, question: Question, text: str, actor: Actor) -> Question:
        if question.is_answered():
            raise Rejection(f"question {question.id} is answered already")
        answered = self.questions.save(question.answered(text, datetime.now(timezone.utc).timestamp()), actor)
        label = f"You answered question {answered.id}" if actor.is_user() else f"Question {answered.id} answered by {actor.lookup}"
        self.cards.show(answered.environment_id, "", label, "questions", "good", "", Ref.build(answered), actor=actor, shows=CardKind.QUESTIONS)
        return answered

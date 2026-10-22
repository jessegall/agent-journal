from journal.chat.cards import Cards
from journal.events.listener import Listener
from journal.events.models.saved import Saved
from journal.models.question import Question
from journal.support.card_kind import CardKind


class QuestionCard(Listener[Saved]):
    """A question asked is a message in the chat that points at it, settled in place when it is answered; the question stays a row of its own."""

    def __init__(self, cards: Cards) -> None:
        self.cards = cards

    def handle(self, event: Saved) -> None:
        question = event.model
        if not isinstance(question, Question):
            return
        data = {"kind": "question", "row": f"questions:{question.id}", "n": question.id, "options": list(question.options), "answer": question.answer}
        self.cards.keyed(question.environment_id, f"question:{question.id}", question.text, data, question.creation_actor, CardKind.QUESTIONS, session=question.creation_actor.id)

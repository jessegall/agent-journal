from journal.engine.cards import Cards
from journal.models.actor import Actor
from journal.models.question import Question
from journal.repositories.questions import Questions


class Answering:
    """The one place a question is answered, from the command or the viewer: the row keeps the answer and the chat shows a card; the agents waiting on it are released by the workflow on the row."""

    def __init__(self, questions: Questions, cards: Cards) -> None:
        self.questions, self.cards = questions, cards

    def answer(self, question: Question, text: str, by: Actor) -> Question:
        answered = self.questions.save(question.answered(text), by)
        self.cards.show(answered.environment_id, "", f"You answered question {answered.id}", "question", "good", answered.answer, f"question:{answered.id}")
        return answered

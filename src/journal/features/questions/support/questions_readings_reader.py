from journal.features.questions.support.questions_readings import QuestionsReadings
from journal.models.agent import Agent
from journal.repositories.questions import Questions


class QuestionsReadingsReader:
    """Reads the questions feature's part of the Readings for an agent."""

    def __init__(self, questions: Questions) -> None:
        self.questions = questions

    def read(self, agent: Agent) -> QuestionsReadings:
        return QuestionsReadings(open=tuple(question.id for question in self.questions.open()))

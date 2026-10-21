from journal.features.questions.support.questions_data import QuestionsData
from journal.models.agent import Agent
from journal.repositories.questions import Questions


class QuestionsDataReader:
    """Reads the questions feature's part of the feature data for an agent."""

    def __init__(self, questions: Questions) -> None:
        self.questions = questions

    def read(self, agent: Agent) -> QuestionsData:
        return QuestionsData(open=tuple(question.row_id for question in self.questions.open()))

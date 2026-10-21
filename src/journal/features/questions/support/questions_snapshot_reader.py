from journal.features.questions.support.questions_snapshot import QuestionsSnapshot
from journal.models.agent import Agent
from journal.repositories.questions import Questions


class QuestionsSnapshotReader:
    """Reads the questions feature's part of the Snapshot for an agent."""

    def __init__(self, questions: Questions) -> None:
        self.questions = questions

    def read(self, agent: Agent) -> QuestionsSnapshot:
        return QuestionsSnapshot(open=tuple(question.id for question in self.questions.open()))

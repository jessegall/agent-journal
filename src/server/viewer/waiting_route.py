from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.query.queries import Queries
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from server.viewer.waiting_thing import WaitingThing


class WaitingRoute:
    """Answers GET /api/waiting for the phone's worker: each open question in every environment, newest first, by
    its reference alone, so a notice can count them and open the newest without saying what they are."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def waiting(self) -> list[WaitingThing]:
        container = synced_container(self.home)
        try:
            questions = container.get(Queries).query(Question).filter(state=QuestionState.OPEN).newest().all_rows()
            return [WaitingThing(f"questions:{question.id}") for question in questions]
        finally:
            container.get(Database).close()

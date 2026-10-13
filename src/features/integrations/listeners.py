from events import Fact
from events.integrations import ReplyApproved
from events.questions import QuestionCompleted
from features.integrations.details import SEND
from receiving import Listener
from resources.base import USER
from resources.types import Question
from serving import ReadRows


class SpotApprovedReply(Listener[QuestionCompleted]):
    """Your Send on a proposed text for this integration's tickets; any other answer sends nothing."""

    def __init__(self, service: str, approved: type[ReplyApproved]):
        self.service, self.approved = service, approved

    def listen(self, event: QuestionCompleted, questions: ReadRows[Question]) -> list[Fact]:
        question = questions.peek(event.n)
        if question.data.get("proposal") != self.service or question.outcome != SEND or question.data.get("answered_by") != USER:
            return []
        return [self.approved(question=question.n, ticket=int(question.refs[0].split(":")[1]), text=question.brief)]

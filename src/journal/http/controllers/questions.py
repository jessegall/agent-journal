from journal.features.questions.answering import Answering
from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.question import Question
from journal.repositories.questions import Questions


class QuestionController(Controller[Question]):
    """The agent's questions; one is open until the user answers it."""

    def __init__(self, questions: Questions, answering: Answering) -> None:
        self.repository, self.answering = questions, answering

    def is_open(self, row: Question) -> bool:
        return not row.is_answered()

    def answer(self, request: Request) -> Response:
        return Response.json(self.answering.answer(self.repository.find(request.number("id")), request.body.get("answer", ""), request.actor))

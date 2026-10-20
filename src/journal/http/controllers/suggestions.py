from journal.features.suggestions.support.suggesting import Suggesting
from journal.http.controllers.controller import Controller
from journal.http.support.request import Request
from journal.models.suggestion import Suggestion
from journal.models.suggestion_answer import SuggestionAnswer
from journal.repositories.suggestions import Suggestions
from journal.support.response import Response


class SuggestionController(Controller[Suggestion]):
    """The journal's suggestions, each answered once by the user: accepted, it names the page where the user finishes it."""

    def __init__(self, suggestions: Suggestions, suggesting: Suggesting) -> None:
        self.repository, self.suggesting = suggestions, suggesting

    def rows(self) -> list[Suggestion]:
        return self.repository.all()

    def is_open(self, row: Suggestion) -> bool:
        return not row.is_answered()

    def accept(self, request: Request) -> Response:
        return self.answered(request, SuggestionAnswer.ACCEPTED)

    def decline(self, request: Request) -> Response:
        return self.answered(request, SuggestionAnswer.DECLINED)

    def answered(self, request: Request, answer: SuggestionAnswer) -> Response:
        goes_to = self.suggesting.answer(self.repository.find(request.number("id")), answer, request.actor)
        return Response.json({"answer": answer, "go": goes_to})

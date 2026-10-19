from journal.http.controllers.writing_controller import WritingController
from journal.http.documents.doc_search import DocSearch
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.doc import Doc
from journal.repositories.docs import Docs


class DocController(WritingController[Doc]):
    """The project's documents, and the ones a search finds, best first."""

    def __init__(self, docs: Docs, search: DocSearch) -> None:
        self.repository, self.search = docs, search

    def located(self, request: Request) -> Response:
        return Response.json(self.search.located(request.query.get("words", "")))

from journal.http.controllers.writing_controller import WritingController
from journal.http.documents.doc_search import DocSearch
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.doc import Doc
from journal.engine.clock import Clock
from journal.http.support.model_fields import ModelFields
from journal.repositories.docs import Docs
from journal.repositories.doc_revisions import DocRevisions


class DocController(WritingController[Doc]):
    """The project's documents, the ones a search finds, best first, and each one's revisions, the open one kept on request."""

    repository: Docs

    def __init__(self, docs: Docs, search: DocSearch, revisions: DocRevisions, clock: Clock) -> None:
        self.repository, self.search, self.revisions, self.clock = docs, search, revisions, clock

    def revision_list(self, request: Request) -> Response:
        return Response.json([ModelFields.build(revision) for revision in self.revisions.document_revisions(self.repository.find(request.number("id")))])

    def revision_close(self, request: Request) -> Response:
        return Response.json(ModelFields.build(self.revisions.close(self.repository.find(request.number("id")), self.clock.time(), request.actor)))

    def located(self, request: Request) -> Response:
        return Response.json(self.search.located(request.query.get("words", "")))

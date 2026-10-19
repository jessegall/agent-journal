from journal.http.request import Request
from journal.http.response import Response
from journal.http.v3.attached_files import AttachedFiles
from journal.http.v3.doc_search import DocSearch
from journal.http.v3.files_asked import FilesAsked


class DocumentsController:
    """The Documents page's paths that are no row: the files attached to messages, a page at a time, and the documents a search finds."""

    def __init__(self, files: AttachedFiles, search: DocSearch) -> None:
        self.files, self.search = files, search

    def files_page(self, request: Request) -> Response:
        return Response.json(self.files.page(FilesAsked.from_query(request.query)))

    def located(self, request: Request) -> Response:
        return Response.json(self.search.located(request.query.get("words", "")))

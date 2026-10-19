from journal.http.files.project_files import ProjectFiles
from journal.http.support.request import Request
from journal.support.response import Response


class ProjectFileController:
    """The project's files as the Code page reads them: a folder's entries, a file's text, its uncommitted diff, and a find by name."""

    def __init__(self, files: ProjectFiles) -> None:
        self.files = files

    def index(self, request: Request) -> Response:
        return Response.json(self.files.folder(request.query.get("folder", "")))

    def find(self, request: Request) -> Response:
        return Response.json(self.files.find(request.query.get("q", "")))

    def show(self, request: Request) -> Response:
        found = self.files.file(request.query.get("path", ""))
        return Response.json(found) if found else Response.not_found("no such file")

    def diff(self, request: Request) -> Response:
        return Response.json({"diff": self.files.diff(request.query.get("path", ""))})

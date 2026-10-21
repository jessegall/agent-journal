from journal.http.files.project_files import ProjectFiles
from journal.http.support.file_response import FileResponse
from journal.http.support.request import Request
from journal.support.response import Response


class ProjectFileController:
    """The project's files as the Files page reads them: a folder's entries, a file's text or bytes, its uncommitted diff, and a find by name."""

    def __init__(self, files: ProjectFiles) -> None:
        self.files = files

    def index(self, request: Request) -> Response:
        return Response.json(self.files.folder(request.query.get("folder", "")))

    def find(self, request: Request) -> Response:
        return Response.json(self.files.find(request.query.get("q", "")))

    def show(self, request: Request) -> Response:
        rows = self.files.file(request.query.get("path", ""))
        return Response.json(rows) if rows else Response.absent("no such file")

    def raw(self, request: Request) -> FileResponse | Response:
        file = self.files.raw(request.query.get("path", ""))
        return FileResponse(*file) if file else Response.absent("no such file")

    def diff(self, request: Request) -> Response:
        return Response.json({"diff": self.files.diff(request.query.get("path", ""))})

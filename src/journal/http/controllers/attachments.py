from journal.http.attachments.attached_files import AttachedFiles
from journal.http.attachments.attachments import Attachments
from journal.http.attachments.files_asked import FilesAsked
from journal.http.support.file_response import FileResponse
from journal.http.support.request import Request
from journal.support.response import Response

class AttachmentController:
    """The files attached to rows: one served by its name, and those attached to messages, newest first, a page at a time, as the Documents page lists them."""

    def __init__(self, files: AttachedFiles, attachments: Attachments) -> None:
        self.files, self.attachments = files, attachments

    def index(self, request: Request) -> Response:
        return Response.json(self.files.page(FilesAsked.from_query(request.query)))

    def file(self, request: Request):
        found = self.attachments.read(request.params["table"], request.number("id"), request.params["name"])
        return FileResponse(*found) if found else Response.not_found("no such file")

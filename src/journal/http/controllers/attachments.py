from journal.http.attachments.attached_files import AttachedFiles
from journal.http.attachments.attachments import Attachments
from journal.http.attachments.file_request import FileRequest
from journal.http.support.sandboxed_file_response import SandboxedFileResponse
from journal.http.support.request import Request
from journal.repositories.dumps import Dumps
from journal.repositories.messages import Messages
from journal.support.response import Response


class AttachmentController:
    """The files attached to rows: one served by its name when its row is in the asking environment, and those attached to messages, newest first, a page at a time, as the Documents page lists them."""

    def __init__(self, files: AttachedFiles, attachments: Attachments, messages: Messages, dumps: Dumps) -> None:
        self.files, self.attachments = files, attachments
        self.rows = {"messages": messages, "dumps": dumps}

    def index(self, request: Request) -> Response:
        return Response.json(self.files.page(FileRequest.query_request(request.query)))

    def file(self, request: Request):
        table, id = request.params["table"], request.number("id")
        if table not in self.rows or not self.rows[table].matching(id=id):
            return Response.absent("no such file")
        rows = self.attachments.read(table, id, request.params["name"])
        return SandboxedFileResponse(*rows) if rows else Response.absent("no such file")

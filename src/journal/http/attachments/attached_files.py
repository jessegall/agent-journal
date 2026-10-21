import mimetypes
from urllib.parse import quote

from journal.http.attachments.attached_file import AttachedFile
from journal.http.attachments.attachments import Attachments
from journal.http.attachments.file_request import FileRequest
from journal.http.attachments.file_view import FileView
from journal.models.message import Message
from journal.support.ref import Ref
from journal.repositories.messages import Messages

TITLE = 80


class AttachedFiles:
    """Every file attached to a message here, newest first, a page at a time, counted by kind and by what they are attached to."""

    def __init__(self, messages: Messages, attachments: Attachments) -> None:
        self.messages, self.attachments = messages, attachments

    def page(self, requested: FileRequest) -> FileView:
        all_items = sorted((f for m in self.messages.scoped() for f in self.build(m)), key=lambda f: -f.time)
        rows = [f for f in all_items if requested.contains(f)]
        shelves = {Message.table(): len(all_items)} if all_items else {}
        images = sum(f.image for f in all_items)
        return FileView(files=rows[requested.offset:requested.offset + requested.last], more=len(rows) > requested.offset + requested.last, total=len(rows),
                          counts={"all": len(all_items), "images": images, "other": len(all_items) - images, "shelves": shelves})

    def build(self, message: Message) -> list[AttachedFile]:
        files = []
        for name in message.files:
            path = self.attachments.path(Message.table(), message.id, name)
            if path.is_file():
                files.append(AttachedFile(str(Ref.build(message)), message.text[:TITLE], name, message.captions.get(name, ""), path.stat().st_size, path.stat().st_mtime,
                                          (mimetypes.guess_type(name)[0] or "").startswith("image/"), f"/journal/messages/{message.id}/files/{quote(name, safe='')}"))
        return files

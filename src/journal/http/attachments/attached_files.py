import mimetypes
from urllib.parse import quote

from journal.http.attachments.attached_file import AttachedFile
from journal.http.attachments.attachments import Attachments
from journal.http.attachments.files_asked import FilesAsked
from journal.http.attachments.files_shown import FilesShown
from journal.models.message import Message
from journal.support.ref import Ref
from journal.repositories.messages import Messages

TITLE = 80


class AttachedFiles:
    """Every file attached to a message here, newest first, a page at a time, counted by kind and by what they are attached to."""

    def __init__(self, messages: Messages, attachments: Attachments) -> None:
        self.messages, self.attachments = messages, attachments

    def page(self, asked: FilesAsked) -> FilesShown:
        every = sorted((f for m in self.messages.in_() for f in self.of(m)), key=lambda f: -f.time)
        rows = [f for f in every if asked.holds(f)]
        shelves = {Message.table(): len(every)} if every else {}
        images = sum(f.image for f in every)
        return FilesShown(files=rows[asked.skip:asked.skip + asked.last], more=len(rows) > asked.skip + asked.last, total=len(rows),
                          counts={"all": len(every), "images": images, "other": len(every) - images, "shelves": shelves})

    def of(self, message: Message) -> list[AttachedFile]:
        files = []
        for name in message.files:
            path = self.attachments.path(Message.table(), message.id, name)
            if path.is_file():
                files.append(AttachedFile(str(Ref.to(message)), message.text[:TITLE], name, message.captions.get(name, ""), path.stat().st_size, path.stat().st_mtime,
                                          (mimetypes.guess_type(name)[0] or "").startswith("image/"), f"/journal/messages/{message.id}/files/{quote(name, safe='')}"))
        return files

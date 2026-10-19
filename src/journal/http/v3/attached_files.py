import mimetypes
from urllib.parse import quote

from journal.http.v3.attached_file import AttachedFile
from journal.http.v3.attachments import Attachments
from journal.http.v3.files_asked import FilesAsked
from journal.http.v3.files_shown import FilesShown
from journal.models.message import Message
from journal.repositories.messages import Messages

TITLE = 80
"""How much of a message's text titles a file attached to it."""


class AttachedFiles:
    """Every file attached to a message here, newest first, a page at a time, counted by kind and by what they are attached to."""

    def __init__(self, messages: Messages, attachments: Attachments) -> None:
        self.messages, self.attachments = messages, attachments

    def page(self, asked: FilesAsked) -> FilesShown:
        every = sorted((f for m in self.messages.in_() for f in self.of(m)), key=lambda f: -f.at)
        found = [f for f in every if asked.holds(f)]
        shelves = {"message": len(every)} if every else {}
        images = sum(f.image for f in every)
        return FilesShown(files=found[asked.skip:asked.skip + asked.last], more=len(found) > asked.skip + asked.last, found=len(found),
                          counts={"all": len(every), "images": images, "other": len(every) - images, "shelves": shelves})

    def of(self, message: Message) -> list[AttachedFile]:
        files = []
        for name in message.files:
            path = self.attachments.path("message", message.id, name)
            if path.is_file():
                files.append(AttachedFile("message", message.id, message.text[:TITLE], name, message.captions.get(name, ""), path.stat().st_size, path.stat().st_mtime,
                                          (mimetypes.guess_type(name)[0] or "").startswith("image/"), f"/api/message/{message.id}/files/{quote(name, safe='')}"))
        return files

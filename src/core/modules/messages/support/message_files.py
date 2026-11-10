import re
import shutil
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from core.base.file_access import FileAccess
from core.modules.messages.models.message import Message

PENDING_PATTERN = re.compile(r"^[0-9a-f]{16}/[^/\\]+$")


class MessageFiles:
    """The files sent with messages: an uploaded file waits in the pending folder under a token and
    its name, and a message that names it takes it into the folder of the message's own number,
    where the agent and the viewer read it."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def pending_path(self, pending: str) -> Path:
        return self.home.pending_files / pending

    def read_attached(self, message: Message, name: str) -> bytes:
        if name not in message.files or name in ("", ".", "..") or Path(name).name != name or "\\" in name or "\x00" in name:
            raise Refusal("name an attachment declared on this context message")
        folder = self.home.message_files(message.id)
        path = folder / name
        root = self.home.message_files(0).parent.resolve()
        if folder.resolve() != root / str(message.id) or path.resolve().parent != folder.resolve() or not path.is_file():
            raise Refusal("this message attachment is unavailable")
        return FileAccess.shared().binary(path)

    def check(self, pending: tuple[str, ...]) -> tuple[str, ...]:
        for file in pending:
            if not PENDING_PATTERN.match(file) or not self.pending_path(file).is_file():
                raise Refusal(f"no uploaded file {file}", "upload it again")
        names = tuple(file.split("/", 1)[1] for file in pending)
        if len(set(names)) != len(names):
            raise Refusal("two of the files have the same name", "rename one")
        return names

    def attach(self, message_id: int, pending: tuple[str, ...]) -> None:
        folder = self.home.message_files(message_id)
        folder.mkdir(parents=True, exist_ok=True)
        for file in pending:
            shutil.move(str(self.pending_path(file)), str(folder / file.split("/", 1)[1]))
            self.pending_path(file).parent.rmdir()

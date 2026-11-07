from core.base.journal_home import JournalHome
from core.base.file_access import FileAccess
from pathlib import PurePosixPath
from server.viewer.file_answer import FileAnswer
from urllib.parse import unquote
import mimetypes
import secrets
from server.viewer.module_files import UNKNOWN_TYPE

TOKEN_BYTES = 8
LIMIT_BYTES = 64 * 1024 * 1024


class FileRoute:
    """The files of the chat: an upload waits in the pending folder under a token until a message takes it,
    and a message's file is read back by the message's number and its name."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    @staticmethod
    def safe_name(name: str) -> str:
        last = PurePosixPath(unquote(name).replace("\\", "/")).name
        return last if last not in ("", ".", "..") else "file"

    def upload(self, name: str, data: bytes) -> str:
        pending = f"{secrets.token_hex(TOKEN_BYTES)}/{self.safe_name(name)}"
        path = self.home.pending_files / pending
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write_binary(path, data)
        return pending

    def download(self, message_id: int, name: str) -> FileAnswer | None:
        path = self.home.message_files(message_id) / self.safe_name(name)
        if not path.is_file():
            return None
        return FileAnswer(FileAccess.shared().binary(path), mimetypes.guess_type(path.name)[0] or UNKNOWN_TYPE)

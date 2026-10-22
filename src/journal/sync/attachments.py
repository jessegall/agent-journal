import mimetypes
from pathlib import Path

from journal.config import Config
from journal.models.pending_upload import PendingUpload
from journal.repositories.pending_uploads import PendingUploads
from journal.support.actor import Actor
from journal.sync.team_account import TeamAccount
from journal.sync.team_refusal import TeamRefusal
from journal.sync.team_server_link import TeamServerLink
from sync_server.file_place import FilePlace

FOLDERS = {"messages": "message", "dumps": "dump"}


class Attachments:
    """The files attached to messages and dumps, kept under .journal/files/<folder>/<id>/, named as they came. On a shared journal a file stored here waits to be sent to the team server, and one this machine lacks is fetched from it."""

    def __init__(self, config: Config, uploads: PendingUploads, account: TeamAccount, link: TeamServerLink) -> None:
        self.home, self.uploads, self.account, self.link = config.files, uploads, account, link

    def store(self, table: str, id: int, name: str, data: bytes) -> str:
        safe = Path(name).name or "file"
        folder = self.home / FOLDERS[table] / str(id)
        folder.mkdir(parents=True, exist_ok=True)
        (folder / safe).write_bytes(data)
        if self.account.is_joined():
            self.uploads.save(PendingUpload(row_table=table, row=id, name=safe), Actor.system())
        return safe

    def path(self, table: str, id: int, name: str) -> Path:
        return self.home / FOLDERS[table] / str(id) / Path(name).name

    def read(self, table: str, id: int, name: str) -> tuple[str, bytes] | None:
        if table not in FOLDERS:
            return None
        path = self.path(table, id, name)
        if not path.is_file() and self.account.is_joined():
            self.fetched(table, id, name, path)
        if not path.is_file():
            return None
        return mimetypes.guess_type(path.name)[0] or "application/octet-stream", path.read_bytes()

    def fetched(self, table: str, id: int, name: str, path: Path) -> None:
        try:
            data = self.link.fetch_file(FilePlace(table, id, Path(name).name))
        except (OSError, TeamRefusal):
            return
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)

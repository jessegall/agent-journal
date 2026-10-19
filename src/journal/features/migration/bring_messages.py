import shutil
from pathlib import Path

from journal.config import Config
from journal.features.migration.environment_kind import EnvironmentKind
from journal.features.migration.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.message import Message
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.migrated_rows import MigratedRows


class BringMessages(EnvironmentKind):
    """Every message, the packed ones too, with its author, its time, what it replies to and its attachments."""

    kind = "message"
    title = "messages"

    def __init__(self, environments: Environments, ledger: MigratedRows, messages: Messages, config: Config) -> None:
        super().__init__(environments, ledger)
        self.messages, self.config = messages, config

    def made(self, row: Version3Row, into: Environment, attached: Path, by: Actor) -> Message:
        replied = self.message_of(row, into)
        files = tuple(sorted(path.name for path in attached.iterdir())) if attached.is_dir() else ()
        message = self.messages.imported(Message(environment_id=into.id, author=Author(row.author()), text=row.brief, reply_to=replied.id if replied else None, read_at=row.read_at(),
                                                 idempotency=row.data.get("idempotency", ""), files=files), row.made_at(), by)
        kept = self.config.files / "message" / str(message.id)
        for name in files:
            kept.mkdir(parents=True, exist_ok=True)
            shutil.copy2(attached / name, kept / name)
        return message

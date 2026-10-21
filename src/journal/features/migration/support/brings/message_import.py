import shutil
from pathlib import Path

from journal.config import Config
from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.message import Message
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.migrated_rows import MigratedRows


class MessageImport(EnvironmentKind):
    """Every message, the packed ones too, with its author, its time, what it replies to and its attachments."""

    kind = "message"
    title = "messages"

    def __init__(self, environments: Environments, tally: MigratedRows, messages: Messages, config: Config) -> None:
        super().__init__(environments, tally)
        self.messages, self.config = messages, config

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> Message:
        replied = self.message(row, target)
        files = tuple(sorted(path.name for path in attached.iterdir())) if attached.is_dir() else ()
        message = self.messages.imported(Message(environment_id=target.row_id, author=Author(row.author()), text=row.brief, reply_target=replied.id if replied else None, read_at=row.reading_moment(),
                                                 idempotency=row.data.get("idempotency", ""), files=files), row.creation_moment(), actor)
        stored = self.config.files / "message" / str(message.id)
        for name in files:
            stored.mkdir(parents=True, exist_ok=True)
            shutil.copy2(attached / name, stored / name)
        return message

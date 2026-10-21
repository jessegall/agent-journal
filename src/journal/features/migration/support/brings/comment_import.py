from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.link import Link
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.migrated_rows import MigratedRows


class CommentImport(EnvironmentKind):
    """A comment becomes a message linked to the row it was written under, once that row has come across."""

    kind = "comment"
    title = "comments"

    def __init__(self, environments: Environments, tally: MigratedRows, messages: Messages, links: Links) -> None:
        super().__init__(environments, tally)
        self.messages, self.links = messages, links

    def skipped(self, row: Version3Row, target: Environment) -> str:
        return super().skipped(row, target) or ("" if self.parent(row, target) else "the row it was written under did not come across")

    def parent(self, row: Version3Row, target: Environment) -> Ref | None:
        return next((rows for ref in row.refs if (rows := self.ledger.referred(target.name, ref))), None)

    def created(self, row: Version3Row, receiver: Environment, attached: Path, actor: Actor) -> Message:
        comment = self.messages.imported(Message(environment_id=receiver.id, author=Author(row.author()), text=row.brief, read_at=row.reading_moment()), row.creation_moment(), actor)
        self.links.save(Link(source=Ref.build(comment), target=self.parent(row, receiver), kind=Messages.COMMENT_LINK), actor)
        return comment

from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.link import Link
from journal.models.message import Message
from journal.support.ref import Ref
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.migrated_rows import MigratedRows


class BringComments(EnvironmentKind):
    """A comment becomes a message linked to the row it was written under, once that row has come across."""

    kind = "comment"
    title = "comments"

    def __init__(self, environments: Environments, ledger: MigratedRows, messages: Messages, links: Links) -> None:
        super().__init__(environments, ledger)
        self.messages, self.links = messages, links

    def left_behind(self, row: Version3Row, into: Environment) -> str:
        return super().left_behind(row, into) or ("" if self.under(row, into) else "the row it was written under did not come across")

    def under(self, row: Version3Row, into: Environment) -> Ref | None:
        return next((found for ref in row.refs if (found := self.ledger.referred(into.name, ref))), None)

    def made(self, row: Version3Row, into: Environment, attached: Path, by: Actor) -> Message:
        comment = self.messages.imported(Message(environment_id=into.id, author=Author(row.author()), text=row.brief, read_at=row.read_at()), row.made_at(), by)
        self.links.save(Link(source=Ref.to(comment), target=self.under(row, into), kind=Messages.COMMENTS_ON), by)
        return comment

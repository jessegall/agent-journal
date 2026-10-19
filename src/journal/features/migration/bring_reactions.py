from pathlib import Path

from journal.features.migration.environment_kind import EnvironmentKind
from journal.features.migration.version_3_row import Version3Row
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.link import Link
from journal.models.reaction import Reaction
from journal.models.ref import Ref
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.reactions import REACTS, Reactions


class BringReactions(EnvironmentKind):
    """A reaction keeps its face and the message it sits on, once that message has come across."""

    kind = "reaction"
    title = "reactions"

    def __init__(self, environments: Environments, ledger: MigratedRows, reactions: Reactions, links: Links) -> None:
        super().__init__(environments, ledger)
        self.reactions, self.links = reactions, links

    def left_behind(self, row: Version3Row, into: Environment) -> str:
        return super().left_behind(row, into) or ("" if self.message_of(row, into) else "the message it sits on did not come across")

    def made(self, row: Version3Row, into: Environment, attached: Path, by: Actor) -> Reaction:
        reaction = self.reactions.imported(Reaction(environment_id=into.id, face=row.data.get("face", ""), author=Author(row.author())), row.made_at(), by)
        self.links.save(Link(source=Ref.to(reaction), target=self.message_of(row, into), kind=REACTS), by)
        return reaction

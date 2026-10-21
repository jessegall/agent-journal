from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.link import Link
from journal.models.reaction import Reaction
from journal.models.support.ref import Ref
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.reactions import REACTS, Reactions


class ReactionImport(EnvironmentKind):
    """A reaction keeps its face and the message it sits on, once that message has come across."""

    kind = "reaction"
    title = "reactions"

    def __init__(self, environments: Environments, tally: MigratedRows, reactions: Reactions, links: Links) -> None:
        super().__init__(environments, tally)
        self.reactions, self.links = reactions, links

    def skipped(self, row: Version3Row, target: Environment) -> str:
        return super().skipped(row, target) or ("" if self.message(row, target) else "the message it sits on did not come across")

    def created(self, row: Version3Row, receiver: Environment, attached: Path, actor: Actor) -> Reaction:
        reaction = self.reactions.imported(Reaction(environment_id=receiver.row_id, face=row.data.get("face", ""), author=Author(row.author())), row.creation_moment(), actor)
        self.links.save(Link(source=Ref.build(reaction), target=self.ledger.counterpart(receiver.name, tuple(ref for ref in row.refs if ref.startswith("message:"))), kind=REACTS), actor)
        return reaction

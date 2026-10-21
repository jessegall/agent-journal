from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.fact import Fact
from journal.repositories.environments import Environments
from journal.repositories.facts import Facts
from journal.repositories.migrated_rows import MigratedRows


class FactImport(EnvironmentKind):
    """A fact keeps its text and keywords; a struck one stays behind."""

    kind = "fact"
    title = "facts"

    def __init__(self, environments: Environments, ledger: MigratedRows, facts: Facts) -> None:
        super().__init__(environments, ledger)
        self.facts = facts

    def skipped(self, row: Version3Row, into: Environment) -> str:
        return super().skipped(row, into) or ("struck" if row.completed else "")

    def created(self, row: Version3Row, into: Environment, attached: Path, actor: Actor) -> Fact:
        return self.facts.imported(Fact(environment_id=into.id, text=row.brief or row.title, keywords=tuple(row.listed("keywords"))), row.creation_time(), actor)
